"use client";

import { UserContext } from "@/app/_lib/context/UserProvider";
import { notFound } from "next/navigation";
import { useContext } from "react";

export default function UserInfoPage() {
  const { user } = useContext(UserContext);

  if (!user) notFound();

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="min-w-125 w-[50vw] mx-auto flex flex-col items-center">
          {/* 사용자 이름 및 이메일 */}
          <div className="w-full shadow border border-gray-50 rounded-lg p-4 bg-amber-400">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-lg flex justify-center items-center">
              JW
            </div>
            <p>{user.username}</p>
            <p>{user.roles.includes("ADMIN") ? "관리자" : "일반회원"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
