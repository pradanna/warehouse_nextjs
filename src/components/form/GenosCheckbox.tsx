import { CheckIcon } from "@heroicons/react/24/solid";
import React from "react";
import clsx from "clsx";

type GenosCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  className?: string;
  disabled?: boolean;
  icon?: boolean;
};

const GenosCheckbox: React.FC<GenosCheckboxProps> = ({
  checked,
  onChange,
  className,
  disabled = false,
  icon = false,
}) => {
  return (
    <label
      className={clsx(
        "inline-flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-150 cursor-pointer",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        checked
          ? "bg-primary-color border-primary-color"
          : "border-gray-400 bg-white",
        className
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
      {checked && icon && <CheckIcon className="w-4 h-4 text-white" />}
    </label>
  );
};

export default GenosCheckbox;
