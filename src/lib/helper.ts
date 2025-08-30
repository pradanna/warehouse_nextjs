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

export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export function addOneDay(date: Date | null): Date | null {
  if (!date) return null;
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
}

export function formatDateToDateIndo(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

// ERROR HELPER
export function parseError(err: any, unique: string): string {
  if (err?.response?.data?.message) {
    const message: string = err.response.data.message;

    // Duplicate entry MySQL
    if (message.includes("Duplicate entry")) {
      return `${unique} sudah digunakan, data tidak boleh sama.`;
    }

    return message;
  }

  if (err?.message) return err.message;

  return "Terjadi kesalahan, silakan coba lagi.";
}
