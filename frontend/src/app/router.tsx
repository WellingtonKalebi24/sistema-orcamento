import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { NewClientPage } from "../features/clients/pages/NewClientPage";
import { ClientDetailPage } from "../features/clients/pages/ClientDetailPage";
import { ClientsPage } from "../features/clients/pages/ClientsPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { PaymentsPage } from "../features/payments/pages/PaymentsPage";
import { ProductsPage } from "../features/products/pages/ProductsPage";
import { StockMovementsPage } from "../features/products/pages/StockMovementsPage";
import { NewQuotePage } from "../features/quotes/pages/NewQuotePage";
import { QuoteDetailPage } from "../features/quotes/pages/QuoteDetailPage";
import { QuotesPage } from "../features/quotes/pages/QuotesPage";
import { ReportsPage } from "../features/reports/pages/ReportsPage";
import { ServicesPage } from "../features/services/pages/ServicesPage";
import { NewWorkOrderPage } from "../features/work-orders/pages/NewWorkOrderPage";
import { WorkOrderDetailPage } from "../features/work-orders/pages/WorkOrderDetailPage";
import { WorkOrdersPage } from "../features/work-orders/pages/WorkOrdersPage";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/clientes/novo" element={<NewClientPage />} />
          <Route path="/clientes/:id" element={<ClientDetailPage />} />
          <Route path="/orcamentos" element={<QuotesPage />} />
          <Route path="/orcamentos/novo" element={<NewQuotePage />} />
          <Route path="/orcamentos/:id" element={<QuoteDetailPage />} />
          <Route path="/ordens" element={<WorkOrdersPage />} />
          <Route path="/ordens/nova" element={<NewWorkOrderPage />} />
          <Route path="/ordens/:id" element={<WorkOrderDetailPage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/estoque/movimentos" element={<StockMovementsPage />} />
          <Route path="/financeiro" element={<PaymentsPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
