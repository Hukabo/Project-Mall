"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import Button from "@/app/_component/Button";
import { api } from "@/app/_lib/api/api";
import { Category } from "@/app/_lib/types/category/category";
import { CreateProductForm } from "@/app/_lib/types/product/create_product_form";
import { SizeStock } from "@/app/_lib/types/product/size_stock";
import ProductInputField from "@/app/_component/ProductInputField";
import { Variant } from "@/app/_lib/types/product/variant";
import ProductVariant from "@/app/_component/ProductVariant";
import AddVariantBtn from "@/app/_component/AddVariantBtn";

const SIZE_LIST = ["S", "M", "L", "XL", "2XL", "FREE"];

function createEmptySizeStocks() {
  const emptySizeStocks: SizeStock[] = SIZE_LIST.map((size) => {
    return {
      size,
      stock: 0,
    };
  });

  return emptySizeStocks;
}

function createEmptyVariant() {
  return {
    id: crypto.randomUUID(),
    color: "",
    images: [],
    sizeStocks: createEmptySizeStocks(),
  } as Variant;
}

const INITIAL_FORM = {
  name: "",
  price: 0,
  description: "",
  variants: [createEmptyVariant()],
  categoryId: "",
};

function createInitialForm() {
  return {
    name: "",
    price: 0,
    description: "",
    variants: [createEmptyVariant()],
    categoryId: "",
  };
}

export interface VariantImage {
  file: File;
  previewUrl: string;
}

