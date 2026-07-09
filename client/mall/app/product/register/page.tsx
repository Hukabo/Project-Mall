"use client";

import { useState } from "react";
import { createProduct } from "../../_lib/api/product";

export default function ProductRegisterPage() {
  const initialForm = {
    name: "",
    price: "",
    description: "",
    stock: "",
    images: [] as File[],
    categoryId: "",
  };

  const [form, setForm] = useState(initialForm);

  return (
    <div className="min-h-screen">
      <div className="max-w-[80vw] mx-auto bg-gray-50">
        <div className="flex flex-col gap-8">
          <div className="px-12 py-8">
            <h1 className="text-2xl">상품 등록</h1>
            <span className="text-gray-500 text-sm">
              각 항목에 알맞게 입력해주세요.
            </span>
          </div>

          <div className="px-16 py-8 ">
            <form onSubmit={async (e) => await createProduct(e, form)}>
              <label
                htmlFor="input_image"
                className="block relative w-[80%] mx-auto mb-8 h-34 bg-white border border-dashed border-gray-300 shadow rounded-sm"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className=" text-2xl">이미지 등록</span>
                  <p>
                    <span className="text-red-600">*</span> 확장자 .png, .jpeg,
                    .jpg 10MB 이하만 가능
                  </p>
                </div>
              </label>

              <input
                id="input_image"
                type="file"
                className="hidden p-1"
                accept="image/png, image/jpeg, image/jpg"
                multiple
                onChange={(e) => {
                  if (!e.target.files) return;

                  if (form.images.length >= 3) {
                    alert("이미지 수량이 최대치입니다.");
                    return;
                  } else if (e.target.files.length > 3) {
                    alert("최대 3장의 이미지까지 가능합니다.");
                    return;
                  }

                  const inputImages = e.target.files ?? [];
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, ...inputImages],
                  }));
                }}
              />

              {/* 이미지 박스 */}
              <p className="text-center text-gray-500">
                이미지를 등록하면 표시됩니다.
              </p>
              <div
                id="image-container"
                className="p-4 w-1/2 mx-auto flex gap-4 justify-around"
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[200px] h-[100px] rounded-sm border border-dashed border-gray-400 overflow-hidden"
                  >
                    {form.images[index] ? (
                      <img
                        src={URL.createObjectURL(form.images[index])}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        이미지{index + 1}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-8 grid grid-cols-(--grid-cols-2) gap-6">
                {/* product name feild */}

                <div className="px-8 py-6 border border-gray-300 rounded-md shadow">
                  <label htmlFor="name" className="text-[1.3rem]">
                    상품 이름<span className="text-red-500">*</span>
                    <p className="text-sm text-gray-500">
                      20자 이내로 적어주세요.
                    </p>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={1}
                    maxLength={20}
                    className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-gray-300"
                    placeholder="예: 티니핑"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* product price field */}
                <div className="px-8 py-6 border border-gray-300 rounded-md shadow">
                  <label htmlFor="price" className="text-[1.3rem]">
                    상품 가격<span className="text-red-500">*</span>
                    <p className="text-sm text-gray-500">
                      숫자만 입력해주세요(단위 :원).
                    </p>
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-gray-300"
                    placeholder="예: 13900"
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                {/* description */}
                <div className="px-8 py-6 border border-gray-300 rounded-md shadow">
                  <label htmlFor="description" className="text-[1.3rem]">
                    상품 설명
                    <p className="text-sm text-gray-500">
                      300자 이내로 적어주세요.
                    </p>
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-gray-300"
                    placeholder="예: 이 상품으로 말할 것 같으면 어쩌구..."
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>

                {/* stock  */}
                <div className="px-8 py-6 border border-gray-300 rounded-md shadow">
                  <label htmlFor="description" className="text-[1.3rem]">
                    상품 수량
                    <p className="text-sm text-gray-500">
                      숫자만 입력해주세요.
                    </p>
                  </label>
                  <input
                    type="text"
                    id="stock"
                    name="stock"
                    className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-gray-300"
                    placeholder="예: 9999"
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
                <div className="px-8 py-6 border border-gray-300 rounded-md shadow">
                  <label htmlFor="category" className="text-[1.3rem]">
                    카테고리<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    id="category"
                    className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-gray-300"
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                  >
                    <option value="">해당 카테고리를 골라주세요.</option>
                    <option value="1">모자</option>
                    <option value="2">상의</option>
                    <option value="3">하의</option>
                    <option value="4">아우터</option>
                  </select>
                </div>
              </div>

              {/* button container */}
              <div className="flex mt-5 py-5 px-10 gap-4 justify-end align-center">
                <button className="block px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white shadow">
                  임시 저장
                </button>
                <button
                  type="submit"
                  className="block px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-md text-white shadow"
                >
                  등록 하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
