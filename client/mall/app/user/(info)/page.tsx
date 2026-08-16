"use client";

import Button from "@/app/_component/Button";
import { UserContext } from "@/app/_lib/provider/UserProvider";
import { notFound } from "next/navigation";
import { useContext } from "react";

export default function UserInfoPage() {
  const { user } = useContext(UserContext);

  if (!user) notFound();

  return (
    <>
      <div className="flex min-h-screen min-w-125 justify-center items-center">
        <div className="min-w-125 w-[50vw] mx-auto flex flex-col items-center bg-surface rounded-lg shadow border border-gray-50 max-[500px]:h-screen">
          {/* 사용자 이름 및 이메일 */}
          <div className="w-full p-4 px-8 ">
            <div className="flex flex-col items-start">
              <div className="w-14 h-14 rounded-full mb-2 bg-rust/80 text-lg flex justify-center items-center">
                JW
              </div>
              <div className="text-center">
                <p className="text-[18px] font-bold"> {user.username}</p>
                <p className="text-sm text-gray-800">
                  {user.roles.includes("ADMIN") ? "관리자" : "일반회원"}
                </p>
              </div>
            </div>
            <hr className="my-5 h-px bg-gray-200 border-none" />
            <form action="">
              <div className="grid grid-cols-(--grid-cols-2) gap-8">
                <div className="flex flex-col items-stretch pr-4">
                  <label htmlFor="email" className="block mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500 border border-line"
                    value={user.email}
                    disabled
                  />
                </div>

                <div className="flex flex-col items-stretch pr-4">
                  <label htmlFor="password" className="block mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500 border border-line"
                    value={123123}
                    disabled
                  />
                </div>

                <div className="flex flex-col items-stretch pr-4">
                  <label htmlFor="phone" className="block mb-1">
                    휴대번호
                  </label>
                  <input
                    type="phone"
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500 border border-line"
                    value={user.phone}
                    disabled
                  />
                </div>
                <div className="flex flex-col items-stretch pr-4">
                  <label htmlFor="address" className="block mb-1">
                    주소지
                  </label>
                  <input
                    type="address"
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500 border border-line"
                    value={user.address}
                    disabled
                  />
                </div>
              </div>

              <Button className="mt-5 float-right" text="수정 하기" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
