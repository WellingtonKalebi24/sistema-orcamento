import { PasswordProvider } from "../providers/auth/password.provider";
import { UserRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import type { UserInput, UserUpdateInput } from "../validators/user.schemas";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date | null;
};

function sanitize(user: UserRecord) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export class UserService {
  constructor(
    private readonly users = new UserRepository(),
    private readonly password = new PasswordProvider(),
  ) {}

  async list(filters: {
    page: number;
    pageSize: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const [data, total] = await this.users.list(filters);
    return { data: data.map((user: UserRecord) => sanitize(user)), meta: { ...filters, total } };
  }

  async findById(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw AppError.notFound("Usuario nao encontrado.");
    return sanitize(user);
  }

  async create(input: UserInput) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw AppError.conflict("E-mail ja cadastrado.");
    const created = await this.users.create({
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash: await this.password.hash(input.password),
    });
    if (input.status === "INACTIVE") {
      return sanitize(await this.users.update(created.id, { status: "INACTIVE" }));
    }
    return sanitize(created);
  }

  async update(id: string, input: UserUpdateInput) {
    await this.findById(id);
    const data: Record<string, unknown> = { ...input };
    if (input.email) {
      const existing = await this.users.findByEmail(input.email);
      if (existing && existing.id !== id) throw AppError.conflict("E-mail ja cadastrado.");
    }
    if (input.password) data.passwordHash = await this.password.hash(input.password);
    delete data.password;
    return sanitize(await this.users.update(id, data));
  }

  async remove(id: string) {
    await this.findById(id);
    return sanitize(await this.users.softDelete(id));
  }
}
