import { SyntheticEvent } from "react";
import { Product } from "../types/product/product";

export async function createProduct(e: SyntheticEvent, form: any) {
  e.preventDefault();

  const formData = new FormData();

  //   이미지 필드만 따로 처리
  for (const key in form) {
    if (key === "images") {
      form.images.forEach((image: any) => {
        formData.append(key, image);
      });
    } else {
      formData.append(key, form[key]);
    }
  }

  await fetch("http://localhost:8080/product", {
    method: "POST",
    credentials: "include",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("상품등록에 실패하였습니다.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("data = ", data);
      alert("상품이 등록되었습니다.");
      return data;
    })
    .catch((err) => console.error(err));
}

export async function getProducts(
  page: number,
  limit = 20,
): Promise<{
  products: Product[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}> {
  return await fetch(
    `http://localhost:8080/product/?page=${page}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    },
  )
    .then((res) => {
      if (!res.ok)
        throw new Error("something went wrong while getting all products...");

      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}

export async function getProduct(id: number) {
  return await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/product/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("상품 조회 중 에러가 발생했습니다.");

      return res.json();
    })
    .then((data) => {
      console.log("상품 정보: ", data);

      return data;
    })
    .catch((err) => {
      console.error(err);
    });
}
