import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type MovementFilters = {
  type?: string;
  movement_type?: string;
  item_name?: string;
  date_from?: Date | null;
  date_to?: Date | null;
};

export const generateMovementPDF = (data: any[], filters?: MovementFilters) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Logo dan header
  doc.addImage("/images/local/logojodi.png", "PNG", 10, 10, 18, 18);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(" JODI", 32, 16);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("WAREHOUSE", 32, 22);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Jl. Bido 1 No. 16B, Gumunggung, Gilingan,\nBanjarsari, Surakarta, 57134",
    pageWidth - 10,
    14,
    { align: "right" }
  );
  doc.text("Email: Kopiseduhanjodi@gmail.com", pageWidth - 10, 24, {
    align: "right",
  });

  doc.setDrawColor(180);
  doc.setLineWidth(0.2);
  doc.line(10, 30, pageWidth - 10, 30);

  // Judul dan tanggal cetak
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Movement (Card Stock)", 12, 38);

  const today = new Date();
  const printDate = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal Cetak: ${printDate}`, 12, 43);

  // 🔍 Tampilkan Filter yang dipakai
  const filterSummary: string[] = [];

  if (filters?.type) filterSummary.push(`Type: ${filters.type}`);
  if (filters?.movement_type)
    filterSummary.push(`Movement: ${filters.movement_type}`);
  if (filters?.item_name) filterSummary.push(`Item: ${filters.item_name}`);
  if (filters?.date_from || filters?.date_to) {
    const from = filters.date_from
      ? filters.date_from.toLocaleDateString("id-ID")
      : "-";
    const to = filters.date_to
      ? filters.date_to.toLocaleDateString("id-ID")
      : "-";
    filterSummary.push(`Periode: ${from} s/d ${to}`);
  }

  if (filterSummary.length > 0) {
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);
    doc.text("Filter: " + filterSummary.join(" | "), 12, 49);
    doc.setTextColor(0);
  }

  // 🔽 Urutkan data DESC by created_at
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Tabel movement
  autoTable(doc, {
    startY: filterSummary.length > 0 ? 55 : 50,
    theme: "grid",
    head: [
      [
        "Type",
        "Movement Type",
        "Nama Item",
        "Qty Open",
        "Qty",
        "Qty Close",
        "Author",
        "Tanggal",
      ],
    ],
    body: sortedData.map((item: any) => [
      item.type || "-",
      item.movement_type || "-",
      item.item?.name || "-",
      item.quantity_open ?? 0,
      item.quantity ?? 0,
      item.quantity_close ?? 0,
      item.author?.username || "-",
      new Date(item.created_at).toLocaleDateString("id-ID"),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [245, 245, 245], textColor: 20 },
  });

  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");
};
