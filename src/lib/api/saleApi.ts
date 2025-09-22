import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import qs from "qs";

export async function getSales(
  currentPage: number,
  limit: number,
  search: string,
  selectedOutlet: any,
  type: string,
  status: string,
  date_start: Date,
  date_end: Date
) {
  try {
    const res = await axiosInstance.get(`${baseUrl}/sale`, {
      params: {
        page: currentPage,
        per_page: limit,
        param: search,
        outlet_id: selectedOutlet,
        type,
        status,
        date_start,
        date_end,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Gagal mengambil data Sales:", err);
  }
}

export async function createSales(payload: any) {
  try {
    const response = await axiosInstance.post(`${baseUrl}/sale`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export async function createSalePayment(payload: any) {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/sale-payment`,
      payload,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Terjadi kesalahan",
      data: error.response?.data || null,
    };
  }
}

export async function updateSales() {}

export async function deleteSales() {}

export async function getSalesById(id: any) {
  try {
    const response = await axiosInstance.get(`${baseUrl}/sale/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function appendSales(id: string, items: any[]) {
  try {
    const response = await axiosInstance.put(
      `${baseUrl}/sale/${id}/append`,
      { items }, // payload
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("appendSales error:", error);
    throw error;
  }
}
