import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getPurchases(
  currentPage: number,
  limit: number,
  search: string,
  selectedSupplier: any
) {
  try {
    const res = await axios.get(`${baseUrl}/purchase`, {
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

export async function createPurchases(payload: any) {
  try {
    const response = await axios.post(`${baseUrl}/purchase`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function createPurchasePayment(payload: any) {
  try {
    const response = await axios.post(`${baseUrl}/purchase-payment`, payload, {
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

export async function updatePurchases() {}

export async function deletePurchases() {}

export async function getPurchasesById(id: any) {
  try {
    const response = await axios.get(`${baseUrl}/purchase/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
