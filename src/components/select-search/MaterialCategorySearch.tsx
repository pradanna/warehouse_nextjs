"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getMaterialCategory } from "@/lib/api/materialCategoryApi";

interface MaterialCategoryOption {
  value: string;
  label: string;
}

interface GenosSearchSelectMaterialCategoryProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
}

export default function GenosSearchSelectMaterialCategory({
  value,
  onChange,
  placeholder = "Cari Kategori Pengeluaran...",
  label = "kategori Pengeluaran",
}: GenosSearchSelectMaterialCategoryProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(
    ["Kategori Pengeluaran", debouncedSearch],
    async () => {
      const res = await getMaterialCategory(debouncedSearch, 1, 1000);
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
      className="mb-3"
    />
  );
}
