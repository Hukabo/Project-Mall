"use client";

import { useEffect } from "react";
import { useMobileSidebar } from "./MobileSidebarProvider";

export default function ResponsiveSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, close } = useMobileSidebar();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        type="button"
        aria-label="메뉴 닫기"
        onClick={close}
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 min-[1260px]:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="상품 카테고리"
        className={`fixed inset-y-0 left-0 z-50 w-[min(82vw,15rem)] bg-surface shadow-2xl transition-transform duration-300 ease-out min-[1260px]:static min-[1260px]:z-auto min-[1260px]:w-auto min-[1260px]:translate-x-0 min-[1260px]:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end border-b border-grey-light-4 p-3 min-[1260px]:hidden">
          <button
            type="button"
            onClick={close}
            aria-label="메뉴 닫기"
            className="flex h-9 w-9 items-center justify-center rounded-md text-2xl leading-none transition-colors hover:bg-grey-light-2"
          >
            ×
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}
