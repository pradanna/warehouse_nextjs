export const formatTanggalIndo = (tanggal: string): string => {
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dateObj = new Date(tanggal);
  const tanggalNum = dateObj.getDate();
  const bulan = bulanIndo[dateObj.getMonth()];
  const tahun = dateObj.getFullYear();

  return `${tanggalNum} ${bulan} ${tahun}`;
};
