import Image from "next/image";

import { Category } from "../../_lib/types/category/category";

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

        <ul className="invisible absolute left-full top-1 z-20 ml-2 w-44 origin-top-left scale-95 rounded-md border border-line bg-surface p-4 text-center text-ink-soft opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:visible group-hover:scale-100 group-hover:opacity-100">
          {category.children.map((child: Category) => (
            <li
              className="border-b border-line py-2 text-sm transition-colors duration-150 last:border-b-0 hover:text-rust"
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
