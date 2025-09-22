"use client";
import { forwardRef, useState } from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type Props = {
  id: string;
  label: string;
  is_icon_left?: boolean;
  is_icon_right?: boolean;
  icon_left?: React.ReactNode;
  icon_right?: React.ReactNode;
  className?: string;
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

// 👉 helper format angka dengan pecahan
const formatNumber = (val: string | number) => {
  if (val === "" || val === undefined || val === null) return "";
  const num = typeof val === "string" ? val : val.toString();

  // ganti koma ke titik untuk parsing
  const normalized = num.replace(",", ".");
  const parsed = parseFloat(normalized);
  if (isNaN(parsed)) return num; // biarkan inputan aneh tetap tampil

  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10, // biar pecahan panjang tetap bisa
  }).format(parsed);
};

const GenosTextfieldNumber = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      is_icon_left = false,
      is_icon_right = false,
      icon_left = <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />,
      icon_right = <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />,
      className,
      value,
      onKeyDown,
      onChange,
      placeholder,
      name,
      disabled = false,
      readOnly = false,
      onBlur,
      onClick,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const isControlled = value !== undefined && onChange !== undefined;

    const inputValue = isControlled ? value : internalValue;
    const showFloatingLabel = isFocused || String(inputValue).length > 0;

    return (
      <div className={clsx("relative", className)}>
        {/* Label Melayang */}
        <label
          htmlFor={id}
          className={clsx(
            "absolute",
            is_icon_left ? "left-10" : "left-1",
            "text-xs bg-white transition-all duration-200 px-1 z-10",
            showFloatingLabel
              ? "top-0 -translate-y-1/2 text-gray-500"
              : "top-1/2 -translate-y-1/2 text-gray-400"
          )}
        >
          {label}
        </label>

        <div
          className={clsx(
            "flex items-center border rounded-md transition-all duration-200 w-full",
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
            "border-light2 focus-within:border-primary-light2"
          )}
        >
          {/* Icon kiri */}
          {is_icon_left && (
            <div className="pl-3 flex items-center pointer-events-none">
              {icon_left}
            </div>
          )}

          <input
            id={id}
            type="text"
            value={
              isFocused
                ? internalValue // tampilkan apa adanya ketika user lagi ketik
                : inputValue !== "" && inputValue !== undefined
                ? formatNumber(inputValue)
                : ""
            }
            onChange={(e) => {
              const raw = e.target.value;
              setInternalValue(raw); // biarkan string mentah dulu

              // normalize ke angka
              const normalized = raw.replace(/\./g, "").replace(/,/g, ".");
              const parsed = parseFloat(normalized);

              if (!isNaN(parsed)) {
                onChange(parsed); // kirim angka murni ke parent
              }
            }}
            name={name}
            placeholder={showFloatingLabel ? placeholder : ""}
            onFocus={() => {
              setIsFocused(true);
              setInternalValue(
                inputValue !== "" && inputValue !== undefined
                  ? String(inputValue)
                  : ""
              );
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            onClick={onClick}
            onKeyDown={onKeyDown}
            disabled={disabled}
            readOnly={readOnly}
            ref={ref}
            className={clsx(
              "py-2 px-3 bg-transparent focus:outline-none text-sm w-full cursor-pointer"
            )}
          />

          {/* Icon kanan */}
          {is_icon_right && (
            <div className="pr-3 flex items-center pointer-events-none">
              {icon_right}
            </div>
          )}
        </div>
      </div>
    );
  }
);

GenosTextfieldNumber.displayName = "GenosTextfieldNumber";
export default GenosTextfieldNumber;
