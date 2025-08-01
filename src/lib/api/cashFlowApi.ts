import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "./axiosInstance";

export async function getCashflow({
  outlet_id,
  year,
  month,
}: {
  outlet_id: string | null;
  year?: string | null;
  month?: string | null;
}) {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (outlet_id) params.append("outlet_id", outlet_id);

    if (year) params.append("year", year);
    if (month) params.append("month", month);

    const response = await axiosInstance.get(
      `${baseUrl}/cash-flow?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get CashFlow Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data Cashflow:", err);
    throw err;
  }
}
