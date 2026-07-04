"use client";
import { error } from "console";
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";

export default function JoinPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    birth: "",
    address: "",
    phone: "",
  });

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    console.log("data = ", data);
    alert(`${data.username} 회원가입 완료`);
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex-1 p-8 max-w-1/2 border border-grey-light-1 rounded-md shadow-dark">
        <div className="flex justify-between items-center mb-3">
          <h1 className="flex-1 text-3xl text-grey-dark-1 font-thin">
            회원가입
          </h1>
          <a href="/" className="inline-block">
            <Image
              src="/svg/home.svg"
              alt="Home image"
              width={40}
              height={40}
            />
          </a>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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

          <label htmlFor="name">이름: {""}</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="이름"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, username: e.target.value });
            }}
          />

          <label htmlFor="birth">생년월일: {""}</label>
          <input
            type="text"
            id="birth"
            name="birth"
            placeholder="생년월일"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, birth: e.target.value });
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

          <label htmlFor="confirm-pass">비밀번호 확인: {""}</label>
          <input
            type="password"
            id="confirm-pass"
            name="confirm-pass"
            placeholder="비밀번호 확인"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, confirmPassword: e.target.value });
            }}
          />

          <label htmlFor="address">주소지: {""}</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="주소지"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, address: e.target.value });
            }}
          />

          <label htmlFor="phone">연락처: {""}</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="연락처"
            className="p-2 bg-grey-light-1 rounded-md focus:outline-none"
            onChange={(e) => {
              setForm({ ...form, phone: e.target.value });
            }}
          />

          <button
            type="submit"
            className="bg-pink-200 py-2 px-8 rounded-md cursor-pointer mt-4"
          >
            제출하기
          </button>
        </form>
      </div>
    </div>
  );
}
