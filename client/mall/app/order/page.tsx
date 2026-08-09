"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { api } from "../_lib/api/api";
import { CartItem } from "../_lib/types/cart_item";
import { UserContext } from "../_lib/context/UserProvider";
import { useRouter } from "next/navigation";
import {
  loadTossPayments,
  ANONYMOUS,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { won } from "../_lib/util/common";
import PaymentWidgets from "../_component/Payment";
import Image from "next/image";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

const INITIAL_FORM: FormState = {
  name: "",
  phone: "",
  zipcode: "",
  address: "",
  addressDetail: "",
  memo: "",
};

interface FormState {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  memo: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function OrderPage() {
  const [shipping, setShipping] = useState<FormState>(INITIAL_FORM);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 0,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  const { user } = useContext(UserContext);
  const router = useRouter();

  // 유저 조회 및 장바구니 상품 렌더링
  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    setShipping({
      name: user.username,
      phone: user.phone,
      zipcode: "",
      address: user.address,
      addressDetail: "",
      memo: "",
    });

    async function loadCart() {
      if (!user) return;
      const receivedCartItems = await api.get<CartItem[]>(`cart`);

      setCartItems(receivedCartItems);
    }

    loadCart();
  }, [user]);

  // 토스페이먼츠 위젯
  useEffect(() => {
    async function fetchPaymentWidgets() {
      if (!user) return;

      const tossPayment = await loadTossPayments(
        "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm",
      ); // test용 위젯 키 (api키랑은 별개)
      const widgets = tossPayment.widgets({
        customerKey: user.id,
      });

      setWidgets(widgets);
    }
    fetchPaymentWidgets();
  }, [clientKey]);

  useEffect(() => {
    {
      async function renderPaymentWidgets() {
        if (widgets === null) {
          return;
        }

        await widgets.setAmount(amount);

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);
        setReady(true);
      }
      renderPaymentWidgets();
    }
  }, [widgets]);

  useEffect(() => {
    if (widgets === null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  // 배송비 및 할인가 적용 전 총액
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.productSpec.productView.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );
  const shippingCost = subtotal >= 50000 ? 0 : 3500;
  const total = subtotal + shippingCost;

  // 배송지 작성 필드
  const setField =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setShipping((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  // 필수 내용 검증 함수
  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!shipping.name.trim()) next.name = "받는 분 성함을 입력해 주세요.";
    if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(shipping.phone.trim()))
      next.phone = "올바른 휴대폰 번호를 입력해 주세요.";
    if (!shipping.address.trim()) next.address = "배송지 주소를 입력해 주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!agree) {
      window.alert("주문 내용 확인 및 약관 동의가 필요해요.");
      return;
    }

    setSubmitting(true);
    try {
      if (widgets === null || user === null) {
        return;
      }

      const { orderId, amount, orderName } = await api.post<{
        orderId: string;
        amount: number;
        orderName: string;
      }>("payments/prepare", {
        cartItemIds: cartItems.map((item) => item.id),
        shipping,
      });
      // 결제창에 보여 주는 금액도 서버가 계산해 저장한 값만 사용
      const paymentAmount = { currency: "KRW", value: amount };
      setAmount(paymentAmount);
      await widgets.setAmount(paymentAmount);

      await widgets.requestPayment({
        orderId: orderId,
        orderName: orderName,
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail",
        customerEmail: user.email,
        customerName: user.username,
        customerMobilePhone: user.phone.replaceAll("-", ""),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-body text-ink">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <header className="mb-10 border-b pb-6 border-line">
          <p className="mb-1 font-mono text-xs tracking-widest uppercase text-moss">
            Mall
          </p>
          <h1 className="font-display text-4xl md:text-5xl">주문서 작성</h1>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          {/* 왼쪽: 주문 상품 + 배송지 + 결제수단 */}
          <div className="space-y-10">
            {/* 주문 상품 */}
            <section className="mb-3">
              <h2 className="mb-4 font-mono text-xs tracking-widest text-moss">
                주문 상품 ({cartItems.length})
              </h2>
              <ul className="border-line">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 border-t py-4 first:border-t-0 border-line"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm text-xl bg-surface border border-line">
                      <Image
                        width={56}
                        height={56}
                        src={item.productSpec.productView.images[0].secure_url}
                        alt={`cart item preview-${item.productSpec.productView.product.name}`}
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-base">
                        {`${item.productSpec.productView.product.name} ${item.productSpec.productView.color}-${item.productSpec.size}`}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {item.productSpec.productView.product.description} ·{" "}
                        {item.quantity}개
                      </p>
                    </div>
                    <p className="font-mono text-sm">
                      {won(
                        item.productSpec.productView.product.price *
                          item.quantity,
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 배송지 정보 */}
            <section>
              <h2 className="mb-4 font-mono text-xs tracking-widest text-moss">
                배송지 정보
              </h2>
              <div className="space-y-4 bg-surface">
                <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                  <Field label="받는 분" error={errors.name}>
                    <input
                      value={shipping.name}
                      onChange={setField("name")}
                      placeholder="홍길동"
                      className={`w-full border px-3 py-2.5 text-sm outline-none ${errors.name ? "border-rust" : "border-line"}`}
                    />
                  </Field>
                  <Field label="휴대폰 번호" error={errors.phone}>
                    <input
                      value={shipping.phone}
                      onChange={setField("phone")}
                      placeholder="010-1234-5678"
                      className={`w-full border px-3 py-2.5 text-sm outline-none ${errors.name ? "border-rust" : "border-line"}`}
                    />
                  </Field>
                  <Field label="우편번호" className="md:col-span-1">
                    <input
                      value={shipping.zipcode}
                      onChange={setField("zipcode")}
                      placeholder="12345"
                      className="w-full border px-3 py-2.5 text-sm outline-none border-line"
                    />
                  </Field>
                  <Field
                    label="주소"
                    error={errors.address}
                    className="md:col-span-2"
                  >
                    <input
                      value={shipping.address}
                      onChange={setField("address")}
                      placeholder="서울시 종로구 자하문로 10길"
                      className={`w-full border px-3 py-2.5 text-sm outline-none ${errors.name ? "border-rust" : "border-line"}`}
                    />
                  </Field>
                  <Field label="상세 주소" className="md:col-span-2">
                    <input
                      value={shipping.addressDetail}
                      onChange={setField("addressDetail")}
                      placeholder="101동 202호"
                      className="w-full border px-3 py-2.5 text-sm outline-none border-line"
                    />
                  </Field>
                  <Field label="배송 요청사항" className="md:col-span-2">
                    <textarea
                      value={shipping.memo}
                      onChange={setField("memo")}
                      placeholder="문 앞에 놓아주세요."
                      rows={2}
                      className="w-full resize-none border px-3 py-2.5 text-sm outline-none border-line"
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* 결제 수단 */}
            <PaymentWidgets />
          </div>

          {/* 오른쪽: 결제 금액 영수증 */}
          <aside className="lg:sticky lg:top-10 lg:self-start">
            <div className="relative px-6 pb-8 pt-7 shadow-sm border-surface bg-surface">
              <p className="mb-5 font-mono text-xs tracking-widest text-moss">
                PAYMENT SUMMARY
              </p>

              <dl className="space-y-2.5 font-mono text-sm">
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ink-soft)" }}>상품 금액</dt>
                  <dd>{won(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt style={{ color: "var(--ink-soft)" }}>배송비</dt>
                  <dd>{shippingCost === 0 ? "무료" : won(shippingCost)}</dd>
                </div>
              </dl>

              <div className="my-5 border-t border-dashed border-line" />

              <div className="flex items-baseline justify-between">
                <span className="font-display text-lg">총 결제금액</span>
                <span className="font-mono text-xl text-ochre">
                  {won(total)}
                </span>
              </div>

              <label className="mt-6 flex items-center cursor-pointer gap-2 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#5B6B4F]"
                />
                <span>주문 내용을 확인했으며, 결제 진행에 동의합니다.</span>
              </label>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!ready}
                className="mt-5 w-full py-3.5 text-sm tracking-wide text-white transition hover:opacity-90 disabled:opacity-50 bg-ink"
              >
                {submitting ? "처리 중…" : `${won(total)} 결제하기`}
              </button>

              <div
                aria-hidden
                className="absolute -bottom-2 left-0 right-0 h-4"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--bg) 25%, transparent 25.5%), linear-gradient(225deg, var(--bg) 25%, transparent 25.5%)",
                  backgroundSize: "16px 16px",
                  backgroundColor: "var(--surface)",
                }}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs" style={{ color: "#5B6357" }}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs" style={{ color: "#A6472E" }}>
          {error}
        </p>
      )}
    </div>
  );
}
