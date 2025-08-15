import { baseUrl, getRefreshToken, setToken } from "@/app/config/config";
import axios from "axios";
import { getToken } from "../tokenHelper";
import { refreshToken } from "../auth";

export interface InventoryResponse {
  status: number;
  message: string;
  data: InventoryData;
}

export interface InventoryData {
  id: string;
  name: string;
  item: Item;
  unit: Unit;
  sku: string;
  description: string | null;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  prices: Price[];
  modified_by: ModifiedBy;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Price {
  id: string;
  outlet: Outlet;
  price: number;
}

export interface Outlet {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
}

export interface Unit {
  id: string;
  name: string;
}

export interface ModifiedBy {
  id: string;
  username: string;
}

export async function fetchInventoryById(
  id: string | number
): Promise<InventoryResponse> {
  try {
    const res = await axios.get<InventoryResponse>(
      `${baseUrl}/inventory/${id}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token jika akses kadaluarsa
        const refreshRes = await refreshToken(getRefreshToken());
        const newToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newToken);

        // Coba ulangi request dengan token baru
        const retryRes = await axios.get<InventoryResponse>(
          `${baseUrl}/inventory/${id}`,
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );

        return retryRes.data;
      } catch (refreshErr) {
        console.error("Gagal refresh token saat getInventoryById:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.error("Gagal mengambil data inventory:", err);
      throw err;
    }
  }
}
