import Sidebar from "../../components/Sidebar";
export default function DashboardLayout({ children }) {
  return <div className="flex min-h-screen"><Sidebar /><main className="ml-56 flex-1 p-8 max-w-5xl">{children}</main></div>;
}
