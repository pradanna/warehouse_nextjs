// components/excelGenerator.ts
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export const generateExpensesWarehouseExcel = (
  data: any[],
  filters: {
    date_from?: Date;
    date_to?: Date;
  }
) => {
  // 🔹 Susun keterangan filter tanggal
  let filterText = "Periode: ";
  if (filters.date_from && filters.date_to) {
    const from = dayjs(filters.date_from).format("DD MMMM YYYY");
    const to = dayjs(filters.date_to).format("DD MMMM YYYY");
    filterText += `${from} - ${to}`;
  } else {
    filterText += "Tidak ada filter tanggal";
  }

  // 🔹 Header tabel
  const headerRow = [
    "Tanggal",
    "Kategori",
    "Jumlah (Rp)",
    "Keterangan",
    "Input By",
  ];

  // 🔹 Body data
  const bodyRows = data.map((item: any) => [
    dayjs(item.date).format("DD/MM/YYYY"),
    item.category?.name || "-",
    item.amount || 0, // pastikan numerik
    item.description || "-",
    item.author?.username || "-",
  ]);

  // 🔹 Hitung total jumlah (pastikan numerik)
  const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);

  // 🔹 Tambahkan baris total
  const totalRow = ["TOTAL", "", totalAmount, "", ""];

  // 🔹 Susun worksheet data
  const worksheetData = [
    [filterText],
    [],
    headerRow,
    ...bodyRows,
    [],
    totalRow,
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // 🔹 Format kolom jumlah jadi angka dengan pemisah ribuan
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
  for (let R = 2; R <= range.e.r; ++R) {
    const cellRef = XLSX.utils.encode_cell({ r: R, c: 2 }); // kolom "Jumlah (Rp)"
    const cell = worksheet[cellRef];
    if (cell && typeof cell.v === "number") {
      cell.z = "#,##0"; // format angka ribuan
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Pengeluaran");

  // 🔹 Nama file
  const dateStr = dayjs().format("YYYY-MM-DD");
  const filename = `Laporan-Pengeluaran-${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
};
