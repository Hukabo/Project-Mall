"use client";

import Image from "next/image";
import { api } from "../_lib/api/api";
import { Product } from "../_lib/types/product";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  async function handleSearch(e: SyntheticEvent) {
    e.preventDefault();
    router.push(`/?search=${search}`);
  }

  return (
    <form
      action="#"
      className="flex justify-center w-1/5 shadow-2xl rounded-full focus-within:w-1/3 transition-all duration-300"
    >
      <input
        type="search"
        className="w-[80%] focus:outline-none px-3 py-1.5"
        placeholder="상품을 입력해주세요"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" onClick={(e) => handleSearch(e)}>
        <Image
          src="/svg/magnifying-glass.svg"
          alt="glass image"
          width={30}
          height={30}
        />
      </button>
    </form>
  );
}
