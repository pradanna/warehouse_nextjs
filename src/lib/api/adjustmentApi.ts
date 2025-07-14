import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import { apiGet } from "./apiClient";

// GET inventory adjustment
export const getAdjustment = (
  currentPage: number,
  limit: number,
  param: { param: string; type: any }
) =>
  apiGet("/inventory-adjustment", {
    page: currentPage,
    per_page: limit,
    param,
  });

export async function getAdjustmentIn(
  currentPage: number,
  limit: number,
  param: string,
  date_start: Date | string | null,
  date_end: Date | string | null
) {
  try {
    const res = await axios.get(`${baseUrl}/inventory-adjustment`, {
      params: {
        page: currentPage,
        per_page: limit,
        param: param,
        date_start: date_start,
        date_end: date_end,
        type: "in",
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

export async function getAdjustmentOut(
  currentPage: number,
  limit: number,
  param: string,
  date_start: string | Date | null,
  date_end: string | Date | null
) {
  try {
    const res = await axios.get(`${baseUrl}/inventory-adjustment`, {
      params: {
        page: currentPage,
        per_page: limit,
        param: param,
        date_start: date_start,
        date_end: date_end,
        type: "out",
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

export async function createAdjustment(payload: any) {
  try {
    const response = await axios.post(
      `${baseUrl}/inventory-adjustment`,
      payload,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateAdjustment() {}

export async function deleteAdjustment() {}

export async function getAdjustmentById(id: any) {
  try {
    const response = await axios.get(`${baseUrl}/inventory-adjustment/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
