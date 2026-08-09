"use client";

import { createContext, useEffect, useState } from "react";
import { getUser } from "../api/user";
import { User } from "../types/user";
import Loading from "@/app/_component/Loading";
import { api } from "../api/api";

interface UserContextType {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {},
  logout: async () => {},
});

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refetchUser() {
    try {
      const user = await api.get<User>("users/profile");

      setUser(user);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await api.patch("logout");
  }

  useEffect(() => {
    refetchUser();
  }, []);

  if (loading) return <Loading />;

  return (
    <UserContext value={{ user, loading, refetchUser, logout }}>
      {children}
    </UserContext>
  );
}
