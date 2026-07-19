import ProductList from "./ProductList";
import Sidebar from "./Sidebar";

export default function Body() {
  return (
    <main className="flex">
      <Sidebar />
      <ProductList />
    </main>
  );
}
