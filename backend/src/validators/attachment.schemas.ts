import { z } from "zod";

export const attachmentTypeSchema = z.object({
  type: z.enum(["WORK_ORDER_PHOTO", "WORK_ORDER_DOCUMENT", "CLIENT_ACCEPTANCE"]),
});

export type AttachmentTypeInput = z.infer<typeof attachmentTypeSchema>;
