import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getSupplier(search: string, page: number, limit: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/supplier?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil supplier:", err);
  }
}

export async function createSupplier(
  addName: string,
  addAddress: string,
  addContact: string
) {
  try {
    const response = await axios.post(
      baseUrl + "/supplier",
      {
        name: addName,
        address: addAddress,
        contact: addContact,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Gagal menambahkan supplier";
    console.log(message);
  }
}

export async function updateSupplier(
  editId: string,
  editName: string,
  editAddress: string,
  editContact: string
) {
  try {
    const response = await axios.put(
      `${baseUrl}/supplier/${editId}`,
      {
        name: editName,
        address: editAddress,
        contact: editContact,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Gagal mengubah supplier";
    console.log(message);
  }
}

export async function deleteSupplier(id: string) {
  try {
    const response = await axios.delete(`${baseUrl}/supplier/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal menghapus supplier:", err);
  }
}

export async function getSupplierById(id: string) {
  try {
    const response = await axios.get(`${baseUrl}/supplier/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data supplier:", err);
  }
}
