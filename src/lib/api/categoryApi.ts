import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getCategories(
  page: number,
  limit: number,
  search: string
) {
  try {
    const response = await axios.get(
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
    const response = await axios.post(
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
    const message = err.response?.data?.message || "Gagal menambahkan kategori";
    console.log(message);
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
    const response = await axios.put(
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
    const message = err.response?.data?.message || "Gagal mengubah kategori";
    console.error("Gagal merubah category:", err);
  }
}
export async function deleteCategory(id: string) {
  try {
    const response = await axios.delete(`${baseUrl}/category/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal menghapus kategori:", err);
  }
}
