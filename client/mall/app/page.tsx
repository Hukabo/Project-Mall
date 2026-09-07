import Header from "./_component/layout/Header";
import Body from "./_component/layout/Body";
import MobileSidebarProvider from "./_lib/provider/MobileSidebarProvider";

export default function Home() {
  return (
    <MobileSidebarProvider>
      <div className="flex flex-col">
        <Header />
        <Body />
      </div>
    </MobileSidebarProvider>
  );
}
