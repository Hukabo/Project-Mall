"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../_lib/provider/UserProvider";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useMobileSidebar } from "./MobileSidebarProvider";

export default function Header() {
  const { user, refetchUser, logout } = useContext(UserContext);
  const { open } = useMobileSidebar();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      refetchUser();
    }

    const closeUserMenu = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    };

    document.addEventListener("mousedown", closeUserMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeUserMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <header className="py-3 px-12 flex justify-between shadow-2xs bg-surface border-b border-grey-light-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={open}
          aria-label="카테고리 메뉴 열기"
          className="rounded-md p-2 -ml-4 transition-colors hover:bg-grey-light-2 min-[1260px]:hidden"
        >
          <Image
            src="/svg/hamburger.svg"
            alt="menu button"
            width={24}
            height={24}
            sizes="(max-width: 1200px) 5vw"
          />
        </button>
        <Link href="/" className="inline-block">
          <h1 className="text-2xl italic uppercase">Mall</h1>
        </Link>
      </div>
      <SearchBar />
      <div className="flex items-center gap-3 font-medium">
        {user ? (
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-label="사용자 메뉴"
              aria-expanded={isUserMenuOpen}
              aria-controls="user-menu"
              className="rounded-full p-1 transition-colors hover:bg-grey-light-2 focus:outline-none focus:ring-2 focus:ring-moss"
            >
              <Image src="/svg/user-circle.svg" alt="" width={30} height={30} />
            </button>

            <div
              id="user-menu"
              className={`absolute right-0 top-full z-30 mt-2 w-36 origin-top-right rounded-md border border-grey-light-4 bg-surface py-2 shadow-lg transition-all duration-200 ${
                isUserMenuOpen
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-95 opacity-0"
              }`}
            >
              <p className="border-b border-grey-light-4 px-4 pb-2 text-sm text-grey-dark-2">
                {user.username}님
              </p>
              <Link
                href="/user"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-4 py-2 hover:bg-grey-light-2 hover:text-moss"
              >
                내정보
              </Link>
              <Link
                id="cart"
                href="/cart"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-4 py-2 hover:bg-grey-light-2 hover:text-moss"
              >
                장바구니
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsUserMenuOpen(false)}
                className="block px-4 py-2 hover:bg-grey-light-2 hover:text-moss"
              >
                주문내역
              </Link>
              {user.roles.includes("ADMIN") && (
                <Link
                  href="/product/register"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-2 hover:bg-grey-light-2 hover:text-moss"
                >
                  상품등록
                </Link>
              )}

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setIsUserMenuOpen(false);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-grey-light-2 hover:text-rust"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link href="/login" className="border-e pr-3 hover:text-moss">
              로그인
            </Link>

            <Link href="/join" className="hover:text-moss">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
