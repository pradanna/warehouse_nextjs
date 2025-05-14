"use client";
import { useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);
  const showFloatingLabel = isFocused || (!!value && value !== "");

  return (
    <div className={clsx("relative", className)}>
      {/* Floating label */}
      <label
        className={clsx(
          "absolute left-3 px-1 text-xs bg-white transition-all duration-200 pointer-events-none z-10 ",
          showFloatingLabel
            ? "top-0 text-gray-500 -translate-y-1/2"
            : "top-1/2 -translate-y-1/2 text-gray-400"
        )}
      >
        {label}
      </label>

      <div
        className={clsx(
          "relative border rounded-md transition-all duration-200 pe-6",
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
          "border-light2 focus-within:border-primary-light2"
        )}
      >
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className="py-2 px-3 bg-transparent focus:outline-none text-sm appearance-none"
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

        {/* Dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          ▼
        </div>
      </div>
    </div>
  );
}
