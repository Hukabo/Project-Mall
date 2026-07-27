import Image from "next/image";

import { Category } from "../_lib/types/category";

export default function ListItem({ category }: { category: Category }) {
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
