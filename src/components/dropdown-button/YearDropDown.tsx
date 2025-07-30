"use client";

import React from "react";

interface YearDropdownProps {
  value: number;
  onChange: (year: number) => void;
  className?: string;
}

const YearDropdown: React.FC<YearDropdownProps> = ({
  value,
  onChange,
  className,
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => currentYear - i);

  return (
    <select
      className={`p-1 border border-gray-300 rounded-md ${className}`}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearDropdown;
