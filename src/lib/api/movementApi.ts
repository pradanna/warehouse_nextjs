import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getMovements(currentPage: number, limit: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/inventory-movement?page=${currentPage}&per_page=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data inventory:", err);
  }
}

export async function getMovementById(id: string | number) {
  try {
    const res = await axios.get(`${baseUrl}/purchase-payment/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data inventory:", err);
  }
}
