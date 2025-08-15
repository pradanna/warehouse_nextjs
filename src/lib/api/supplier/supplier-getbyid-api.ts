import { baseUrl, getRefreshToken } from "@/app/config/config";
import axios from "axios";
import { getToken } from "../tokenHelper";
import { refreshToken } from "../auth";
import axiosInstance from "../axiosInstance";

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
}

export interface SupplierResponse {
  status: number;
  message: string;
  data: Supplier;
}

export async function fetchSupplierById(id: string): Promise<SupplierResponse> {
  try {
    const response = await axiosInstance.get<SupplierResponse>(
      `${baseUrl}/supplier/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data supplier:", err);
    throw err;
  }
}
