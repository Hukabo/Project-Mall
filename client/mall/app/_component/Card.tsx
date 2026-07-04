import Image from "next/image";

export default function Card() {
  return (
    <div className="flex flex-col p-3 border border-grey-dark-3 shadow-dark cursor-pointer">
      <Image
        src="/svg/logo.svg"
        alt=""
        width={180}
        height={180}
        className="w-auto h-auto object-cover rounded-md"
      ></Image>

      <p>상품 이름</p>
      <p>15,900원</p>
      <p>평점: ★★★★★</p>
      <div className="flex justify-between items-center text-center h-8 mt-2.5">
        <span className="flex-1 border-r-grey-dark-2 border-r hover:bg-grey-light-3">
          담기
        </span>
        <span className="flex-1 hover:bg-grey-light-3">구매</span>
      </div>
    </div>
  );
}
