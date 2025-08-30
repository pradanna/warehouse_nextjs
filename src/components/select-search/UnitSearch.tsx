"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getUnit } from "@/lib/api/unitApi";

interface GenosSearchSelectUnit {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function GenosSearchSelectUnit({
  value,
  onChange,
  placeholder = "Pilih Unit...",
  label = "Unit",
  className = "mb-3",
}: GenosSearchSelectUnit) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(["unit", debouncedSearch], async () => {
    const res = await getUnit(debouncedSearch, 1, 2000);
    const units = res.data ?? []; // fallback biar gak undefined
    return units.map((o: any) => ({
      value: o.id,
      label: o.name ?? "-",
    }));
  });

  return (
    <GenosSearchSelect
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      options={data || []}
      isLoading={isLoading}
      className={className}
    />
  );
}
