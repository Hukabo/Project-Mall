"use client";

import Card from "./_component/Card";
import Header from "./_component/Header";
import Sidebar from "./_component/Sidebar";
import { useEffect, useState } from "react";
import { getUser } from "./_lib/api/user";
import { UserContext } from "./_lib/context/UserContext";
import { User } from "./_lib/types/user";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const user = await getUser();

      setUser(user);
      console.log(user);
    }

    loadUser();
  }, []);

  return (
    <UserContext value={user}>
      <Header />
      <main className="flex">
        <Sidebar />
        <section className="flex-1 p-7 grid grid-cols-(--grid-cols) grid-rows-(--grid-rows) gap-8">
          <Card />
        </section>
      </main>
    </UserContext>
  );
}
