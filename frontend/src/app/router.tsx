import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { NewClientPage } from "../features/clients/pages/NewClientPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { NewQuotePage } from "../features/quotes/pages/NewQuotePage";
import { QuoteDetailPage } from "../features/quotes/pages/QuoteDetailPage";
import { QuotesPage } from "../features/quotes/pages/QuotesPage";

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
          <Route path="/clientes/novo" element={<NewClientPage />} />
          <Route path="/orcamentos" element={<QuotesPage />} />
          <Route path="/orcamentos/novo" element={<NewQuotePage />} />
          <Route path="/orcamentos/:id" element={<QuoteDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
