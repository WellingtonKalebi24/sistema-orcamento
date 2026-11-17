import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api/client";
import { getApiErrorMessage } from "../lib/api/errors";
import { useAuthStore } from "../store/auth.store";

export function DocumentActions({
  kind,
  id,
  number,
  phone = "",
}: {
  kind: "quotes" | "work-orders";
  id: string;
  number: string;
  phone?: string;
}) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [recipient, setRecipient] = useState(phone);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const canManage = user?.role === "ADMIN" || user?.role === "ATENDENTE";
  async function remove() {
    if (!window.confirm(`Excluir ${number}? O documento sera retirado das listas.`)) return;
    setBusy(true);
    setMessage("");
    try {
      await api.delete(`/${kind}/${id}`);
      navigate(kind === "quotes" ? "/orcamentos" : "/ordens");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Nao foi possivel excluir."));
    } finally {
      setBusy(false);
    }
  }
  async function sendPdf() {
    if (!window.confirm(`Enviar o PDF ${number} pelo WhatsApp para ${recipient}?`)) return;
    setBusy(true);
    setMessage("");
    try {
      await api.post(`/${kind}/${id}/whatsapp`, { phone: recipient }, { timeout: 45_000 });
      setMessage("PDF enviado pelo WAHA.");
    } catch (error) {
      setMessage(
        getApiErrorMessage(
          error,
          "Nao foi possivel confirmar o envio. Confira a conversa antes de tentar novamente.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  function whatsapp() {
    let digits = recipient.replace(/\D/g, "");
    if (!recipient.trim().startsWith("+") && (digits.length === 10 || digits.length === 11))
      digits = `55${digits}`;
    if (digits.length < 10 || digits.length > 15) {
      setMessage("Informe o WhatsApp com DDD e codigo do pais.");
      return;
    }
    const text = `Ola! Segue ${kind === "quotes" ? "o orcamento" : "a ordem de servico"} ${number}.`;
    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setMessage("Conversa aberta. Use Baixar PDF e anexe o documento no WhatsApp antes de enviar.");
  }
  return (
    <div className="table-card">
      {canManage ? (
        <button
          className="button-secondary"
          type="button"
          disabled={busy}
          onClick={() => void remove()}
        >
          {busy ? "Aguarde..." : "Excluir"}
        </button>
      ) : null}
      <label>
        WhatsApp do destinatario (cliente ou empresa)
        <input
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="55 + DDD + numero"
          inputMode="tel"
        />
      </label>
      <button className="button-secondary" type="button" onClick={whatsapp}>
        Abrir WhatsApp
      </button>
      {canManage ? (
        <button
          className="button-primary"
          type="button"
          disabled={busy}
          onClick={() => void sendPdf()}
        >
          {busy ? "Aguarde..." : "Enviar PDF pelo WAHA"}
        </button>
      ) : null}
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
