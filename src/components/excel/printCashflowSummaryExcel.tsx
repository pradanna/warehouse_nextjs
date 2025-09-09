// components/excel/printCashflowExcel.ts
import * as XLSX from "xlsx";

export const generateCashflowSummaryExcel = (
  debitRows: any[],
  materialRows: any[],
  otherRows: any[],
  summary: { income: number; expenses: number; revenue: number },
  fileName: string,
  outletName: string = "Unknown Outlet"
) => {
  const wb = XLSX.utils.book_new();

  // --- Judul di atas tabel
  const title = [`General Ledger - ${outletName}`];

  const sheetData: any[][] = [];

  // --- Judul
  sheetData.push(["Cashflow Summary- " + outletName]);
  sheetData.push([]);

  // --- Pendapatan (Debit)
  sheetData.push(["Pendapatan"]);
  sheetData.push(["No", "Keterangan", "Nilai (Rp)"]);
  debitRows.forEach((row) => {
    sheetData.push([row.no, row.title, row.value]);
  });
  sheetData.push([]);

  // --- Pengeluaran Bahan Baku
  sheetData.push(["Pengeluaran Bahan Baku"]);
  sheetData.push(["No", "Keterangan", "Belanja Bahan Baku (Rp)"]);
  materialRows.forEach((row) => {
    sheetData.push([row.no, row.title, row.bahanbaku]);
  });
  sheetData.push([]);

  // --- Pengeluaran Outlet
  sheetData.push(["Pengeluaran Outlet"]);
  sheetData.push(["No", "Keterangan", "Pengeluaran (Rp)"]);
  otherRows.forEach((row) => {
    sheetData.push([row.no, row.title, row.pengeluaran]);
  });
  sheetData.push([]);

  // --- Ringkasan
  sheetData.push(["Ringkasan"]);
  sheetData.push(["Total Pendapatan", summary.income]);
  sheetData.push(["Total Pengeluaran", summary.expenses]);
  sheetData.push(["Total Bersih", summary.revenue]);

  // Buat sheet dari array data
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Cashflow");

  // Simpan file
  XLSX.writeFile(wb, fileName);
};
