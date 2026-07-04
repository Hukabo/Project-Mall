import ListItem from "./ListItem";

export default function Sidebar() {
  const list = [
    "상의",
    "하의",
    "모자",
    "신발",
    "악세사리",
    "아웃도어",
    "아웃핏",
    "가방",
  ];

  return (
    <section className="h-[120rem] max-w-[15vw] p-7 shadow-dark">
      <nav>
        <ul className="flex flex-col gap-6 mt-5">
          {list.map((item) => {
            return <ListItem key={item} name={item} />;
          })}
        </ul>
      </nav>
    </section>
  );
}
