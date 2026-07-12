import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <section className="panel welcome">
      <p className="eyebrow">Acesso restrito</p>
      <h2>Voce nao tem permissao para acessar este modulo.</h2>
      <p>Entre com um perfil autorizado ou volte para o dashboard.</p>
      <Link className="button-primary inline-link" to="/">
        Voltar ao dashboard
      </Link>
    </section>
  );
}
