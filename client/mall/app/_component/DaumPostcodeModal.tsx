"use client";

import { useEffect, useRef } from "react";

interface DaumPostcodeModalProps {
  onComplete: (data: DaumPostcodeData) => void;
  onClose: () => void;
}

export default function DaumPostcodeModal({
  onComplete,
  onClose,
}: DaumPostcodeModalProps) {
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!embedRef.current || !window.daum) {
      return;
    }

    return new window.daum.Postcode({
      oncomplete: (data) => {
        onComplete(data);
        onClose();
      },
      onclose: () => {
        onClose();
      },
      width: "100%",
      height: "100%",
    }).embed(embedRef.current);
  }, [onComplete, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-[450px] h-[550px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={embedRef} className="w-full h-full" />
      </div>
    </div>
  );
}
