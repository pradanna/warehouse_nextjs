// components/excelGenerator.ts
import * as XLSX from "xlsx";

export const generateCashflowExcel = (
  rows: any[],
  filename: string = "cashflow.xlsx"
) => {
  const wb = XLSX.utils.book_new();

  // --- Header sesuai TABLE_HEAD
  const headers = ["DATE", "Item", "DEBET", "KREDIT", "DETAIL", "BALANCE"];

  // --- Mapping rows ke array of array
  const body = rows.map((row) => [
    row.date,
    row.item,
    row.debit,
    row.credit,
    row.description,
    row.balance,
  ]);

  // --- Buat sheet
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...body]);

  // --- Tambah ke workbook
  XLSX.utils.book_append_sheet(wb, sheet, "Cashflow");

  // --- Save file
  XLSX.writeFile(wb, filename);
};
