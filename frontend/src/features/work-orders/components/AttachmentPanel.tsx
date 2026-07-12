import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Attachment } from "../../../lib/api/schema";
import { attachmentTypeLabels } from "../../../lib/formatters/labels";
import { attachmentDownloadUrl, listAttachments, uploadAttachment } from "../api/work-orders.api";

export function AttachmentPanel({ workOrderId }: { workOrderId: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [type, setType] = useState<Attachment["type"]>("WORK_ORDER_PHOTO");
  const [error, setError] = useState("");

  useEffect(() => {
    listAttachments(workOrderId)
      .then(setAttachments)
      .catch(() => setAttachments([]));
  }, [workOrderId]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");

    try {
      const uploaded = await uploadAttachment(workOrderId, file, type);
      setAttachments((current) => [uploaded, ...current]);
      event.target.value = "";
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel enviar o anexo."));
    }
  }

  return (
    <div className="table-card">
      <strong>Anexos da OS</strong>
      <div className="actions compact-actions">
        <select
          value={type}
          onChange={(event) => setType(event.target.value as Attachment["type"])}
        >
          <option value="WORK_ORDER_PHOTO">{attachmentTypeLabels.WORK_ORDER_PHOTO}</option>
          <option value="WORK_ORDER_DOCUMENT">{attachmentTypeLabels.WORK_ORDER_DOCUMENT}</option>
          <option value="CLIENT_ACCEPTANCE">{attachmentTypeLabels.CLIENT_ACCEPTANCE}</option>
        </select>
        <input type="file" onChange={onFileChange} />
      </div>
      {error ? <p className="form-error">{error}</p> : null}
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
