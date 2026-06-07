import { NavLink } from "react-router-dom";

import { canAccess, permissions } from "../../app/permissions";
import { useAuthStore } from "../../store/auth.store";

const items = [
  { label: "Dashboard", to: "/", resource: "dashboard" },
  { label: "Clientes", to: "/clientes", resource: "clients" },
  { label: "Orcamentos", to: "/orcamentos", resource: "quotes" },
  { label: "Novo orcamento", to: "/orcamentos/novo", resource: "quotes" },
  { label: "Ordens de servico", to: "/ordens", resource: "workOrders" },
  { label: "Nova OS", to: "/ordens/nova", resource: "workOrders" },
  { label: "Servicos", to: "/servicos", resource: "services" },
  { label: "Produtos", to: "/produtos", resource: "products" },
  { label: "Estoque", to: "/estoque/movimentos", resource: "stock" },
  { label: "Financeiro", to: "/financeiro", resource: "payments" },
  { label: "Relatorios", to: "/relatorios", resource: "reports" },
];

export function AppSidebar() {
  const role = useAuthStore((state) => state.user?.role);

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">SO</span>
        <div>
          <strong>Sistema OS</strong>
          <p>Gestao de servicos</p>
        </div>
      </div>
      <nav aria-label="Menu principal">
        {items
          .filter((item) => canAccess(role, item.resource as keyof typeof permissions))
          .map((item) => (
            <NavLink
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
      </nav>
      <div className="sidebar-footer">
        <span className="status-dot" />
        MVP comercial
      </div>
    </aside>
  );
}
