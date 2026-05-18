import { useUiStore } from "@/store/useUiStore";
import { Menu, User, LogOut, Settings, UserCircle } from "lucide-react";
import { useGetMeQuery } from "@/services/authApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const { toggleSideBar } = useUiStore();
  const { data: userData } = useGetMeQuery();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  const user = userData?.user;

  return (
    <div className="w-full h-[60px] bg-white border-b border-(--navbar-border) justify-between flex px-6 items-center shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSideBar}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <Menu size={20} className="text-slate-600" />
        </button>
        <h1 className="font-bold text-xl text-slate-800 hidden md:block">Microfinance System</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger >
            <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 px-3 rounded-xl transition-all border border-transparent hover:border-slate-200 group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-slate-700 leading-none">
                  {user?.fullname || "Loading..."}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {user?.email || "..."}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                <User size={20} strokeWidth={2.5} />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl border-slate-200">
             <DropdownMenuGroup>

            <DropdownMenuLabel className="font-bold text-slate-700">My Account</DropdownMenuLabel>
             </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link href="/profile">
              <DropdownMenuItem className="gap-2 cursor-pointer py-2.5 focus:bg-slate-50 rounded-lg">
                <UserCircle size={18} className="text-slate-500" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="gap-2 cursor-pointer py-2.5 text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-lg font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}