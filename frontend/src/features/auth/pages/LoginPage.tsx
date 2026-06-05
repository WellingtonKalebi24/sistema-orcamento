import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../../lib/api/client";
import { useAuthStore } from "../../../store/auth.store";

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState("admin@sistema.local");
  const [password, setPassword] = useState("Admin@12345");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      setSession(response.data.data.accessToken, response.data.data.user);
      navigate("/");
    } catch {
      setError("Nao foi possivel entrar. Confira e-mail e senha.");
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <span className="brand-mark">SO</span>
        <h1>Entrar no sistema</h1>
        <p>Use o administrador criado pelo seed para testar o MVP comercial.</p>
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
        <button className="button-primary" type="submit">
          Acessar
        </button>
      </form>
    </main>
  );
}
