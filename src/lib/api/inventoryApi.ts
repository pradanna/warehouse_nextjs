import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getInventory(
  param: string,
  currentPage: number,
  limit: number
) {
  try {
    const response = await axios.get(
      `${baseUrl}/inventory?param=${param}&page=${currentPage}&per_page=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data inventory:", err);
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
  try {
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

    const response = await axios.post(`${baseUrl}/inventory`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal menambahkan inventory:", err);
  }
}

export async function updateInventory(
  editId: string,
  editItemId: string | number,
  editUnitId: string | number,
  editSku: string,
  editDescription: string,
  editCurrentStock: number,
  editMinStock: number,
  editMaxStock: number,
  pricesArray: any
) {
  try {
    const response = await axios.put(
      `${baseUrl}/inventory/${editId}`,
      {
        item_id: editItemId,
        unit_id: editUnitId,
        sku: editSku,
        description: editDescription,
        current_stock: editCurrentStock,
        min_stock: editMinStock,
        max_stock: editMaxStock,
        prices: pricesArray, // harga per outlet
      },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response;
  } catch (err) {
    console.error("Gagal mengubah inventory:", err);
  }
}

export async function deleteInventory(id: string | number) {
  try {
    const response = await axios.delete(`${baseUrl}/inventory/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (err) {
    console.log("Gagal menghapus inventory:", err);
  }
}

export async function getInventoryById(id: string | number) {
  try {
    const res = await axios.get(`${baseUrl}/inventory/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data inventory:", err);
  }
}
