import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar onSelectSkill={(name) => navigate(`/skills/${name}`)} />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
