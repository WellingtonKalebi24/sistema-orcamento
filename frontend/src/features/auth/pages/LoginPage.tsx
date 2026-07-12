import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../../lib/api/client";
import { getApiErrorMessage } from "../../../lib/api/errors";
import {
  getCompanyBranding,
  getPublicCompanyLogo,
  type CompanyBranding,
} from "../../settings/api/settings.api";
import { useAuthStore } from "../../../store/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("admin@sistema.local");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [branding, setBranding] = useState<CompanyBranding>();
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    let activeLogoUrl = "";
    getCompanyBranding()
      .then(async (company) => {
        setBranding(company);
        if (company.hasLogo) {
          const logo = await getPublicCompanyLogo();
          activeLogoUrl = URL.createObjectURL(logo);
          setLogoUrl(activeLogoUrl);
        }
      })
      .catch(() => undefined);

    return () => {
      if (activeLogoUrl) URL.revokeObjectURL(activeLogoUrl);
    };
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      setSession(response.data.data.accessToken, response.data.data.user);
      navigate("/");
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel entrar. Confira e-mail e senha."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="login-page"
      style={
        {
          "--blue": branding?.primaryColor ?? "#245dde",
          "--navy": branding?.sidebarColor ?? "#12233e",
        } as CSSProperties
      }
    >
      <form className="login-card" onSubmit={submit}>
        <span className="brand-mark">
          {logoUrl ? <img alt="Logo da empresa" src={logoUrl} /> : "SO"}
        </span>
        <h1>Entrar no {branding?.systemName ?? "sistema"}</h1>
        <p>Acesse com seu e-mail e senha para continuar.</p>
        <label>
          E-mail
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="button-primary" disabled={submitting} type="submit">
          {submitting ? "Entrando..." : "Acessar"}
        </button>
      </form>
    </main>
  );
}
