"use client";

import { getOutlet } from "@/lib/api/outletApi";
import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";

interface OutletOption {
  id: string;
  name: string;
}

interface GenosSearchSelectOutletProps {
  value: string | null;
  onChange: (value: OutletOption | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function GenosSearchSelectOutlet({
  value,
  onChange,
  placeholder = "Cari Outlet...",
  label = "Outlet",
  className = "",
}: GenosSearchSelectOutletProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(["outlet", debouncedSearch], async () => {
    const res = await getOutlet(debouncedSearch, 1, 1000);
    return res.data.map((o: any) => ({
      value: o.id, // tetap string/id untuk GenosSearchSelect
      label: o.name,
      original: { id: o.id, name: o.name }, // simpan object aslinya
    }));
  });

  return (
    <GenosSearchSelect
      label={label}
      value={value} // hanya ID yg dikirim
      onChange={(selectedId: string | null) => {
        const selected = data?.find((o: any) => o.value === selectedId);
        onChange(selected ? selected.original : null); // kirim object ke parent
      }}
      placeholder={placeholder}
      options={data || []}
      isLoading={isLoading}
      className={className}
    />
  );
}
