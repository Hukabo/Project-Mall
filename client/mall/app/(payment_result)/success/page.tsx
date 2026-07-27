"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { api } from "../../_lib/api/api";
import { won } from "@/app/_lib/util/common";
import { UserContext } from "@/app/_lib/context/UserProvider";
import PerforatedEdge from "@/app/_component/PerforatedEdge";

type ConfirmState = "loading" | "error" | "success";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState<{ amount: number } | null>(null);

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: Number(searchParams.get("amount")),
      paymentKey: searchParams.get("paymentKey"),
    };

    if (
      !requestData.orderId ||
      !requestData.paymentKey ||
      !Number.isInteger(requestData.amount)
    ) {
      setState("error");
      setErrorMessage("결제 결과가 올바르지 않습니다.");
      // router.replace("/fail?message=결제 결과가 올바르지 않습니다.");
      return;
    }
    async function confirm() {
      try {
        await api.post("payments/confirm", requestData);
        setState("success");
        setOrderInfo({ amount: requestData.amount });
      } catch (error: any) {
        setState("error");
        setErrorMessage(error.message ?? "결제 승인이 실패하였습니다.");
      }
    }
    confirm(); // 개발환경이라 두번 호출되어 "이미 처리중인 요청"이라 에러 발생
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
          {state === "error" && (
            <ErrorView
              message={errorMessage}
              onRetry={() => router.push("/cart")}
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
      <p className="mt-4 text-2xl">{won(amount)}원</p>

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

function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <>
      <p className="text-xs tracking-[0.3em] text-[#C08A28]">PAYMENT FAILED</p>
      <div className="my-6 border-t border-dashed border-[#2B2A26]/30" />

      <p className="text-sm text-[#2B2A26]/70 font-sans leading-relaxed">
        {message}
      </p>

      <button
        onClick={onRetry}
        className="mt-8 w-full bg-[#C08A28] text-white text-sm py-3 tracking-wide hover:bg-[#a8761f] transition-colors"
      >
        장바구니로 돌아가기
      </button>
    </>
  );
}
