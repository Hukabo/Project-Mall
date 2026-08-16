"use client";

import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { UserContext } from "../_lib/provider/UserProvider";
import { api, ApiError } from "../_lib/api/api";

interface ErrorForm {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { refetchUser } = useContext(UserContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<ErrorForm>({});

  async function handleLogin(e: React.SubmitEvent) {
    try {
      e.preventDefault();
      setError({});
      await api.post<{ message: string; username: string }>("auth/login", form);

      await refetchUser(); // 로그인 성공 후 유저 조회
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        console.log("error status = ", err.status);
        switch (err.status) {
          case 404: {
            setError((prev) => ({
              ...prev,
              email: "이메일이 올바르지 않습니다.",
            }));
            break;
          }
          case 401: {
            setError((prev) => ({
              ...prev,
              password: "비밀번호가 올바르지 않습니다.",
            }));
            break;
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-8 w-[max(50vw,30rem)] border border-grey-light-1 rounded-md shadow-dark bg-surface max-[500px]:h-screen max-[500px]:w-full max-[500px]:flex max-[500px]:flex-col max-[500px]:justify-center">
        <div className="flex justify-between items-center mb-3">
          <h1 className="flex-1 text-3xl text-grey-dark-1 font-thin">로그인</h1>
          <a href="/" className="inline-block">
            <h1 className="text-2xl italic uppercase">Mall</h1>
          </a>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <label htmlFor="email">이메일: {""}</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none border border-line"
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
              setError((prev) => ({ ...prev, email: undefined }));
            }}
          />
          {error.email && <p className="text-sm text-red-300">{error.email}</p>}

          <label htmlFor="password">비밀번호: {""}</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none border border-line"
            onChange={(e) => {
              setForm((prev) => ({ ...prev, password: e.target.value }));
              setError((prev) => ({ ...prev, password: undefined }));
            }}
          />
          {error.password && (
            <p className="text-sm text-red-300">{error.password}</p>
          )}

          <button className="bg-ink text-surface py-2 px-8 rounded-md cursor-pointer mt-4 w-1/2 mx-auto max-[310px]:text-sm">
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
}
