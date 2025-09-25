import { formatDateToDateIndoFromDate } from "@/lib/helper";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SalesFilter = {
  search?: string;
  selectedOutlet?: string | null;
  paymentMetodeFilter?: string;
  statusFilter?: string;
  dateFromFilter?: Date | null;
  dateToFilter?: Date | null;
};

export const generateSalesListPDF = (data: any[], filter: SalesFilter) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // === HEADER
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

  // === JUDUL
  const printDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Penjualan", 12, 38);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Tanggal Cetak: ${printDate}`, 12, 43);

  // === FILTER INFO
  let filterY = 50;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Filter:", 12, filterY);

  doc.setFont("helvetica", "normal");
  filterY += 5;

  if (filter.search) {
    doc.text(`Ref#: ${filter.search}`, 12, filterY);
    filterY += 5;
  }
  if (filter.selectedOutlet) {
    doc.text(`Outlet: ${filter.selectedOutlet}`, 12, filterY);
    filterY += 5;
  }
  if (filter.paymentMetodeFilter) {
    doc.text(`Tipe Pembayaran: ${filter.paymentMetodeFilter}`, 12, filterY);
    filterY += 5;
  }
  if (filter.statusFilter) {
    doc.text(`Status Pembayaran: ${filter.statusFilter}`, 12, filterY);
    filterY += 5;
  }
  if (filter.dateFromFilter || filter.dateToFilter) {
    const from = filter.dateFromFilter
      ? formatDateToDateIndoFromDate(filter.dateFromFilter)
      : "-";
    const to = filter.dateToFilter
      ? formatDateToDateIndoFromDate(filter.dateToFilter)
      : "-";
    doc.text(`Periode: ${from} s/d ${to}`, 12, filterY);
    filterY += 5;
  }

  // === HITUNG TOTAL
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

  // === TABEL
  const tableBody = data.map((item: any) => [
    item.reference_number || "-",
    item.date || "-",
    item.outlet_name || "-",
    item.description || "-",
    item.payment_type || "-",
    `Rp ${item.sub_total.toLocaleString("id-ID")}`,
    `Rp ${item.discount.toLocaleString("id-ID")}`,
    `Rp ${item.tax.toLocaleString("id-ID")}`,
    `Rp ${item.total.toLocaleString("id-ID")}`,
  ]);

  // === ROW TOTAL di akhir tabel
  tableBody.push([
    {
      content: "TOTAL",
      colSpan: 5,
      styles: { halign: "right", fontStyle: "bold" },
    },
    {
      content: `Rp ${totalSubtotal.toLocaleString("id-ID")}`,
      styles: { fontStyle: "bold" },
    },
    {
      content: `Rp ${totalDiscount.toLocaleString("id-ID")}`,
      styles: { fontStyle: "bold" },
    },
    {
      content: `Rp ${totalTax.toLocaleString("id-ID")}`,
      styles: { fontStyle: "bold" },
    },
    {
      content: `Rp ${totalTotal.toLocaleString("id-ID")}`,
      styles: { fontStyle: "bold" },
    },
  ]);

  autoTable(doc, {
    startY: filterY + 5,
    theme: "grid",
    head: [
      [
        "Ref#",
        "Tanggal",
        "Outlet",
        "Deskripsi",
        "Tipe Bayar",
        "Subtotal",
        "Diskon",
        "Pajak",
        "Total",
      ],
    ],
    body: tableBody,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [245, 245, 245], textColor: 20 },
  });

  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");

  // doc.save("Laporan-Penjualan.pdf");
};
