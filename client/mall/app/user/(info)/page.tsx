"use client";

import Button from "@/app/_component/Button";
import { UserContext } from "@/app/_lib/context/UserProvider";
import { notFound } from "next/navigation";
import { useContext } from "react";

export default function UserInfoPage() {
  const { user } = useContext(UserContext);

  if (!user) notFound();

  return (
    <>
      <div className="relative min-h-screen min-w-125 bg-gray-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-70%] min-w-125 w-[50vw] mx-auto flex flex-col items-center">
          {/* 사용자 이름 및 이메일 */}
          <div className="w-full shadow border border-gray-50 rounded-lg p-4 px-8 bg-amber-400">
            <div className="flex flex-col items-start">
              <div className="w-14 h-14 rounded-full mb-2 bg-blue-200 text-lg flex justify-center items-center">
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
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500"
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
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500"
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
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500"
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
                    className="p-1 pl-2 bg-white rounded-sm disabled:text-gray-500"
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
