import { Router } from "express";

import { attachmentRouter } from "./attachment.routes";
import { authRouter } from "./auth.routes";
import { catalogRouter } from "./catalog.routes";
import { clientRouter } from "./client.routes";
import { companySettingsRouter } from "./company-settings.routes";
import { dashboardRouter } from "./dashboard.routes";
import { healthRouter } from "./health.routes";
import { paymentRouter } from "./payment.routes";
import { productRouter } from "./product.routes";
import { quoteRouter } from "./quote.routes";
import { reportRouter } from "./report.routes";
import { serviceRouter } from "./service.routes";
import { stockRouter } from "./stock.routes";
import { userRouter } from "./user.routes";
import { workOrderRouter } from "./work-order.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/clients", clientRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/company-settings", companySettingsRouter);
apiRouter.use("/catalog", catalogRouter);
apiRouter.use("/services", serviceRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/", stockRouter);
apiRouter.use("/quotes", quoteRouter);
apiRouter.use("/work-orders", workOrderRouter);
apiRouter.use("/attachments", attachmentRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/reports", reportRouter);
