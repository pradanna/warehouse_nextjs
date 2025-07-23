import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import { apiGet } from "./apiClient";
import axiosInstance from "./axiosInstance";

export const getDebt = (
  currentPage: number,
  limit: number,
  param,
  supplier_id,
  status
) =>
  apiGet("/debt", {
    page: currentPage,
    per_page: limit,
    param,
  });

export async function createDebt(payload: any) {
  try {
    const response = await axiosInstance.post(`${baseUrl}/debt`, payload, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function updateDebt() {}

export async function deleteDebt() {}

export async function getDebtById(id: any) {
  try {
    const response = await axiosInstance.get(`${baseUrl}/debt/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
