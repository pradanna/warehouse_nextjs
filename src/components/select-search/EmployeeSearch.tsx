"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState } from "react";
import useSWR from "swr";
import { fetchEmployees } from "@/lib/api/employee/employeeApi";
import GenosSearchSelect2 from "../form/GenosSearchSelect2";

interface GenosSearchSelectEmployee {
  value: string | null;
  onChange: (value: string | null, label: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function GenosSearchSelectEmployee({
  value,
  onChange,
  placeholder = "Pilih Karyawan...",
  label = "Karyawan",
  className = "mb-3",
}: GenosSearchSelectEmployee) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSWR(
    ["employee", debouncedSearch],
    async () => {
      const res = await fetchEmployees(debouncedSearch, 1, 2000);
      const employees = res.data ?? [];
      return employees.map((o: any) => ({
        value: o.id,
        label: o.name ?? "-",
      }));
    }
  );

  return (
    <GenosSearchSelect2
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
