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
      <div className="w-[85%] bg-amber-300">
        <NavBar />
        {children}
      </div>
    </div>
  );
}


