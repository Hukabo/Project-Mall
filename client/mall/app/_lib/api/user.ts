import { SyntheticEvent } from "react";
import { User } from "../types/user";

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

  await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        throw new Error(data.message);
      }
    })
    .then((data) => {
      console.log(`data = ${data}`);
    })
    .catch((err) => {
      console.log(err);
    });
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
