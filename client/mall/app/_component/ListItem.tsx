import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Category } from "../_lib/types/category";

export default function ListItem({ category }: { category: Category }) {
  return (
    <>
      <li className="relative flex items-center group">
        <Image
          src="/svg/cheveron-right.svg"
          alt="cheveron-right image"
          width={25}
          height={25}
          className="h-6 w-auto"
        />
        <a
          href={`/?search=${category.name}`}
          className="block text-xl text-grey-dark-1 transition-all duration-200 group-hover:translate-x-2"
        >
          {category.name}
        </a>

        <ul className="absolute hidden group-hover:block group-hover:opacity-100 left-full top-1 z-10 p-5 w-35 shadow-sm text-center border border-grey-light-4 bg-white text-grey-dark-2">
          {category.children.map((child: Category) => (
            <li
              className="hover:text-grey-dark-1 transition-colors duration-150 py-1 border-b"
              key={`${child.id}`}
            >
              <a className="block" href={`/?search=${child.name}`}>
                {child.name}
              </a>
            </li>
          ))}
        </ul>
      </li>
    </>
  );
}
