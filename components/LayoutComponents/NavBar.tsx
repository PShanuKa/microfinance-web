import { useUiStore } from "@/store/useUiStore";
import { Menu } from "lucide-react";

export default function NavBar() {
    const { toggleSideBar } = useUiStore();
    return (
        <div className="w-full h-[60px] bg-white border-b border-(--navbar-border) justify-between  flex px-4 items-center">

            <Menu size={18} onClick={toggleSideBar} />
            <h1>NavBar</h1>
        </div>
    );
}