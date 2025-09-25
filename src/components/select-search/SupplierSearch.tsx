// components/select-search/SupplierSearch.tsx
"use client";

import { useDebounce } from "@/lib/utils/useDebounce";
import React, { useState, useMemo } from "react";
import GenosSearchSelect from "../form/GenosSearchSelect";
import useSWR from "swr";
import { getSupplier } from "@/lib/api/supplierApi";

type SupplierOption = {
  id: string;
  name: string;
};

type GenosSearchSelectSupplierProps = {
  // value tetap id (string) atau null
  value: string | null;
  // onChange mengembalikan object {id, name} atau null
  onChange: (value: SupplierOption | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export default function GenosSearchSelectSupplier({
  value,
  onChange,
  placeholder = "Pilih Supplier...",
  label = "Supplier",
  className = "",
}: GenosSearchSelectSupplierProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // fetch options (mapped ke shape { value, label } yg biasa dipakai GenosSearchSelect)
  const { data: options = [], isLoading } = useSWR(
    ["supplier", debouncedSearch],
    async () => {
      const res = await getSupplier(debouncedSearch, 1, 2000);
      // map ke format options yang GenosSearchSelect harapkan
      return (res.data || []).map((o: any) => ({
        value: o.id,
        label: o.name,
      }));
    }
  );

  // ketika GenosSearchSelect memanggil onChange (mengirim id atau null),
  // kita ubah jadi object {id, name} lalu kirim ke parent.
  const handleChange = (val: any) => {
    if (val === null || val === undefined || val === "") {
      onChange(null);
      return;
    }
    const id = String(val);
    const found = (options || []).find((opt: any) => String(opt.value) === id);
    if (found) {
      onChange({ id, name: found.label });
    } else {
      // jika belum ada label di options (mis. opsi belum dimuat), tetap kembalikan id
      onChange({ id, name: "" });
    }
  };

  // Jika Anda mau meng-enable searching dari wrapper, GenosSearchSelect harus bisa
  // memanggil setSearch. Bila GenosSearchSelect tidak expose callback search,
  // Anda bisa menambahkan textbox kecil di wrapper untuk mengubah `search`.
  // Namun kode ini mengikuti pattern yang sudah Anda pakai sebelumnya.

  return (
    <div>
      {/* Optional: tambahkan input pencarian kecil yang mengubah search (supaya debounce bekerja) */}
      {/* Jika GenosSearchSelect internal sudah handle search, Anda boleh hilangkan input ini */}
      <div style={{ display: "none" }}>
        {/* menjaga variable search agar tidak "unused" (opsional) */}
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <GenosSearchSelect
        label={label}
        value={value ?? ""} // GenosSearchSelect mengharapkan string/number
        onChange={handleChange} // handleChange menerima id dan menerjemahkannya ke {id,name}
        placeholder={placeholder}
        options={options}
        isLoading={isLoading}
        className={className}
      />
    </div>
  );
}
