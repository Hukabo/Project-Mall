"use client";

import PerforatedEdge from "@/app/_component/PerforatedEdge";
import { useSearchParams, useRouter } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제를 취소하셨어요.",
  PAY_PROCESS_ABORTED: "결제 진행 중 오류가 발생했어요.",
  REJECT_CARD_COMPANY: "카드사에서 결제를 거절했어요.",
};

export default function FailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const displayMessage =
    (code && ERROR_MESSAGES[code]) || message || "결제에 실패했습니다.";

  return (
    <main className="min-h-screen bg-[#F7F4EC] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-[#2B2A26]/10 shadow-sm">
        <PerforatedEdge />

        <div className="px-8 py-10 font-mono text-[#2B2A26] text-center">
          <p className="text-xs tracking-[0.3em] text-[#C08A28]">
            PAYMENT FAILED
          </p>
          <div className="my-6 border-t border-dashed border-[#2B2A26]/30" />

          <p className="text-sm text-[#2B2A26]/70 font-sans leading-relaxed">
            {displayMessage}
          </p>

          {code && (
            <p className="mt-4 text-[10px] text-[#2B2A26]/30">code: {code}</p>
          )}

          <div className="my-6 border-t border-dashed border-[#2B2A26]/30" />

          <div className="flex gap-2">
            <button
              onClick={() => router.push("/cart")}
              className="flex-1 bg-[#C08A28] text-white text-sm py-3 tracking-wide hover:bg-[#a8761f] transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-[#2B2A26]/20 text-sm py-3 tracking-wide hover:bg-[#2B2A26]/5 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>

        <PerforatedEdge flip />
      </div>
    </main>
  );
}
