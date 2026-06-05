import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppRoutes } from "./app/router";
import { AuthProvider } from "./features/auth/AuthProvider";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}
