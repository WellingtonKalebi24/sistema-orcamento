import { Navigate } from "react-router-dom";

import { canAccess, type permissions } from "../../app/permissions";
import { useAuthStore } from "../../store/auth.store";
import { ForbiddenPage } from "../feedback/ForbiddenPage";

export function ProtectedRoute({
  children,
  resource,
}: {
  children: React.ReactNode;
  resource?: keyof typeof permissions;
}) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  if (resource && !canAccess(user.role, resource)) return <ForbiddenPage />;
  return <>{children}</>;
}
