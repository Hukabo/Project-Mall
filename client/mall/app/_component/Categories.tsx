import Image from "next/image";

import { Category } from "../_lib/types/category/category";

export default function Categories({ category }: { category: Category }) {
  return (
    <>
      <li className="relative flex items-center group">
        <Image
          src="/svg/chevron-thin-right.svg"
          alt="cheveron-right image"
          width={10}
          height={10}
          className="h-4 w-auto mr-1"
        />
        <a
          href={`/?search=${category.name}`}
          className="block text-xl text-grey-dark-1 transition-all duration-200 group-hover:translate-x-2 hover:text-rust font-light"
        >
          {category.name}
        </a>

        <ul className="absolute left-full top-1 z-10 hidden w-35 border border-grey-light-4 bg-white p-5 text-center text-grey-dark-2 shadow-sm group-hover:block group-hover:opacity-100">
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
