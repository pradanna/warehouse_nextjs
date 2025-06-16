import * as XLSX from "xlsx";

export const generatePurchaseListExcel = (data: any[]) => {
  const formattedData = data.map((item: any) => ({
    "Ref#": item.reference_number || "-",
    Tanggal: item.date || "-",
    Supplier: item.supplier_name || "-",
    Subtotal: item.sub_total || 0,
    Diskon: item.discount || 0,
    Pajak: item.tax || 0,
    Total: item.total || 0,
    Deskripsi: item.description || "-",
    "Tipe Bayar": item.payment_type || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Pembelian");

  XLSX.writeFile(workbook, "Laporan-Pembelian.xlsx");
};
