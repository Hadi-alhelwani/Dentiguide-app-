"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "../lib/supabase-browser";
const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dashboard/new", label: "New MDR Form", icon: "📄" },
  { href: "/dashboard/cases", label: "Cases", icon: "📋" },
  { href: "/dashboard/clinics", label: "Clinics", icon: "🏥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];
export default function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/login"; };
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-slate-900 flex flex-col z-50">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">D</div>
          <div><div className="text-white font-bold text-sm">Dentiguide</div><div className="text-slate-500 text-[10px] uppercase tracking-wider">MDR System</div></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-3">
        {NAV.map(item => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors ${active ? "bg-slate-700/80 text-white font-semibold" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}><span className="text-base w-5 text-center">{item.icon}</span>{item.label}</Link>;
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 text-sm w-full transition-colors">
          <span className="text-base w-5 text-center">🚪</span>Sign Out</button>
      </div>
    </aside>
  );
}
