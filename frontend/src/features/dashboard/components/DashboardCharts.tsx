import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DashboardSummary } from "../../../lib/api/schema";
import { quoteStatusLabels } from "../../../lib/formatters/labels";

export function DashboardCharts({ summary }: { summary: DashboardSummary }) {
  const quoteStatusData = summary.quoteStatus.map((item) => ({
    ...item,
    label: quoteStatusLabels[item.status],
  }));

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
          <BarChart data={quoteStatusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#12a56a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
