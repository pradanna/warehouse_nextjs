"use client";
import { forwardRef, useState } from "react";
import clsx from "clsx";
import { PencilIcon } from "@heroicons/react/24/outline";

type Props = {
  label: string;
  is_icon_left?: boolean;
  is_icon_right?: boolean;
  icon_left?: React.ReactNode;
  icon_right?: React.ReactNode;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  rows?: number;
};

const GenosTextarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      is_icon_left = false,
      is_icon_right = false,
      icon_left = <PencilIcon className="w-5 h-5 text-gray-400" />,
      icon_right = <PencilIcon className="w-5 h-5 text-gray-400" />,
      className,
      value,
      onChange,
      onKeyDown,
      placeholder,
      name,
      disabled = false,
      rows = 3,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const isControlled = value !== undefined && onChange !== undefined;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        {/* Label melayang */}
        <label
          className={clsx(
            "absolute",
            is_icon_left ? "left-10" : "left-1",
            "text-xs bg-white transition-all duration-200 px-1 z-10",
            showFloatingLabel
              ? "top-0 -translate-y-1/2 text-gray-500"
              : "top-3 -translate-y-1/2 text-gray-400"
          )}
        >
          {label}
        </label>

        <div
          className={clsx(
            "flex border rounded-md transition-all duration-200 w-full",
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
            "border-light2 focus-within:border-primary-light2"
          )}
        >
          {/* Icon kiri */}
          {is_icon_left && (
            <div className="pl-3 pt-2 flex items-start pointer-events-none">
              {icon_left}
            </div>
          )}

          <textarea
            rows={rows}
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
              "py-2 px-3 bg-transparent focus:outline-none text-sm w-full resize-none"
            )}
          />

          {/* Icon kanan */}
          {is_icon_right && (
            <div className="pr-3 pt-2 flex items-start pointer-events-none">
              {icon_right}
            </div>
          )}
        </div>
      </div>
    );
  }
);
GenosTextarea.displayName = "GenosTextarea";
export default GenosTextarea;
