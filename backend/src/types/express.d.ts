import type { UserRole } from "../types/domain";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
