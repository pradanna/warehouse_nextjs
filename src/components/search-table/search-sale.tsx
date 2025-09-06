"use client";

import React, { useEffect, useMemo, useState } from "react";
import GenosModal from "../modal/GenosModal";
import GenosTable from "../table/GenosTable";
import GenosButton from "../button/GenosButton";
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Sale, SaleResponse } from "@/lib/api/sales/interfaceSales";
import { getSalesByOutlet } from "@/lib/api/sales/SalesApi";
import GenosDatepicker from "../form/GenosDatepicker";
import { formatRupiah } from "@/lib/helper";
import dayjs from "dayjs";

interface SalesPickerProps {
  outlet_id: string;
  value?: Sale | null; // controlled
  placeholder?: string;
  onSelect?: (sales: Sale) => void;
}

export default function SalesPicker({
  value,
  onSelect,
  placeholder,
  outlet_id,
}: SalesPickerProps) {
  const [open, setOpen] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [salesData, setSalesData] = useState<SaleResponse>();
  const [internalValue, setInternalValue] = useState<Sale | null>(null);

  const TABLE_HEAD = [
    { key: "date", label: "date", sortable: true },
    { key: "reference_number", label: "Nomor Nota", sortable: true },
    { key: "description", label: "keterangan", sortable: true },
    { key: "total", label: "Total", sortable: true },
  ];

  // TABLE ROWS
  const TABLE_ROWS = useMemo(() => {
    return (salesData?.data ?? []).map((sales) => ({
      id: sales.id,
      date: sales.date,
      reference_number: sales.reference_number,
      description: sales.description,
      total: formatRupiah(sales.total),
    }));
  }, [salesData]);

  // FILTER
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [dateFrom, setDateFrom] = useState<Date | null>(todayStart);
  const [dateTo, setDateTo] = useState<Date | null>(todayEnd);

  const fetchSalesByOutlet = async () => {
    setIsLoadingTable(true);
    try {
      const data = await getSalesByOutlet({
        outlet_id: outlet_id,
        page: 1,
        limit: 10,
        date_start: dayjs(dateFrom).format("YYYY-MM-DD"),
        date_end: dayjs(dateTo).format("YYYY-MM-DD"),
      });
      setSalesData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchSalesByOutlet();
  }, [dateFrom, dateTo]);

  const selected = value ?? internalValue;

  const handleSelect = (sales: Sale) => {
    setInternalValue(sales);
    onSelect?.(sales);
    setOpen(false);

    console.log(sales);
  };

  return (
    <>
      <div className="">
        <label className="block text-sm font-medium text-gray-700">
          Kode Pembelian
        </label>
        <div className="flex w-full items-center gap-3">
          <div className="flex-1 border border-gray-300 text-gray-500 p-2 rounded-md bg-gray-50">
            {selected
              ? `${selected.reference_number} (${selected.date}), Total (${selected.total})`
              : placeholder ?? "Cari referensi ->"}
          </div>
          <GenosButton
            color="secondary"
            label=""
            round="sm"
            size="lg"
            className="py-3"
            onClick={() => setOpen(true)}
            iconLeft={<MagnifyingGlassIcon className="w-5 h-5" />}
          ></GenosButton>
        </div>
        <GenosModal
          show={open}
          onClose={() => setOpen(false)}
          title="Pilih Data Penjualan"
          size="xl"
        >
          <GenosTable
            totalRows={salesData?.data?.length ?? 0}
            TABLE_HEAD={TABLE_HEAD}
            loading={isLoadingTable}
            TABLE_ROWS={TABLE_ROWS}
            ACTION_BUTTON={{
              pilih: (row) => handleSelect(row),
            }}
            FILTER={
              <div className="flex gap-4 mb-4">
                <GenosDatepicker
                  id="tanggal-dari"
                  label="Dari Tanggal"
                  selected={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                />

                <GenosDatepicker
                  id="tanggal-sampai"
                  label="Sampai Tanggal"
                  selected={dateTo}
                  onChange={(date) => setDateTo(date)}
                />
              </div>
            }
          />
        </GenosModal>
      </div>
    </>
  );
}
