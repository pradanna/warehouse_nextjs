// components/excelMovementGenerator.ts
import dayjs from "dayjs";
import * as XLSX from "xlsx";

type MovementFilters = {
  type?: string;
  movement_type?: string;
  item_name?: string;
  date_from?: Date | null;
  date_to?: Date | null;
};

export const generateMovementExcel = (
  data: any[],
  filters?: MovementFilters
) => {
  const worksheetData: (string | number)[][] = [];

  // 🔍 Tambahkan filter summary di atas (jika ada)
  const filterSummary: string[] = [];
  if (filters?.type) filterSummary.push(`Type: ${filters.type}`);
  if (filters?.movement_type)
    filterSummary.push(`Movement: ${filters.movement_type}`);
  if (filters?.item_name) filterSummary.push(`Item: ${filters.item_name}`);
  if (filters?.date_from || filters?.date_to) {
    const from = filters.date_from
      ? dayjs(filters.date_from).format("DD/MM/YYYY")
      : "-";
    const to = filters.date_to
      ? dayjs(filters.date_to).format("DD/MM/YYYY")
      : "-";
    filterSummary.push(`Periode: ${from} s/d ${to}`);
  }

  if (filterSummary.length > 0) {
    worksheetData.push(["Filter:", filterSummary.join(" | ")]);
    worksheetData.push([]); // baris kosong sebelum tabel
  }

  // Header tabel
  worksheetData.push([
    "Type",
    "Movement Type",
    "Nama Item",
    "Qty Open",
    "Qty",
    "Qty Close",
    "Author",
    "Tanggal",
  ]);

  // 🔽 Urutkan data DESC by created_at
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Isi tabel
  sortedData.forEach((item: any) => {
    worksheetData.push([
      item.type || "-",
      item.movement_type || "-",
      item.item?.name || "-",
      item.quantity_open ?? 0,
      item.quantity ?? 0,
      item.quantity_close ?? 0,
      item.author?.username || "-",
      dayjs(item.created_at).format("DD/MM/YYYY"),
    ]);
  });

  // Buat worksheet & workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Movement");

  // Tambahkan tanggal ke nama file
  const today = new Date();
  const dateStr = dayjs(today).format("YYYY-MM-DD");
  const filename = `Laporan-Movement-${dateStr}.xlsx`;

  XLSX.writeFile(workbook, filename);
};