export default function ProductRegisterPage() {
  const [form, setForm] = useState<CreateProductForm>(createInitialForm());

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<Category[] | null>(null);

  // 상위 카테고리 호출
  useEffect(() => {
    async function loadCategories() {
      const categories = await api.get<Category[]>("category/parent");
      setCategories(categories);
    }
    loadCategories();
  }, []);

  // 상위 카테고리 선택시 하위 카테고리 호출
  useEffect(() => {
    async function loadChildrenCategories() {
      if (!parentId) return;

      const res = await api.get<Category>(`category/${parentId}`);

      setChildren(res.children);
    }

    loadChildrenCategories();
  }, [parentId]);

  function changeColor(index: number, color: string) {
    setForm((prev) => {
      const variants = prev.variants;

      variants[index] = { ...variants[index], color };

      return { ...prev, variants };
    });
  }

  function addImage(variantIdx: number, files: File[]) {
    console.log("files = ", files);

    setForm((prev) => {
      const variants = [...prev.variants];
      const variant = { ...variants[variantIdx] };

      // 각 Variant는 이미지 최대 3장까지
      if (
        variant.images.length >= 3 ||
        variant.images.length + files.length > 3
      ) {
        alert("이미지는 최대 3장까지 가능합니다.");
        return prev;
      }

      const newVariantImages: VariantImage[] = files.map((file) => {
        return {
          file,
          previewUrl: URL.createObjectURL(file),
        };
      });

      variant.images = [...variant.images, ...newVariantImages];
      variants[variantIdx] = variant;

      return {
        ...prev,
        variants,
      };
    });
  }

  function removeImage(variantIdx: number, imageIdx: number) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIdx
          ? {
              ...v,
              images: v.images.filter((image, i) => {
                if (imageIdx === i) URL.revokeObjectURL(image.previewUrl);
                return i !== imageIdx;
              }),
            }
          : v,
      ),
    }));
  }

  function handleSizeStock(variantIdx: number, size: string, stock: number) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i !== variantIdx
          ? v
          : {
              ...v,
              sizeStocks: v.sizeStocks.map((s) =>
                s.size !== size ? s : { ...s, stock },
              ),
            },
      ),
    }));
  }

  function addVariant() {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, createEmptyVariant()],
    }));
  }

  function removeVariant(variantIdx: number) {
    console.log("id = ", variantIdx);
    if (form.variants[variantIdx].images.length >= 1) {
      // Variant안에 이미지들의 ObjectURL 제거
      form.variants.forEach((v, i) => {
        if (variantIdx === i) {
          v.images.forEach((image) => {
            URL.revokeObjectURL(image.previewUrl);
          });
        }
      });
    }

    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((v, i) => variantIdx !== i),
    }));
  }

  async function handleSubmit(e: SyntheticEvent, form: CreateProductForm) {
    e.preventDefault();

    const formData = new FormData();

    const entries = Object.entries(form) as [
      keyof CreateProductForm,
      unknown,
    ][];

    entries.forEach(([key, value]) => {
      if (key === "variants") {
        const variants = value as Variant[];

        // Variant타입에서 id 제외 및 이미지만 따로 수렴
        const editedVariants = variants.map((v, index) => {
          // 이미지 파일과 해당 Variant 식별
          v.images.forEach((img) => {
            formData.append("images", img.file);
            formData.append("imagesInfo", String(index));
          });

          return {
            color: v.color,
            sizeStocks: v.sizeStocks,
          };
        });

        formData.append(key, JSON.stringify(editedVariants));
      } else {
        // name, desc, price, categoryId
        formData.append(key, String(value));
      }
    });

    try {
      await api.post("product", formData);
      alert("상품이 등록되었습니다.");
      setForm(createInitialForm());
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  return (
    <div className="min-h-screen py-9">
      <div className="max-w-[60vw] mx-auto bg-white border border-line shadow rounded-sm text-gray-700">
        <div className="flex flex-col">
          <div className="px-12 py-4  border-b border-line border-dashed">
            <h1 className="text-2xl">상품 등록</h1>
            <span className="text-gray-500 text-sm">
              각 항목에 알맞게 입력해주세요.
            </span>
          </div>

          <div className="px-16 py-8 ">
            <h2 className="text-xl font-mono">
              <span className="text-line">01 </span>기본정보
            </h2>
            <form
              onSubmit={async (e) => {
                await handleSubmit(e, form);
              }}
            >
              <div className="p-4 flex flex-col gap-6">
                <div className="flex justify-between gap-5">
                  {/* product name feild */}
                  <ProductInputField
                    form={form}
                    setForm={setForm}
                    id={"name"}
                    text={"상품명"}
                    subText={"상품명을 입력해주세요."}
                    placeholder={"오버핏 스프라이트 셔츠"}
                    required={true}
                  />

                  {/* product price field */}
                  <ProductInputField
                    form={form}
                    setForm={setForm}
                    id={"price"}
                    type={"number"}
                    text={"상품 가격"}
                    subText={"숫자만 입력해주세요(단위 :원)."}
                    placeholder={"13900"}
                    required={true}
                  />
                </div>

                {/* description */}
                <ProductInputField
                  form={form}
                  setForm={setForm}
                  id={"description"}
                  text={"상품 설명"}
                  subText={"300자 이내로 적어주세요."}
                  placeholder={"상품의 특징, 원단, 세탁시 주의사항 등"}
                />

                {/* categories */}
                <div className="flex gap-5">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="px-4 py-3 border border-line rounded-md shadow flex-1 flex flex-col justify-center">
                      <label htmlFor="categories" className="">
                        상위 카테고리<span className="text-red-500">*</span>
                      </label>
                      <select
                        name="categories"
                        id="categories"
                        className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-line"
                        onChange={(e) => setParentId(e.target.value)}
                      >
                        <option value="">상위 카테고리를 골라주세요.</option>
                        {categories?.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {children && (
                      <div className="px-4 py-3 border border-line rounded-md shadow flex-1">
                        <label htmlFor="children" className="text-[1.3rem]">
                          하위 카테고리<span className="text-red-500">*</span>
                        </label>
                        <select
                          name="children"
                          id="children"
                          className="block mt-2 bg-white p-2 w-2/3 rounded-sm focus:outline-none border border-line"
                          value={form.categoryId}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              categoryId: e.target.value,
                            }))
                          }
                        >
                          <option value="">하위 카테고리를 골라주세요.</option>
                          {children.map((child) => (
                            <option key={child.id} value={child.id}>
                              {child.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* variants */}
              <h2 className="text-xl font-mono my-4">
                <span className="text-line">02 </span>색상별 이미지&amp;재고
                <div className="text-sm pl-8">
                  <p>
                    <span className="text-red-500 text-[1rem] pr-0.5">!</span>
                    이미지 확장자는{" "}
                    <span className="text-rust text-[1rem] pr-0.5">
                      png,jpeg,jpg
                    </span>
                    만 가능하며{" "}
                    <span className="text-rust text-[1rem] pr-0.5">10mb</span>
                    이하여야합니다
                  </p>
                  <p>
                    상품이름_컬러_숫자 형태로 업로드 해주세요. (예:
                    <span className="text-rust text-[1rem] px-0.5">
                      오버핏반팔_white_01
                    </span>
                    )
                  </p>
                </div>
              </h2>
              {form.variants.map((variant, index) => (
                <div key={variant.id} className="not-last:mb-4">
                  <ProductVariant
                    variantIdx={index}
                    variant={variant}
                    changeColor={changeColor}
                    addImage={addImage}
                    removeImage={removeImage}
                    handleSizeStock={handleSizeStock}
                    removeVariant={removeVariant}
                  />
                </div>
              ))}
              <AddVariantBtn addVariant={addVariant} />
              {/* button container */}
              <div className="flex mt-5 py-5 px-10 gap-4 justify-end align-center">
                <Button text="등록 하기" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
