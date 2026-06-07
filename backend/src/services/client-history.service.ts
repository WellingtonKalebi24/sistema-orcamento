import { ClientService } from "./client.service";

export class ClientHistoryService {
  constructor(private readonly clients = new ClientService()) {}

  history(id: string) {
    return this.clients.history(id);
  }
}
