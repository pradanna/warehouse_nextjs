// components/excelGenerator.ts
import * as XLSX from "xlsx";

export const generateSalesListExcel = (data: any[]) => {
  const wsData = [];

  // Header
  wsData.push([
    "Ref#",
    "Tanggal",
    "Outlet",
    "Subtotal",
    "Diskon",
    "Pajak",
    "Total",
    "Deskripsi",
    "Tipe Bayar",
  ]);

  // Body
  data.forEach((item) => {
    wsData.push([
      item.reference_number || "-",
      item.date || "-",
      item.outlet_name || "-",
      item.sub_total || 0,
      item.discount || 0,
      item.tax || 0,
      item.total || 0,
      item.description || "-",
      item.payment_type || "-",
    ]);
  });

  // Total Row
  const totalSubtotal = data.reduce(
    (sum, item) => sum + (item.sub_total || 0),
    0
  );
  const totalDiscount = data.reduce(
    (sum, item) => sum + (item.discount || 0),
    0
  );
  const totalTax = data.reduce((sum, item) => sum + (item.tax || 0), 0);
  const totalTotal = data.reduce((sum, item) => sum + (item.total || 0), 0);

  wsData.push([
    "TOTAL",
    "", // tanggal
    "", // outlet
    totalSubtotal,
    totalDiscount,
    totalTax,
    totalTotal,
    "",
    "",
  ]);

  // Worksheet & Workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "SalesReport");

  // Export file
  XLSX.writeFile(wb, `Laporan-Penjualan.xlsx`);
};
