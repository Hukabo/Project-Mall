"use client";

import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../_lib/context/UserProvider";
import Link from "next/link";
import { logout } from "../_lib/api/user";
import { useRouter } from "next/navigation";
import { User } from "../_lib/types/user";

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="py-2.5 px-12 flex justify-between shadow-2xs">
      <Link href="/" className="inline-block">
        <Image src="/svg/home.svg" alt="Home image" width={40} height={40} />
      </Link>
      <form
        action="#"
        className="flex justify-center w-1/5 shadow-2xl rounded-full focus-within:w-1/3 transition-all duration-300"
      >
        <input
          type="text"
          className="w-[80%] focus:outline-none px-3 py-1.5"
          placeholder="상품을 입력해주세요"
        />
        <button>
          <Image
            src="/svg/magnifying-glass.svg"
            alt="glass image"
            width={30}
            height={30}
          />
        </button>
      </form>
      <div className="flex items-center gap-3 font-bold">
        {user ? (
          <>
            <span className="border-e pr-3">{user.username}님</span>

            <Link href={`/user`} className="border-e pr-3">
              내정보
            </Link>

            <Link id="cart" href="/cart" className="border-e pr-3">
              장바구니
            </Link>

            <Link href="/orders" className="border-e pr-3">
              주문내역
            </Link>

            <button
              onClick={async () => {
                await logout();
                window.location.reload();
              }}
              className="cursor-pointer"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="border-e pr-3">
              로그인
            </Link>

            <Link href="/join">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}
