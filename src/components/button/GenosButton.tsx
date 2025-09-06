"use client";
import React, { useRef, useState } from "react";
import clsx from "clsx";

type ButtonProps = {
  size?: "xs" | "sm" | "md" | "lg";
  round?: "none" | "sm" | "md" | "lg" | "xl" | "full";
  color?: "primary" | "secondary" | "danger" | "success" | "warning" | "gray";
  className?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  label: string;
  selfStart?: boolean;
  outlined?: boolean;
  text?: boolean;
  ripple?: boolean;
  loading?: boolean; // <-- Tambahan
};

const sizeClasses = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-1 text-base",
  lg: "px-5 py-1 text-lg",
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
  primary:
    "bg-primary-color border border-primary-color text-white hover:bg-primary-dark",
  secondary:
    "bg-secondary-color text-white hover:bg-secondary-dark border border-secondary-color ",
  danger:
    "bg-danger-base  text-white hover:bg-danger-dark border border-danger-base",
  success:
    "bg-success-base text-white hover:bg-success-dark border border-success-base",
  warning:
    "bg-warning-base text-white hover:bg-warning-dark border border-warning-base",
  gray: "bg-gray-400 text-black hover:bg-gray-500 border border-gray-400",
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
  gray: "border border-gray-400 text-gray-300 hover:bg-gray-500 hover:text-white",
};

const textColorClasses = {
  primary: "text-primary-color hover:text-primary-dark",
  secondary: "text-secondary-color hover:text-secondary-dark",
  danger: "text-danger-base hover:text-danger-dark",
  success: "text-success-base hover:text-success-dark",
  warning: "text-warning-base hover:text-warning-dark",
  gray: "text-gray-400 hover:text-gray-500",
};

export default function GenosButton({
  size = "md",
  color = "primary",
  round = "none",
  className = "",
  label,
  iconLeft,
  iconRight,
  onClick,
  type = "button",
  disabled = false,
  selfStart = false,
  outlined = false,
  text = false,
  ripple = true,
  loading = false, // <-- Tambahan
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [rippleEffect, setRippleEffect] = useState<JSX.Element | null>(null);

  const createRipple = (e: React.MouseEvent) => {
    if (!ripple || disabled || loading) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const rippleElement = (
      <span
        className="absolute rounded-full bg-white opacity-40 animate-ripple"
        style={{
          width: size,
          height: size,
          left: x,
          top: y,
        }}
      />
    );

    setRippleEffect(rippleElement);
    setTimeout(() => setRippleEffect(null), 600);
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={(e) => {
        if (onClick) onClick();
        createRipple(e);
      }}
      ref={buttonRef}
      className={clsx(
        "relative font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 inline-flex items-center justify-center gap-2",
        sizeClasses[size],
        roundedClasses[round],
        disabled || loading ? "cursor-default" : "cursor-pointer",
        selfStart && "self-start",
        "h-auto",
        outlined
          ? outlinedColorClasses[color]
          : text
          ? textColorClasses[color]
          : colorClasses[color],
        className
      )}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {!loading && iconLeft && (
        <span className="flex items-center">{iconLeft}</span>
      )}
      <span>{loading ? "Loading..." : label}</span>
      {!loading && iconRight && (
        <span className="flex items-center">{iconRight}</span>
      )}

      {rippleEffect}
    </button>
  );
}
