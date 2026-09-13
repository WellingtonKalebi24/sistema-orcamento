import { useState } from "react";
import { Link } from "react-router-dom";
import type { ClientHistory } from "../api/clients.api";
import { quoteStatusLabels, workOrderStatusLabels } from "../../../lib/formatters/labels";
import { formatCurrency } from "../../../lib/formatters/currency";

const date = (value?: string) => value ? new Date(value).toLocaleDateString("pt-BR") : "Nao concluida";

export function ClientHistoryReport({ client }: { client: ClientHistory }) {
  const [equipment, setEquipment] = useState("");
  const orders = client.workOrders ?? [];
  const groups = client.equipmentHistory ?? [];
  const filtered = orders.filter((order) => !equipment || (equipment === "unknown" ? !order.equipmentIdentifier : order.equipmentIdentifier?.trim().toUpperCase() === equipment));
  return <section className="client-history-report">
    <div className="inline-header"><h2>Historico de {client.name}</h2>
      <button className="button-secondary print-hidden" onClick={() => window.print()}>Imprimir / salvar PDF</button>
    </div>
    <p>CPF/CNPJ: {client.document} | Emitido em {new Date().toLocaleString("pt-BR")}</p>
    <div className="cards compact-cards">
      <div className="card">Atendimentos (sem cancelados)<strong>{orders.filter((order) => order.status !== "CANCELADA").length}</strong></div>
      <div className="card">Manutencoes concluidas<strong>{orders.filter((order) => order.status === "CONCLUIDA").length}</strong></div>
      <div className="card">Equipamentos identificados<strong>{groups.length}</strong></div>
      <div className="card">Equipamentos com mais de uma manutencao concluida<strong>{groups.filter((group) => group.completed > 1).length}</strong></div>
    </div>
    <h3>Equipamentos e retornos</h3>
    <p>As pecas utilizadas pertencem ao estoque; o equipamento abaixo e o aparelho do cliente. Retorno nao significa necessariamente o mesmo defeito ou garantia.</p>
    <label className="print-hidden">Filtrar equipamento<select value={equipment} onChange={(event) => setEquipment(event.target.value)}>
      <option value="">Todos os equipamentos</option><option value="unknown">Sem identificacao</option>
      {groups.map((group) => <option key={group.identifier} value={group.identifier}>{group.name} - {group.identifier}</option>)}
    </select></label>
    <p>Filtro: {equipment || "Todos os equipamentos"}. OS exibidas: {filtered.length}.</p>
    {!groups.length && <p>Nenhum equipamento identificado. Informe o numero de serie ou codigo interno na OS para reconhecer os proximos retornos.</p>}
    {groups.filter((group) => !equipment || group.identifier === equipment).map((group) => <article className="table-card" key={group.identifier}>
      <h4>{group.name || "Equipamento"} - {group.identifier}</h4>
      <p>{group.brand} {group.model}</p>
      <p>{group.visits} atendimento(s) nao cancelado(s); {group.completed} manutencao(oes) concluida(s).</p>
      {group.visits > 1 && <strong>Ja retornou para atendimento.</strong>}
      {group.completed > 1 && <p>Manutencao concluida mais de uma vez.</p>}
    </article>)}
    <h3>Historico detalhado de atendimentos</h3>
    {!filtered.length && <p>Nenhuma ordem de servico para este filtro.</p>}
    {filtered.map((order) => <article className="table-card" key={order.id}>
      <h4><Link to={`/ordens/${order.id}`}>{order.number}</Link> - {workOrderStatusLabels[order.status]}</h4>
      <p>Abertura: {date(order.openedAt)} | Conclusao: {date(order.completedAt)}</p>
      <p>Equipamento: {order.equipmentName || "Nao informado"} | {order.equipmentBrand} {order.equipmentModel} | Identificacao: {order.equipmentIdentifier || "Nao identificada; nao e possivel confirmar retorno"}</p>
      <p>Problema relatado: {order.problemDescription}</p>
      <p>Execucao: {order.executionDescription || "Nao registrada"}</p>
      <p>Observacoes ao cliente: {order.clientNotes || "Nenhuma"}</p>
      <ul>{order.items?.map((item) => <li key={item.id}>{item.type === "PRODUCT" ? "Peca" : "Servico"}: {item.descriptionSnapshot} | Previsto: {item.plannedQuantity}{item.type === "PRODUCT" ? ` | Utilizado: ${item.usedQuantity}` : ""}</li>)}</ul>
    </article>)}
    <h3>Orcamentos do cliente (todos os equipamentos)</h3>
    {!client.quotes?.length && <p>Nenhum orcamento registrado.</p>}
    {client.quotes?.map((quote) => <p key={quote.id}><Link to={`/orcamentos/${quote.id}`}>{quote.number}</Link> - {quoteStatusLabels[quote.status]} - {formatCurrency(quote.totalAmount)} - {quote.requestDescription}</p>)}
  </section>;
}
