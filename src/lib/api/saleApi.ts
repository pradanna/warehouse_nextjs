import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getSales(
  currentPage: number,
  limit: number,
  search: string,
  selectedSupplier: any
) {
  try {
    const res = await axios.get(`${baseUrl}/sale`, {
      params: {
        page: currentPage,
        per_page: limit,
        search: search,
        supplier_id: selectedSupplier,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data inventory:", err);
  }
}

export async function createSales(payload: any) {
  try {
    const response = await axios.post(`${baseUrl}/sale`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function createSalePayment(payload: any) {
  try {
    const response = await axios.post(`${baseUrl}/sale-payment`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: error.response?.data || null,
    };
  }
}

export async function updateSales() {}

export async function deleteSales() {}

export async function getSalesById(id: any) {
  try {
    const response = await axios.get(`${baseUrl}/sale/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
