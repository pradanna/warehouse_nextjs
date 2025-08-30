import {
  baseUrl,
  getRefreshToken,
  getToken,
  setToken,
} from "@/app/config/config";
import axios from "axios";
import { refreshToken } from "../auth";
import axiosInstance from "../axiosInstance";
import { parseError } from "@/lib/helper";
import { toast } from "react-toastify";

export interface InventoryResponse {
  status: number;
  message: string;
  data: Inventory[];
  meta: Meta;
}

export interface Inventory {
  id: string;
  name: string;
  unit: string;
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

export interface ModifiedBy {
  id: string;
  username: string;
}

export interface Meta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export async function getInventory(
  param: string,
  currentPage: number,
  limit: number
) {
  try {
    const response = await axios.get<InventoryResponse>(
      `${baseUrl}/inventory?param=${param}&page=${currentPage}&per_page=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newToken);

        // Coba ulangi permintaan dengan token baru
        const retry = await axios.get(
          `${baseUrl}/inventory?param=${param}&page=${currentPage}&per_page=${limit}`,
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );

        return retry.data;
      } catch (refreshErr) {
        console.error("Refresh token gagal:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.error("Gagal mengambil data inventory:", err);
      throw err;
    }
  }
}

export async function createInventory(
  addItemId: string | number,
  addUnitId: string | number,
  addSku: string,
  addDescription: string,
  addMinStock: number,
  addMaxStock: number,
  outletPrices: any
) {
  const payload = {
    item_id: addItemId,
    unit_id: addUnitId,
    sku: addSku,
    description: addDescription,
    min_stock: addMinStock,
    max_stock: addMaxStock,
    prices: Object.entries(outletPrices)
      .filter(
        ([_, price]) =>
          price !== null && price !== undefined && price !== undefined
      )
      .map(([outletId, price]) => ({
        outlet_id: outletId,
        price: Number(price),
      })),
  };

  try {
    const response = await axios.post(`${baseUrl}/inventory`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newToken);

        // Ulangi request dengan token baru
        const retry = await axios.post(`${baseUrl}/inventory`, payload, {
          headers: { Authorization: `Bearer ${newToken}` },
        });

        return retry.data;
      } catch (refreshErr) {
        console.error("Refresh token gagal:", refreshErr);
        throw refreshErr;
      }
    } else {
      const friendlyMessage = parseError(err, "SKU ");
      toast.error(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  }
}

export async function updateInventory(
  editId: string,
  editItemId: string | number,
  editUnitId: string | number,
  editSku: string,
  editDescription: string | "",
  editCurrentStock: number,
  editMinStock: number,
  editMaxStock: number,
  pricesArray: any
) {
  console.log("PRICE ARRAY ", pricesArray);
  const payload = {
    item_id: editItemId,
    unit_id: editUnitId,
    sku: editSku,
    description: editDescription,
    current_stock: editCurrentStock,
    min_stock: editMinStock,
    max_stock: editMaxStock,
    prices: pricesArray,
  };

  try {
    const response = await axios.put(
      `${baseUrl}/inventory/${editId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newToken);

        // Ulangi request dengan token baru
        const retry = await axios.put(
          `${baseUrl}/inventory/${editId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );

        return retry;
      } catch (refreshErr) {
        console.error("Refresh token gagal:", refreshErr);
        throw refreshErr;
      }
    } else {
      const friendlyMessage = parseError(err, "SKU ");
      toast.error(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  }
}

export async function deleteInventory(id: string | number) {
  try {
    const response = await axios.delete(`${baseUrl}/inventory/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newToken);

        // Ulangi request dengan token baru
        const retry = await axios.delete(`${baseUrl}/inventory/${id}`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        return retry.data;
      } catch (refreshErr) {
        console.error("Refresh token gagal:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.log("Gagal menghapus inventory:", err);
      throw err;
    }
  }
}

export async function getInventoryById(id: string | number) {
  try {
    const res = await axios.get(`${baseUrl}/inventory/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

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
        const retryRes = await axios.get(`${baseUrl}/inventory/${id}`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });

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
