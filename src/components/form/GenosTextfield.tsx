"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  label: string;
  is_icon_left?: boolean;
  is_icon_right?: boolean;
  icon_left?: React.ReactNode;
  icon_right?: React.ReactNode;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  disabled?: boolean;
};

export default function GenosTextfield({
  label,
  is_icon_left = false,
  is_icon_right = false,
  icon_left = <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />,
  icon_right = <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />,
  className,
  value,
  onChange,
  placeholder,
  name,
  type = "text",
  disabled = false,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const safeValue = value ?? "";
  const showFloatingLabel = isFocused || String(safeValue).length > 0;

  return (
    <div className={clsx("relative ", className)}>
      {/* Label melayang */}
      <label
        className={clsx(
          "absolute left-3 px-1 text-xs bg-white transition-all duration-200 pointer-events-none",
          showFloatingLabel
            ? "top-0 text-gray-500 -translate-y-1/2"
            : "top-1/2 -translate-y-1/2 text-gray-400"
        )}
      >
        {label}
      </label>

      <div
        className={clsx(
          "flex items-center border rounded-md transition-all duration-200",
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
          "border-light2 focus-within:border-primary-light2"
        )}
      >
        {is_icon_left && (
          <div className="pl-3 pointer-events-none">{icon_left}</div>
        )}

        <input
          type={type}
          name={name}
          value={safeValue}
          onChange={onChange}
          placeholder={showFloatingLabel ? placeholder : ""}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={clsx(
            "py-2 px-3 bg-transparent focus:outline-none text-sm",
            is_icon_left && "pl-2",
            is_icon_right && "pr-10"
          )}
        />

        {is_icon_right && (
          <div className="pr-3 pointer-events-none">{icon_right}</div>
        )}
      </div>
    </div>
  );
}
