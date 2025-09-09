// components/excelGenerator.ts
import * as XLSX from "xlsx";

export const generateGeneralLedgerExcel = (
  rows: any[],
  filename: string = "generalLedger.xlsx",
  outletName: string = "Unknown Outlet"
) => {
  const wb = XLSX.utils.book_new();

  // --- Judul di atas tabel
  const title = [`General Ledger - ${outletName}`];

  // --- Header sesuai TABLE_HEAD
  const headers = ["DATE", "Cash", "Digital", "Total", "Purchase"];

  // --- Mapping rows ke array of array
  const body = rows.map((row) => [
    row.date,
    row.cash,
    row.digital, // perbaiki typo dogital -> digital
    row.total,
    row.purchase,
  ]);

  // --- Gabungkan semuanya: Title -> Empty row -> Header -> Body
  const sheetData = [title, [], headers, ...body];

  // --- Buat sheet
  const sheet = XLSX.utils.aoa_to_sheet(sheetData);

  // --- Tambah ke workbook
  XLSX.utils.book_append_sheet(wb, sheet, "GeneralLedger");

  // --- Save file
  XLSX.writeFile(wb, filename);
};
