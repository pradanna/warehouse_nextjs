"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getCategories } from "@/lib/api/categoryApi";

interface CategoryOption {
  value: string;
  label: string;
}

interface GenosSearchSelectCategoryProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
}

export default function GenosSearchSelectCategory({
  value,
  onChange,
  placeholder = "Cari Kategori ...",
  label = "kategori ",
}: GenosSearchSelectCategoryProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(
    ["Kategori ", debouncedSearch],
    async () => {
      const res = await getCategories(debouncedSearch, 1, 10);
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
