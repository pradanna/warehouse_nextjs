"use client";
import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { CalendarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Props = {
  id: string;
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
};

const GenosDatepicker = forwardRef<HTMLInputElement, Props>(
  (
    { id, label, selected, onChange, className = "", name, disabled = false },
    ref: any
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const showFloatingLabel = isFocused || selected;

    return (
      <div className={clsx("relative")}>
        {/* Floating Label */}
        <label
          htmlFor={id}
          className={clsx(
            "absolute left-1 text-xs bg-white transition-all duration-200 px-1 z-10",
            showFloatingLabel
              ? "top-0 -translate-y-1/2 text-gray-500"
              : "top-1/2 -translate-y-1/2 text-gray-400"
          )}
        >
          {label}
        </label>

        <div
          className={clsx(
            "flex items-center border rounded-md transition-all duration-200 ",
            disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
            "border-light2 focus-within:border-primary-light2",
            className
          )}
        >
          <div className="pl-3 flex items-center pointer-events-none">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>

          <DatePicker
            id={id}
            selected={selected}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            dateFormat="dd/MM/yyyy"
            placeholderText={showFloatingLabel ? "Pilih tanggal" : ""}
            className="w-full bg-transparent py-2 px-3 text-sm focus:outline-none"
            popperClassName="z-[999]"
            portalId="root-portal"
            name={name}
            disabled={disabled}
            ref={ref}
          />
        </div>
      </div>
    );
  }
);
GenosDatepicker.displayName = "GenosDatepicker";
export default GenosDatepicker;
