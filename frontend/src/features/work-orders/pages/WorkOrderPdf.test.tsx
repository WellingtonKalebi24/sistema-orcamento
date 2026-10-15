import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import { WorkOrderDetailPage } from "./WorkOrderDetailPage";
import { getWorkOrder, downloadWorkOrderPdf } from "../api/work-orders.api";

vi.mock("../api/work-orders.api", () => ({ getWorkOrder: vi.fn(), downloadWorkOrderPdf: vi.fn() }));
vi.mock("../components/EquipmentPanel", () => ({ EquipmentPanel: () => null }));
vi.mock("../components/AttachmentPanel", () => ({ AttachmentPanel: () => null }));
vi.mock("../components/ExecutionForm", () => ({ ExecutionForm: () => null }));
vi.mock("../components/WorkOrderStatusPanel", () => ({ WorkOrderStatusPanel: () => null }));

it("baixa o PDF da OS e permite tentar novamente em caso de erro", async () => {
  vi.mocked(getWorkOrder).mockResolvedValue({ id: "1", number: "OS-1", status: "ABERTA" } as never);
  vi.mocked(downloadWorkOrderPdf)
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValue(undefined);
  render(
    <MemoryRouter initialEntries={["/ordens/1"]}>
      <Routes>
        <Route path="/ordens/:id" element={<WorkOrderDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.click(await screen.findByRole("button", { name: "Baixar PDF" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível baixar");
  fireEvent.click(screen.getByRole("button", { name: "Baixar PDF" }));
  expect(downloadWorkOrderPdf).toHaveBeenLastCalledWith("1", "OS-1");
  expect(await screen.findByRole("button", { name: "Baixar PDF" })).toBeEnabled();
});
