import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateCurrentStockPDF = (
  data: any[],
  filters: {
    sku?: string;
    itemName?: string;
    unitName?: string;
    dangerOnly?: boolean;
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
  doc.text("Laporan Stok Saat Ini", 12, 38);

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
  let filterText = "Filter: ";
  const appliedFilters: string[] = [];

  if (filters.sku) appliedFilters.push(`SKU = ${filters.sku}`);
  if (filters.itemName) appliedFilters.push(`Item = ${filters.itemName}`);
  if (filters.unitName) appliedFilters.push(`Unit = ${filters.unitName}`);
  if (filters.dangerOnly) appliedFilters.push("Hanya stok mau habis");

  filterText +=
    appliedFilters.length > 0 ? appliedFilters.join(", ") : "Tidak ada filter";

  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text(filterText, 12, 48);

  // Tabel stok
  autoTable(doc, {
    startY: 55, // geser ke bawah supaya tidak tabrakan dengan filter
    theme: "grid",
    head: [["Nama Item", "SKU", "Unit", "Stok Saat Ini", "Status"]],
    body: data.map((item: any) => {
      const stock = item.current_stock;
      const min = item.min_stock;
      const max = item.max_stock;

      let status = "Stok Normal";
      let color: [number, number, number] = [0, 0, 0]; // hitam

      if (stock < min) {
        status = "Stok Kurang";
        color = [220, 53, 69]; // merah
      } else if (stock > max) {
        status = "Stok Berlebih";
        color = [255, 165, 0]; // oranye
      }

      return [
        item.item.name,
        item.sku || "-",
        item.unit.name || "-",
        stock,
        {
          content: status,
          styles: {
            textColor: color,
            fontStyle: "bold",
          },
        },
      ];
    }),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [245, 245, 245], textColor: 20 },
  });

  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");
};
