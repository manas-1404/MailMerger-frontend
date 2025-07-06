import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto bg-[#121212]">
                <Outlet />
            </main>
        </div>
    );
}
