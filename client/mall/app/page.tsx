import Header from "./_component/Header";
import Body from "./_component/Body";
import MobileSidebarProvider from "./_component/MobileSidebarProvider";

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
