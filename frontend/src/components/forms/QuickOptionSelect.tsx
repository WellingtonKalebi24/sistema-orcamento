import { useState } from "react";

export function QuickOptionSelect({
  label,
  value,
  options,
  placeholder,
  required = true,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [newOption, setNewOption] = useState("");

  function addOption() {
    const normalized = newOption.trim();
    if (!normalized) return;
    onChange(normalized);
    setNewOption("");
    setCreating(false);
  }

  return (
    <div className="quick-option-field">
      <label>
        {label}
        <select
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {creating ? (
        <div className="quick-option-create">
          <input
            autoFocus
            placeholder={`Nova ${label.toLowerCase()}`}
            value={newOption}
            onChange={(event) => setNewOption(event.target.value)}
          />
          <button className="button-secondary" type="button" onClick={addOption}>
            Adicionar
          </button>
          <button className="button-ghost" type="button" onClick={() => setCreating(false)}>
            Cancelar
          </button>
        </div>
      ) : (
        <button className="button-link" type="button" onClick={() => setCreating(true)}>
          + Cadastrar {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}
