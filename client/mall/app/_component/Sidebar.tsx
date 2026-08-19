import { api } from "../_lib/api/api";
import { Category } from "../_lib/types/category/category";
import Categories from "./Categories";

export default async function Sidebar() {
  const categories = await api.get<Category[]>("category/parent");

  return (
    <section className="h-full w-full bg-surface p-7 min-[1260px]:h-[120rem] min-[1260px]:w-[12vw]">
      <nav>
        <ul className="flex flex-col gap-6 mt-5">
          {categories.map((category) => (
            <Categories key={category.id} category={category} />
          ))}
        </ul>
      </nav>
    </section>
  );
}
