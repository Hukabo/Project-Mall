import { api } from "../_lib/api/api";
import { Category } from "../_lib/types/category";
import ListItem from "./ListItem";

export default async function Sidebar() {
  const categories = await api.get<Category[]>("category/parent");

  return (
    <section className="h-[120rem] w-[12vw] p-7 shadow-dark bg-surface">
      <nav>
        <ul className="flex flex-col gap-6 mt-5 font-medium">
          {categories.map((category) => (
            <ListItem key={category.id} category={category} />
          ))}
        </ul>
      </nav>
    </section>
  );
}
