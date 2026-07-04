"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { login } from "../_lib/api/user";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex-1 p-8 max-w-1/2 border border-grey-light-1 rounded-md shadow-dark">
        <div className="flex justify-between items-center mb-3">
          <h1 className="flex-1 text-3xl text-grey-dark-1 font-thin">로그인</h1>
          <a href="/" className="inline-block">
            <Image
              src="/svg/home.svg"
              alt="Home image"
              width={40}
              height={40}
            />
          </a>
        </div>
        <form
          onSubmit={async (e) => {
            await login(e, form);
            router.replace("/");
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="email">이메일: {""}</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
            }}
          />

          <label htmlFor="password">비밀번호: {""}</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
            }}
          />

          <button className="bg-pink-200 py-2 px-8 rounded-md cursor-pointer mt-4">
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
}
