import { NavLink } from "react-router-dom";

const items = [
  { label: "Dashboard", to: "/" },
  { label: "Clientes", to: "/clientes/novo" },
  { label: "Orcamentos", to: "/orcamentos" },
  { label: "Novo orcamento", to: "/orcamentos/novo" },
  { label: "Ordens de servico", to: "/ordens" },
  { label: "Nova OS", to: "/ordens/nova" },
];

export function AppSidebar() {
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
        {items.map((item) => (
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
