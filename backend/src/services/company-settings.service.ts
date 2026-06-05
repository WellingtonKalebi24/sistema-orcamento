import { CompanySettingsRepository } from "../repositories/company-settings.repository";

export class CompanySettingsService {
  constructor(private readonly settings = new CompanySettingsRepository()) {}

  getDefault() {
    return this.settings.getDefault();
  }
}
