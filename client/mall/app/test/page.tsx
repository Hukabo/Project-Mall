"use client";

import { useState } from "react";

export default function TestPage() {
  const [greeting, setGreeting] = useState("");

  async function handleButton() {
    const res = await fetch("http://localhost:8080/test");
    console.log("res = ", res);
    const data = await res.text();

    console.log("data = ", data);
    setGreeting(data);
  }

  return (
    <>
      <h1>{greeting}</h1>
      <button onClick={handleButton}>Click</button>
    </>
  );
}
