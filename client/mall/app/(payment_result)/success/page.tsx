"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "../../_lib/api/api";
import { won } from "@/app/_lib/util/common";
import PerforatedEdge from "@/app/_component/PerforatedEdge";

type ConfirmState = "loading" | "success";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmState>("loading");

  const [orderInfo, setOrderInfo] = useState<{ amount: number } | null>(null);

  const requestData = {
    orderId: searchParams.get("orderId"),
    amount: Number(searchParams.get("amount")),
    paymentKey: searchParams.get("paymentKey"),
  };

  async function confirm() {
    await api.post("payments/confirm", requestData);
    setState("success");
    setOrderInfo({ amount: requestData.amount });
  }

  const initialRef = useRef(false);

  useEffect(() => {
    if (initialRef.current) {
      return;
    } else {
      initialRef.current = true;
    }

    async function processPayment() {
      try {
        if (
          !requestData.orderId ||
          !requestData.paymentKey ||
          !Number.isInteger(requestData.amount)
        ) {
          router.replace("/fail?message=결제 실패");
          return;
        }

        await confirm();
      } catch (err) {
        console.error(err);
        router.replace("/fail?message=결제 실패");
      }
    }

    processPayment();
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F4EC] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-[#2B2A26]/10 shadow-sm">
        <PerforatedEdge />

        <div className="px-8 py-10 font-mono text-[#2B2A26] text-center">
          {state === "loading" && <LoadingView />}
          {state === "success" && orderInfo && (
            <SuccessView
              amount={orderInfo.amount}
              onGoHome={() => router.push("/")}
            />
          )}
        </div>

        <PerforatedEdge flip />
      </div>
    </main>
  );
}

function LoadingView() {
  return (
    <>
      <p className="text-xs tracking-[0.3em] text-[#4A5D45]">CONFIRMING</p>
      <div className="my-6 border-t border-dashed border-[#2B2A26]/30" />
      <p className="text-sm text-[#2B2A26]/70 font-sans">
        결제를 승인하고 있어요
        <br />
        잠시만 기다려주세요
      </p>
    </>
  );
}

function SuccessView({
  amount,
  onGoHome,
}: {
  amount: number;
  onGoHome: () => void;
}) {
  return (
    <>
      <p className="text-xs tracking-[0.3em] text-[#4A5D45]">PAYMENT DONE</p>
      <div className="my-6 border-t border-dashed border-[#2B2A26]/30" />

      <p className="text-lg font-semibold">결제가 완료되었습니다</p>
      <p className="mt-4 text-2xl">{won(amount)}</p>

      <div className="my-6 border-t border-dashed border-[#2B2A26]/30" />
      <p className="text-xs text-[#2B2A26]/50 font-sans">
        주문 내역은 마이페이지에서 확인하실 수 있어요
      </p>

      <button
        onClick={onGoHome}
        className="mt-8 w-full bg-[#4A5D45] text-white text-sm py-3 tracking-wide hover:bg-[#3d4d39] transition-colors"
      >
        홈으로 돌아가기
      </button>
    </>
  );
}
