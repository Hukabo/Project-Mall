"use client";

import { useContext } from "react";
import { UserContext } from "../_lib/provider/UserProvider";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { useMobileSidebar } from "./MobileSidebarProvider";

export default function Header() {
  const { user, logout } = useContext(UserContext);
  const { open } = useMobileSidebar();

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
          <>
            <Link href={`/user`} className="border-e pr-3 hover:text-moss">
              내정보
            </Link>

            <Link
              id="cart"
              href={`/cart`}
              className="border-e pr-3 hover:text-moss"
            >
              장바구니
            </Link>

            <Link href="/orders" className="border-e pr-3 hover:text-moss">
              주문내역
            </Link>

            <button onClick={logout} className="cursor-pointer hover:text-rust">
              로그아웃
            </button>
          </>
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
