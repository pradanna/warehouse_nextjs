"use client";

import { getExpensesCategory } from "@/lib/api/expensesCategoryApi";
import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";

interface ExpenseCategoryOption {
  value: string;
  label: string;
}

interface GenosSearchSelectExpenseCategoryProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
}

export default function GenosSearchSelectExpenseCategory({
  value,
  onChange,
  placeholder = "Cari Kategori Pengeluaran...",
  label = "kategori Pengeluaran",
}: GenosSearchSelectExpenseCategoryProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(
    ["Kategori Pengeluaran", debouncedSearch],
    async () => {
      const res = await getExpensesCategory(debouncedSearch, 1, 10);
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
    />
  );
}
