import { useEffect, useState } from "react";

import type { CompanySettings } from "../../../lib/api/schema";
import { getCompanySettings } from "../api/settings.api";
import { CompanySettingsForm } from "../components/CompanySettingsForm";

export function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings>();

  useEffect(() => {
    getCompanySettings().then(setSettings);
  }, []);

  if (!settings) return <section className="panel">Carregando configuracoes...</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Empresa</p>
      <h2>Identidade, PDF e estoque</h2>
      <CompanySettingsForm settings={settings} onChange={setSettings} />
    </section>
  );
}
