import { api } from "../../../lib/api/client";
import type { CompanySettings } from "../../../lib/api/schema";

export async function getCompanySettings() {
  const response = await api.get("/company-settings");
  return response.data.data as CompanySettings;
}

export async function updateCompanySettings(input: Partial<CompanySettings>) {
  const response = await api.patch("/company-settings", input);
  return response.data.data as CompanySettings;
}

export async function uploadCompanyLogo(file: File) {
  const data = new FormData();
  data.append("file", file);
  const response = await api.post("/company-settings/logo", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data as CompanySettings;
}

export async function getCompanyLogo() {
  const response = await api.get("/company-settings/logo", { responseType: "blob" });
  return response.data as Blob;
}

export type CompanyBranding = {
  companyName: string;
  systemName: string;
  primaryColor: string;
  sidebarColor: string;
  hasLogo: boolean;
};

export async function getCompanyBranding() {
  const response = await api.get("/company-settings/branding");
  return response.data.data as CompanyBranding;
}

export async function getPublicCompanyLogo() {
  const response = await api.get("/company-settings/branding/logo", { responseType: "blob" });
  return response.data as Blob;
}
