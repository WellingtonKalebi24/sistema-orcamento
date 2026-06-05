import { PrismaClient } from "@prisma/client";

let client: PrismaClient | undefined;

function getClient() {
  client ??= new PrismaClient();
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    return Reflect.get(getClient(), property);
  },
});

export type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
