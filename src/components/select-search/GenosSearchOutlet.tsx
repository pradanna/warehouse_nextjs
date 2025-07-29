"use client";

import { getOutlet } from "@/lib/api/outletApi";
import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";

interface OutletOption {
  value: string;
  label: string;
}

interface GenosSearchSelectOutletProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
}

export default function GenosSearchSelectOutlet({
  value,
  onChange,
  placeholder = "Cari Outlet...",
  label = "Outlet",
}: GenosSearchSelectOutletProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(["outlet", debouncedSearch], async () => {
    const res = await getOutlet(debouncedSearch, 1, 1000);
    return res.data.map((o: any) => ({
      value: o.id,
      label: o.name,
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
    />
  );
}
