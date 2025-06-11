// components/excelGenerator.ts
import * as XLSX from "xlsx";

export const generatePurchaseExcel = (data: any) => {
  const wb = XLSX.utils.book_new();

  // --- Sheet 1: Rincian Pembelian
  const purchaseDetails = [
    ["Nomor Referensi", data.data.reference_number],
    ["Tanggal Pembelian", data.data.date],
    ["Supplier", data.data.supplier.name],
    ["Jenis Pembayaran", data.data.payment_type],
    ["Status Pembayaran", statusText(data.data.payment_status)],
    ["Deskripsi", data.data.description],
  ];
  const sheet1 = XLSX.utils.aoa_to_sheet(purchaseDetails);
  XLSX.utils.book_append_sheet(wb, sheet1, "Rincian");

  // --- Sheet 2: Daftar Item
  const itemsHeader = ["Nama", "Qty", "Unit", "Harga", "Total"];
  const itemsBody = data.data.items.map((item: any) => [
    item.name,
    item.quantity,
    item.unit,
    item.price,
    item.total,
  ]);
  const sheet2 = XLSX.utils.aoa_to_sheet([itemsHeader, ...itemsBody]);
  XLSX.utils.book_append_sheet(wb, sheet2, "Item");

  // --- Sheet 3: Riwayat Pembayaran
  const paymentsHeader = ["Tanggal", "Jumlah", "Deskripsi", "Metode"];
  const paymentsBody = data.data.payments.map((p: any) => [
    p.date,
    p.amount,
    p.description,
    p.payment_type,
  ]);
  const sheet3 = XLSX.utils.aoa_to_sheet([paymentsHeader, ...paymentsBody]);
  XLSX.utils.book_append_sheet(wb, sheet3, "Pembayaran");

  // --- Sheet 4: Ringkasan Total
  const summary = [
    ["Sub Total", data.data.sub_total],
    ["Diskon", data.data.discount],
    ["Pajak", data.data.tax],
    ["Total", data.data.total],
  ];
  const sheet4 = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, sheet4, "Ringkasan");

  // ✅ Save langsung ke file
  XLSX.writeFile(wb, `purchase-${data.data.reference_number}.xlsx`);
};

const statusText = (status: string): string => {
  switch (status) {
    case "paid":
      return "LUNAS";
    case "partial":
      return "TERBAYAR SEBAGIAN";
    default:
      return "BELUM LUNAS";
  }
};
