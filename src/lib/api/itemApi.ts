import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function getItems(search: string, page: number, limit: number) {
  try {
    const res = await axiosInstance.get(
      `${baseUrl}/item?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Gagal fetch items:", err);
  }
}

export async function createItem(
  addCategoryId: string | number,
  addName: string,
  addDescription: string
) {
  try {
    const res = await axiosInstance.post(
      `${baseUrl}/item`,
      {
        category_id: addCategoryId,
        name: addName,
        description: addDescription,
      },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Gagal menambahkan item";
    console.error("Gagal menambahkan item:", message);
  }
}

export async function updateItem(
  editId: string | number,
  editCategoryId: string | number,
  editName: string,
  editDescription: string
) {
  try {
    const res = await axiosInstance.put(
      `${baseUrl}/item/${editId}`,
      {
        category_id: editCategoryId,
        name: editName,
        description: editDescription,
      },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Gagal mengubah item";
    console.error("Gagal mengubah item:", message);
  }
}

export async function deleteItem(id: string | number) {
  try {
    await axiosInstance.delete(`${baseUrl}/item/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch (err) {
    console.error("Gagal hapus item:", err);
  }
}

export async function getItemById(id: string | number) {
  try {
    const res = await axiosInstance.get(`${baseUrl}/item/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = res.data.data;

    return res.data;
  } catch (err) {
    console.error("Gagal fetch data item:", err);
  }
}
