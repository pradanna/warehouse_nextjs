// components/excelGenerator.ts
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export const generateCurrentStockExcel = (
  data: any[],
  filters: {
    sku?: string;
    itemName?: string;
    unitName?: string;
    dangerOnly?: boolean;
  }
) => {
  // 🔹 Susun filter text
  const appliedFilters: string[] = [];
  if (filters.sku) appliedFilters.push(`SKU = ${filters.sku}`);
  if (filters.itemName) appliedFilters.push(`Item = ${filters.itemName}`);
  if (filters.unitName) appliedFilters.push(`Unit = ${filters.unitName}`);
  if (filters.dangerOnly) appliedFilters.push("Hanya stok mau habis");

  const filterRow =
    appliedFilters.length > 0
      ? [`Filter: ${appliedFilters.join(", ")}`]
      : ["Filter: Tidak ada filter"];

  // 🔹 Susun data worksheet
  const worksheetData = [
    filterRow, // baris keterangan filter
    [], // baris kosong biar rapi
    ["Nama Item", "SKU", "Stok Saat Ini", "Unit", "Status"], // header
    ...data.map((item: any) => {
      const stock = item.current_stock;
      const min = item.min_stock;
      const max = item.max_stock;

      let status = "Stok Normal";
      if (stock < min) {
        status = "Stok Kurang";
      } else if (stock > max) {
        status = "Stok Berlebih";
      }

      return [
        item.item?.name || "-",
        item.sku || "-",
        stock,
        item.unit?.name || "-",
        status,
      ];
    }),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Stok");

  // Tambahkan tanggal ke nama file
  const today = new Date();
  const dateStr = dayjs(today).format("YYYY-MM-DD");
  const filename = `Laporan-Stok-${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
};
