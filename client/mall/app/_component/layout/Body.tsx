import ProductList from "./ProductList";
import ResponsiveSidebar from "./ResponsiveSidebar";
import Sidebar from "./Sidebar";

export default function Body() {
  return (
    <main className="flex-1 flex">
      <ResponsiveSidebar>
        <Sidebar />
      </ResponsiveSidebar>
      <ProductList />
    </main>
  );
}
