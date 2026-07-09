"use client";

import { createContext, useEffect, useState } from "react";
import { getUser } from "../api/user";
import { User } from "../types/user";

interface UserContextType {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refetchUser: async () => {},
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
      const user = await getUser();

      setUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetchUser();
  }, []);

  if (loading) return <div>loading..</div>;

  return (
    <UserContext value={{ user, loading, refetchUser }}>{children}</UserContext>
  );
}
