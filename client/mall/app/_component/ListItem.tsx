import Image from "next/image";

type ListItemProps = {
  name: string;
};

export default function ListItem({ name }: ListItemProps) {
  return (
    <>
      <li className="flex">
        <Image
          src="/svg/cheveron-right.svg"
          alt="cheveron-right image"
          width={25}
          height={25}
          className="h-6 w-auto"
        />
        <a
          href="/clothes"
          className="text-xl text-grey-dark-1 transition-all duration-200 hover:translate-x-2"
        >
          {name}
        </a>
      </li>
    </>
  );
}
