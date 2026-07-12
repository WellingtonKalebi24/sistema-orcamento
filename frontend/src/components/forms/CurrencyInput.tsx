import { useMemo } from "react";

import { formatCurrency } from "../../lib/formatters/currency";

function decimalFromDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "0.00";
  return (Number(digits) / 100).toFixed(2);
}

export function CurrencyInput({
  value,
  onChange,
  required,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  const displayValue = useMemo(() => formatCurrency(value), [value]);

  return (
    <input
      disabled={disabled}
      inputMode="numeric"
      required={required}
      value={displayValue}
      onChange={(event) => onChange(decimalFromDigits(event.target.value))}
    />
  );
}
