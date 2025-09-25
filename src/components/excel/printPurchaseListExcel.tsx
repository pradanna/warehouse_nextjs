import { formatDateToDateIndoFromDate } from "@/lib/helper";
import * as XLSX from "xlsx";

type TableRows = {
  startDate?: Date;
  endDate?: Date;
  supplierName?: string;
  paymentType?: string;
  paymentStatus?: string;
};

export const generatePurchaseListExcel = (
  data: any[],
  TABLE_ROWS: TableRows
) => {
  // === HEADER FILTER
  const filterRows: any[][] = [];

  filterRows.push(["FILTER LAPORAN PEMBELIAN"]);
  if (TABLE_ROWS.startDate || TABLE_ROWS.endDate) {
    filterRows.push([
      "Periode",
      `${
        TABLE_ROWS.startDate
          ? formatDateToDateIndoFromDate(TABLE_ROWS.startDate)
          : "-"
      } s/d ${
        TABLE_ROWS.endDate
          ? formatDateToDateIndoFromDate(TABLE_ROWS.endDate)
          : "-"
      }`,
    ]);
  }
  if (TABLE_ROWS.supplierName) {
    filterRows.push(["Supplier", TABLE_ROWS.supplierName]);
  }
  if (TABLE_ROWS.paymentType) {
    filterRows.push(["Tipe Bayar", TABLE_ROWS.paymentType]);
  }
  if (TABLE_ROWS.paymentStatus) {
    filterRows.push(["Status Pembayaran", TABLE_ROWS.paymentStatus]);
  }
  filterRows.push([]); // baris kosong

  // === DATA
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

  // Worksheet
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  // Tambah filter info
  XLSX.utils.sheet_add_aoa(worksheet, filterRows, { origin: "A1" });

  // Tambah data pembelian
  XLSX.utils.sheet_add_json(worksheet, formattedData, {
    origin: `A${filterRows.length + 1}`,
    skipHeader: false,
  });

  // Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daftar Pembelian");

  XLSX.writeFile(workbook, "Laporan-Pembelian.xlsx");
};
