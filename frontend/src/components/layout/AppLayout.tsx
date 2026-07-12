import { useEffect, useState, type CSSProperties } from "react";
import { Outlet } from "react-router-dom";

import type { CompanySettings } from "../../lib/api/schema";
import { getCompanyLogo, getCompanySettings } from "../../features/settings/api/settings.api";
import { useAuthStore } from "../../store/auth.store";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const clear = useAuthStore((state) => state.clearSession);
  const [settings, setSettings] = useState<CompanySettings>();
  const [logoUrl, setLogoUrl] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let activeLogoUrl = "";

    async function loadBranding() {
      const company = await getCompanySettings();
      setSettings(company);
      if (company.logoAttachmentId) {
        try {
          const logo = await getCompanyLogo();
          activeLogoUrl = URL.createObjectURL(logo);
          setLogoUrl(activeLogoUrl);
        } catch {
          setLogoUrl("");
        }
      }
    }

    void loadBranding();
    const handleBrandingUpdate = () => void loadBranding();
    window.addEventListener("company-settings-updated", handleBrandingUpdate);

    return () => {
      window.removeEventListener("company-settings-updated", handleBrandingUpdate);
      if (activeLogoUrl) URL.revokeObjectURL(activeLogoUrl);
    };
  }, []);

  const themeStyle = {
    "--blue": settings?.primaryColor ?? "#245dde",
    "--navy": settings?.sidebarColor ?? "#12233e",
  } as CSSProperties;

  return (
    <div className="app-shell" style={themeStyle}>
      <AppSidebar
        logoUrl={logoUrl}
        open={menuOpen}
        settings={settings}
        onNavigate={() => setMenuOpen(false)}
      />
      <main className="content">
        <header className="page-header">
          <div>
            <button
              aria-label="Abrir menu"
              className="mobile-menu-button"
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
            >
              Menu
            </button>
            <p className="eyebrow">Painel administrativo</p>
            <h1>{settings?.systemName || "Sistema de orcamentos"}</h1>
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
