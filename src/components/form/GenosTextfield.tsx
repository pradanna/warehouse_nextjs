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
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  type?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

const GenosTextfield = forwardRef<HTMLInputElement, Props>(
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
      type = "text",
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const isControlled = value !== undefined && onChange !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isControlled) {
        onChange?.(e);
      } else {
        setInternalValue(e.target.value);
      }
    };

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
            type={type}
            value={inputValue}
            onChange={handleChange}
            name={name}
            placeholder={showFloatingLabel ? placeholder : ""}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={onKeyDown}
            disabled={disabled}
            ref={ref}
            className={clsx(
              "py-2 px-3 bg-transparent focus:outline-none text-sm w-full"
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

GenosTextfield.displayName = "GenosTextfield";
export default GenosTextfield;
