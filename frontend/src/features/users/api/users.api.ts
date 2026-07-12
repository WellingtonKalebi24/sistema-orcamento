import { api } from "../../../lib/api/client";
import type { User } from "../../../lib/api/schema";

export async function listUsers() {
  const response = await api.get("/users", { params: { pageSize: 50 } });
  return response.data.data.data as User[];
}

export async function createUser(input: unknown) {
  const response = await api.post("/users", input);
  return response.data.data as User;
}

export async function updateUser(id: string, input: unknown) {
  const response = await api.patch(`/users/${id}`, input);
  return response.data.data as User;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data.data as User;
}
