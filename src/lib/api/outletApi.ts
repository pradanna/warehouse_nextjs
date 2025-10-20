import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function createOutlet(
  addName: string,
  addAddress: string,
  addContact: string
) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/outlet",
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
    const message = err.response?.data?.message || "Gagal menambahkan outlet";
    console.error(message);
    throw new Error(message);
  }
}

export async function getOutlet(search: string, page: number, limit: number) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/outlet?param=${search}&page=${page}&per_page=100000000`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "Gagal mendapatkan outlet";
    console.error(message);
    throw new Error(message);
  }
}

export async function deleteOutlet(outletId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/outlet/${outletId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal menghapus outlet:", err);
  }
}

export async function getOutletById(outletId: string) {
  try {
    const response = await axiosInstance.get(`${baseUrl}/outlet/${outletId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data outlet:", err);
  }
}

export async function updateOutlet(
  editId: string,
  editName: string,
  editAddress: string,
  editContact: string
) {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/outlet/${editId}`,
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
    const message = err.response?.data?.message || "Gagal mengubah outlet";
    console.log(message);
    throw new Error(message);
  }
}
