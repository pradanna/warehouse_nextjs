"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getSupplier } from "@/lib/api/supplierApi";

interface GenosSearchSelectSupplier {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function GenosSearchSelectSupplier({
  value,
  onChange,
  placeholder = "Pilih Supplier...",
  label = "item",
  className = "",
}: GenosSearchSelectSupplier) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(
    ["Supplier", debouncedSearch],
    async () => {
      const res = await getSupplier(debouncedSearch, 1, 2000);
      console.log("SEARCH SUP", res.data);
      return res.data.map((o: any) => ({
        value: o.id,
        label: o.name,
      }));
    }
  );

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
