export function onlyDigits(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
