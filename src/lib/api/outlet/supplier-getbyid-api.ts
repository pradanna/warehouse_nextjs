import { baseUrl } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { getToken } from "../tokenHelper";

// types/outlet.ts
export interface Outlet {
  id: string;
  name: string;
  address: string;
  contact: string;
}

export interface OutletResponse {
  status: number;
  message: string;
  data: Outlet;
}

export async function fetchOutletById(id: string): Promise<OutletResponse> {
  try {
    const response = await axiosInstance.get<OutletResponse>(
      `${baseUrl}/outlet/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data outlet:", err);
    throw err;
  }
}
