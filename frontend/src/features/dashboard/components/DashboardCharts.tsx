import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DashboardSummary } from "../../../lib/api/schema";

export function DashboardCharts({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="panels">
      <div className="panel">
        <p className="eyebrow">Faturamento</p>
        <ResponsiveContainer height={220} width="100%">
          <BarChart data={summary.revenueSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#245dde" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <p className="eyebrow">Status dos orcamentos</p>
        <ResponsiveContainer height={220} width="100%">
          <BarChart data={summary.quoteStatus}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#12a56a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
