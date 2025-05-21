"use client";
import clsx from "clsx";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  label: string;
  options: Option[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
};

export default function GenosSelect({
  label,
  options,
  value,
  onChange,
  className,
  placeholder = "Pilih...",
  name,
  disabled = false,
}: Props) {
  return (
    <div className={clsx("flex flex-col", className)}>
      <label className="mb-1 text-sm text-gray-700">{label}</label>
      <div
        className={clsx(
          "relative border rounded-md px-3 py-2 bg-white transition-all duration-200",
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
          "border-light2 focus-within:border-primary-light2"
        )}
      >
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent focus:outline-none text-sm appearance-none"
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Dropdown icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </div>
      </div>
    </div>
  );
}
