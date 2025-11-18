import { formatRupiah } from "@/lib/helper";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateExpensesWarehousePDF = (
  data: any[],
  filters: {
    date_from?: Date;
    date_to?: Date;
  }
) => {
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

  // Judul dan tanggal cetak (di kiri)
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Pengeluaran Warehouse", 12, 38);

  const today = new Date();
  const printDate = today.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal Cetak: ${printDate}`, 12, 43);

  // 🔹 Tambahkan keterangan filter
  let filterText = "Periode: ";
  if (filters.date_from && filters.date_to) {
    const from = new Date(filters.date_from).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const to = new Date(filters.date_to).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    filterText += `${from} - ${to}`;
  } else {
    filterText += "Tidak ada filter tanggal";
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(filterText, 12, 48);

  // 🔹 Tabel data pengeluaran
  autoTable(doc, {
    startY: 55,
    theme: "grid",
    head: [["Tanggal", "Kategori", "Jumlah (Rp)", "Keterangan", "Input By"]],
    body: data.map((item: any) => {
      const formattedDate = new Date(item.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const formattedAmount = new Intl.NumberFormat("id-ID").format(
        item.amount || 0
      );

      return [
        formattedDate,
        item.category?.name || "-",
        formatRupiah(item.amount || 0),
        item.description || "-",
        item.author.username || "-",
      ];
    }),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [245, 245, 245], textColor: 20 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 30, halign: "right" },
      3: { cellWidth: 60 },
      4: { cellWidth: 25 },
    },
  });

  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");
};
