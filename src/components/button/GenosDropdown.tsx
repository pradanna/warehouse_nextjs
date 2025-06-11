"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

type Option = {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type Props = {
  label?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  round?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  color?: "primary" | "secondary" | "danger" | "success" | "warning" | "gray";
  className?: string;
  outlined?: boolean;
  text?: boolean;
  disabled?: boolean;
  align?: "left" | "right";
  options: Option[];
};

const sizeClasses = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-1 text-base",
  lg: "px-5 py-2 text-lg",
};

const roundedClasses = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

const colorClasses = {
  primary: "bg-primary-color text-white hover:bg-primary-dark",
  secondary: "bg-secondary-color text-gray-800 hover:bg-secondary-dark",
  danger: "bg-danger-base text-white hover:bg-danger-dark",
  success: "bg-success-base text-white hover:bg-success-dark",
  warning: "bg-warning-base text-white hover:bg-warning-dark",
  gray: "bg-gray-400 text-black hover:bg-gray-500",
};

const outlinedColorClasses = {
  primary:
    "border border-primary-color text-primary-color hover:bg-primary-color hover:text-white",
  secondary:
    "border border-secondary-color text-secondary-color hover:bg-secondary-color hover:text-white",
  danger:
    "border border-danger-base text-danger-base hover:bg-danger-base hover:text-white",
  success:
    "border border-success-base text-success-base hover:bg-success-base hover:text-white",
  warning:
    "border border-warning-base text-warning-base hover:bg-warning-base hover:text-white",
  gray: "border border-gray-400 text-gray-400 hover:bg-gray-500 hover:text-white",
};

const textColorClasses = {
  primary: "text-primary-color hover:text-primary-dark",
  secondary: "text-secondary-color hover:text-secondary-dark",
  danger: "text-danger-base hover:text-danger-dark",
  success: "text-success-base hover:text-success-dark",
  warning: "text-warning-base hover:text-warning-dark",
  gray: "text-gray-400 r:text-gray-400",
};

export default function GenosDropdown({
  label,
  iconLeft,
  iconRight,
  size = "md",
  round = "md",
  color = "primary",
  className = "",
  outlined = false,
  text = false,
  disabled = false,
  align = "left",
  options,
}: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setOpen(!open);
  };

  const closeOnClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => {
      document.removeEventListener("mousedown", closeOnClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        disabled={disabled}
        className={clsx(
          "flex items-center gap-2 transition-all font-medium focus:outline-none",
          sizeClasses[size],
          roundedClasses[round],
          disabled ? "cursor-default opacity-50" : "cursor-pointer",
          outlined
            ? outlinedColorClasses[color]
            : text
            ? textColorClasses[color]
            : colorClasses[color],
          className
        )}
      >
        {iconLeft && <span>{iconLeft}</span>}
        {label && <span>{label}</span>}
        {iconRight && <span>{iconRight}</span>}
      </button>

      {open && (
        <div
          className={clsx(
            "absolute z-10 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden cursor-pointer animate-fade-in",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                opt.onClick?.();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
              {opt.icon && <span>{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
