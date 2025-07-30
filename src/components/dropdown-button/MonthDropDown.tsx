"use client";

import React from "react";

interface MonthDropdownProps {
  value: number;
  onChange: (month: number) => void;
  className?: string;
}

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MonthDropdown: React.FC<MonthDropdownProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <select
      className={`p-1 border border-gray-300 rounded-md ${className}`}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {months.map((month, index) => (
        <option key={index + 1} value={index + 1}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default MonthDropdown;
