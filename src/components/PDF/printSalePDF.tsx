// components/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateSalePDF = (data: any) => {
  const doc = new jsPDF();

  // Header
  const pageWidth = doc.internal.pageSize.getWidth();

  // Logo
  doc.addImage("/images/local/logojodi.png", "PNG", 10, 10, 18, 18);

  // Judul di samping logo
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(" JODI", 32, 16); // posisi di kanan logo

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("WAREHOUSE", 32, 22);

  // Alamat dan email di kanan
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

  // Divider bawah
  doc.setDrawColor(180); // warna abu-abu terang
  doc.setLineWidth(0.2);
  doc.line(10, 30, pageWidth - 10, 30);

  // Informasi Utama
  const leftX = 12;
  const rightX = pageWidth - 12;

  let y = 40; // posisi Y awal
  const lineSpacing = 6; // jarak antar baris yang lebih kecil

  // Baris 1
  doc.text(`SHIP TO: `, leftX, y);
  doc.text(`Invoice No : : ${data.data.reference_number}`, rightX, y, {
    align: "right",
  });

  // doc.text(`Nomor Referensi: ${data.data.reference_number}`, leftX, y);
  // doc.text(`Outlet: ${data.data.outlet.name}`, rightX, y, {
  //   align: "right",
  // });

  y += lineSpacing;

  // Baris 2
  doc.setLineWidth(0.5); // ketebalan garis
  doc.line(leftX, y - 4, leftX + 100, y - 4);
  doc.text(`${data.data.outlet.name}`, leftX, y);
  doc.text(`Tanggal Penjualan: ${data.data.date}`, rightX, y, {
    align: "right",
  });

  y += lineSpacing;

  // Baris 3
  doc.text(`${data.data.outlet.address}`, leftX, y);
  let statusText = "";
  let statusColor: [number, number, number] = [0, 0, 0]; // default hitam

  switch (data.data.payment_status) {
    case "paid":
      statusText = "LUNAS";
      statusColor = [34, 139, 34]; // hijau
      break;
    case "partial":
      statusText = "TERBAYAR SEBAGIAN";
      statusColor = [255, 165, 0]; // oranye
      break;
    default:
      statusText = "BELUM LUNAS";
      statusColor = [220, 20, 60]; // merah
      break;
  }

  doc.setTextColor(...statusColor);
  doc.text(`Status Pembayaran: ${statusText}`, rightX, y, {
    align: "right",
  });
  doc.setTextColor(0); // reset ke hitam setelahnya (optional)
  // Daftar Item
  autoTable(doc, {
    startY: 60,
    theme: "grid",
    head: [["Nama", "Qty", "Unit", "Harga", "Total"]],
    body: data.data.items.map((item: any) => [
      item.name,
      item.quantity,
      item.unit,
      `Rp ${item.price.toLocaleString("id-ID")}`,
      `Rp ${item.total.toLocaleString("id-ID")}`,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [245, 245, 245], textColor: 20 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 90;

  // --- Riwayat Pembayaran (KIRI)
  doc.text("Riwayat Pembayaran", leftX, finalY + 10);
  autoTable(doc, {
    startY: finalY + 15,
    theme: "grid",
    margin: { left: 12 },
    tableWidth: 90, // batasi lebar agar tidak menabrak kolom ringkasan
    head: [["Tanggal", "Jumlah", "Deskripsi", "Metode"]],
    body: data.data.payments.map((payment: any) => [
      payment.date,
      `Rp ${payment.amount.toLocaleString("id-ID")}`,
      payment.description,
      payment.payment_type,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [235, 235, 235], textColor: 0 },
  });

  // --- Ringkasan Total (KANAN)
  const rightX2 = 110;
  const boxWidth = 85;
  const baseY = finalY + 10;

  doc.setFontSize(10);
  doc.setDrawColor(180); // warna garis
  doc.setTextColor(0);

  // Garis kotak besar tanpa fill

  doc.text("Sub Total", rightX2 + 2, baseY + 6);
  doc.text(
    `Rp ${data.data.sub_total.toLocaleString("id-ID")}`,
    rightX2 + boxWidth - 2,
    baseY + 7,
    { align: "right" }
  );

  doc.text("Diskon", rightX2 + 2, baseY + 12);
  doc.text(
    `Rp ${data.data.discount.toLocaleString("id-ID")}`,
    rightX2 + boxWidth - 2,
    baseY + 14,
    { align: "right" }
  );

  doc.text("Pajak", rightX2 + 2, baseY + 18);
  doc.text(
    `Rp ${data.data.tax.toLocaleString("id-ID")}`,
    rightX2 + boxWidth - 2,
    baseY + 21,
    { align: "right" }
  );

  // Total
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Total", rightX2 + 2, baseY + 28);
  doc.text(
    `Rp ${data.data.total.toLocaleString("id-ID")}`,
    rightX2 + boxWidth - 2,
    baseY + 30,
    { align: "right" }
  );

  const blobUrl = doc.output("bloburl");
  window.open(blobUrl, "_blank");

  //   doc.save(`Penjualan-${data.reference_number}.pdf`);
};
