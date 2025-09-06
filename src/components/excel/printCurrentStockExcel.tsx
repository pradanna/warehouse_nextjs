// components/excelGenerator.ts
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export const generateCurrentStockExcel = (data: any[]) => {
  const worksheetData = [
    ["Nama Item", "SKU", "Stok Saat Ini", "Unit", "Status"],
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
