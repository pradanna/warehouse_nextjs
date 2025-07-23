import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function getcredit(
  currentPage: number,
  limit: number,
  supplier_id: string,
  status: any
) {
  try {
    const res = await axiosInstance.get(`${baseUrl}/credit`, {
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

export async function createcredit(payload: any) {
  try {
    const response = await axiosInstance.post(`${baseUrl}/credit`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updatecredit() {}

export async function deletecredit() {}

export async function getcreditById(id: any) {
  try {
    const response = await axiosInstance.get(`${baseUrl}/credit/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
