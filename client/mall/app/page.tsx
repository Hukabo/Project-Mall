import Header from "./_component/Header";
import Sidebar from "./_component/Sidebar";
import { useContext, useEffect, useState } from "react";
import { getUser } from "./_lib/api/user";
import { UserContext } from "./_lib/context/UserProvider";
import { User } from "./_lib/types/user";
import { Product } from "./_lib/types/product";
import ProductCard from "./_component/ProductCard";
import Link from "next/link";
import ProductList from "./_component/ProductList";
import Body from "./_component/Body";

export default function Home() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}
