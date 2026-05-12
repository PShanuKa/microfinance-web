import NavBar from "@/components/LayoutComponents/NavBar";
import Sidebar from "@/components/LayoutComponents/SideBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex h-screen">
      <div className="min-w-[15%]">
        <Sidebar />
      </div>
      <div className="w-[85%] bg-(--background) h-screen ">
        <NavBar />
        <div className="px-5 w-full h-[calc(100vh-60px)] overflow-y-scroll">
          <div className="w-full min-h-[calc(100vh-60px)]">

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
