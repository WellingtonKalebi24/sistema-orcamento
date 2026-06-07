import { useEffect, useState } from "react";

import type { Attachment } from "../../../lib/api/schema";
import { attachmentDownloadUrl, listAttachments, uploadAttachment } from "../api/work-orders.api";

export function AttachmentPanel({ workOrderId }: { workOrderId: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [type, setType] = useState<Attachment["type"]>("WORK_ORDER_PHOTO");

  useEffect(() => {
    listAttachments(workOrderId)
      .then(setAttachments)
      .catch(() => setAttachments([]));
  }, [workOrderId]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploaded = await uploadAttachment(workOrderId, file, type);
    setAttachments((current) => [uploaded, ...current]);
    event.target.value = "";
  }

  return (
    <div className="table-card">
      <strong>Anexos da OS</strong>
      <div className="actions compact-actions">
        <select
          value={type}
          onChange={(event) => setType(event.target.value as Attachment["type"])}
        >
          <option value="WORK_ORDER_PHOTO">Foto</option>
          <option value="WORK_ORDER_DOCUMENT">Documento</option>
          <option value="CLIENT_ACCEPTANCE">Aceite do cliente</option>
        </select>
        <input type="file" onChange={onFileChange} />
      </div>
      {attachments.length === 0 ? <p>Nenhum anexo enviado.</p> : null}
      {attachments.map((attachment) => (
        <a
          className="inline-link"
          href={attachmentDownloadUrl(attachment.id)}
          key={attachment.id}
          rel="noreferrer"
          target="_blank"
        >
          {attachment.originalName}
        </a>
      ))}
    </div>
  );
}
