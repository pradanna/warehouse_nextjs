"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getInventory } from "@/lib/api/inventory/inventoryApi";

interface GenosSearchSelectInventory {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function GenosSearchSelectInventory({
  value,
  onChange,
  placeholder = "Pilih Item...",
  label = "item",
  className = "mb-3",
}: GenosSearchSelectInventory) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(
    ["Inventory", debouncedSearch],
    async () => {
      const res = await getInventory(debouncedSearch, 1, 2000);
      return res.data.map((o: any) => ({
        value: o.id,
        label: o.item.name + " (" + o.unit.name + ")",
      }));
      console.log(data);
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
