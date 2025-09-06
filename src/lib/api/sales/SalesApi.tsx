import { baseUrl } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { SaleResponse } from "./interfaceSales";
import { getToken } from "../tokenHelper";
import { SaleByIdResponse } from "./interfaceSalesbyId";

export async function getSalesByOutlet({
  outlet_id,
  date_start,
  date_end,
  page = 1,
  limit = 10,
}: {
  outlet_id: string | null;
  date_start?: string | null;
  date_end?: string | null;
  page?: number;
  limit?: number;
}) {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (outlet_id) params.append("outlet_id", outlet_id);
    if (date_start) params.append("date_start", date_start);
    if (date_end) params.append("date_end", date_end);
    params.append("page", String(page));
    params.append("per_page", String(limit));

    const response = await axiosInstance.get<SaleResponse>(
      `${baseUrl}/sale?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Search Sales Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data  Sales:", err);
    throw err;
  }
}

export async function getSalesById(id: any) {
  try {
    const response = await axiosInstance.get<SaleByIdResponse>(
      `${baseUrl}/sale/${id}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
