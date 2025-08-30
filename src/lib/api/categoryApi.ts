import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { parseError } from "../helper";
import { toast } from "react-toastify";

export async function getCategories(
  search: string,
  page: number,
  limit: number
) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/category?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil kategori:", err);
  }
}

export async function createCategory(addName: string, addDescription: string) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/category",
      {
        name: addName,
        description: addDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    const friendlyMessage = parseError(err, "Nama kategori");
    toast.error(friendlyMessage);
    throw new Error(friendlyMessage);
  }
}
export async function findCategoryById(id: string) {
  try {
    const response = await axios.get(`${baseUrl}/category/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data kategori:", err);
  }
}

export async function editCategory(
  editId: string,
  editName: string,
  editDescription: string
) {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/category/${editId}`,
      {
        name: editName,
        description: editDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    const friendlyMessage = parseError(err, "Nama kategori");
    toast.error(friendlyMessage);
    throw new Error(friendlyMessage);
  }
}
export async function deleteCategory(id: string) {
  try {
    const response = await axiosInstance.delete(`${baseUrl}/category/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal menghapus kategori:", err);
  }
}
