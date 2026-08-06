import { SyntheticEvent } from "react";
import { User } from "../types/user";
import { api } from "./api";

export async function getUser(): Promise<User | null> {
  return await fetch("http://localhost:8080/users/profile", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        throw new Error("사용자 조회 실패");
      }

      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function login(e: SyntheticEvent, form: any) {
  e.preventDefault();

  const res = await api.post<{ message: string; username: string }>(
    "auth/login",
    form,
  );
  alert(`환영합니다. ${res.username}님`);
}

export async function logout() {
  await fetch("http://localhost:8080/auth/logout", {
    method: "PATCH",
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("사용자 조회 실패");
      }

      return res.json();
    })
    .then((data) => {
      alert(data.message);
    })
    .catch((err) => {
      console.error(err);
    });
}
