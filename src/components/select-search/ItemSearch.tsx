"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getItems } from "@/lib/api/itemApi";

interface Option {
  value: string | null;
  label: string;
}

interface GenosSearchSelectItem {
  value: string | null;
  onChange: (option: Option | null) => void; // 🔑 ubah di sini
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function GenosSearchSelectItem({
  value,
  onChange,
  placeholder = "Pilih Item...",
  label = "item",
  className = "mb-3",
}: GenosSearchSelectItem) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(["items", debouncedSearch], async () => {
    const res = await getItems(debouncedSearch, 1, 2000);
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
      onChange={(val) => {
        const selected = data?.find((o) => o.value === val) || null;
        onChange(selected); // kirim { value, label }
      }}
      placeholder={placeholder}
      options={data || []}
      isLoading={isLoading}
      className={className}
    />
  );
}
