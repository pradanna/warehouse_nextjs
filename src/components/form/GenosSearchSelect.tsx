"use client";
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";

type Option = {
  label: string;
  value: string | number;
};

type Props = {
  label: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
};

export default function GenosSearchSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  className,
  name,
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Option[]>(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFiltered(
      options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fokus ke input saat dropdown dibuka
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputSearchRef.current?.focus();
      }, 100);
    } else {
      setSearch(""); // Reset search saat dropdown ditutup
    }
  }, [isOpen]);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className={clsx("w-full max-w-[500px]", className)} ref={wrapperRef}>
      <label className="block text-xs text-gray-700 mb-1">{label}</label>
      <div
        className={clsx(
          "relative border rounded-md px-3 py-2 bg-white cursor-pointer",
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white",
          "border-light2"
        )}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        <span className="text-xs text-gray-800">
          {selectedLabel || (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 select-none">
          ▼
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 min-w-4 max-w-3xl bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <input
            type="text"
            ref={inputSearchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className=" px-3 py-2 text-xs border-b border-gray-200 focus:outline-none"
            placeholder="Cari..."
          />

          {/* Tombol Clear Selection */}
          {value !== undefined && value !== null && (
            <div
              onClick={() => {
                onChange?.(null as any); // Kosongkan pilihan
                setIsOpen(false);
                setSearch("");
              }}
              className="px-3 py-2 cursor-pointer text-xs text-red-500 hover:bg-red-100"
            >
              × Kosongkan pilihan
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="p-2 text-xs text-gray-500">
              Data tidak ditemukan
            </div>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                  setSearch("");
                }}
                className={clsx(
                  "px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs",
                  opt.value === value ? "bg-gray-100 font-semibold" : ""
                )}
              >
                {opt.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
