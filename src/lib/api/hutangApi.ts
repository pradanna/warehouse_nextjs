import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getDebt(
  currentPage: number,
  limit: number,
  supplier_id: string,
  status: any
) {
  try {
    const res = await axios.get(`${baseUrl}/debt`, {
      params: {
        page: currentPage,
        per_page: limit,
        supplier_id: supplier_id,
        status: status,
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

export async function createDebt(payload: any) {
  try {
    const response = await axios.post(`${baseUrl}/debt`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateDebt() {}

export async function deleteDebt() {}

export async function getDebtById(id: any) {
  try {
    const response = await axios.get(`${baseUrl}/debt/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
