import { Decimal } from "@prisma/client/runtime/library";

export type DecimalLike = Decimal | string | number;

export function decimal(value: DecimalLike | null | undefined) {
  return new Decimal(value ?? 0);
}

export function money(value: DecimalLike | null | undefined) {
  return decimal(value).toDecimalPlaces(2);
}

export function quantity(value: DecimalLike | null | undefined) {
  return decimal(value).toDecimalPlaces(3);
}

export function decimalToString(value: DecimalLike | null | undefined, places = 2) {
  return decimal(value).toFixed(places);
}
