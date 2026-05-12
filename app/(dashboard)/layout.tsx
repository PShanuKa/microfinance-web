export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div className="w-full flex h-screen">
        <div className="min-w-[10%] bg-emerald-400"><SideBar /></div>
      <div className="w-[90%] bg-amber-300"><NavBar />{children}</div>
     
    </div>
  );
}

function NavBar() {
  return (
    <div className="bg-amber-300">
      <h1>Navbar</h1>
    </div>
  );
}

function SideBar() {
  return (
    <div className="bg-emerald-400 w-">
      <h1>Sidebar</h1>
    </div>
  );
}


