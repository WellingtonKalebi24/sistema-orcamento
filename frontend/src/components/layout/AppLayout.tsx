import { Outlet } from "react-router-dom";

import { useAuthStore } from "../../store/auth.store";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clearSession);

  return (
    <div className="app-shell">
      <AppSidebar />
      <main className="content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Painel administrativo</p>
            <h1>Sistema de orcamentos</h1>
          </div>
          <div className="profile">
            <div>
              <strong>{user?.name}</strong>
              <p>{user?.role}</p>
            </div>
            <button className="button-secondary" onClick={clear}>
              Sair
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
