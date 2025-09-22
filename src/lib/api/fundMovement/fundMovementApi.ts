import { baseUrl } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { getToken } from "../tokenHelper";
import {
  FundTransferByIdResponse,
  FundTransferResponse,
} from "./getInterfaceFundMovement";

// function get
export async function getFundTransfers({
  date_start,
  date_end,
  transfer_to,
  outlet_id,
  page = 1,
  per_page = 10,
}: {
  date_start?: string;
  date_end?: string;
  transfer_to?: string;
  outlet_id?: string;
  page?: number;
  per_page?: number;
}): Promise<FundTransferResponse> {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (date_start) params.append("date_start", date_start);
    if (date_end) params.append("date_end", date_end);
    if (transfer_to) params.append("transfer_to", transfer_to);
    if (outlet_id) params.append("outlet_id", outlet_id);
    params.append("page", String(page));
    params.append("per_page", String(per_page));

    const response = await axiosInstance.get<FundTransferResponse>(
      `${baseUrl}/fund-transfer?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("✅ Get FundTransfers Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("❌ Gagal mengambil data FundTransfers:", err);
    throw err;
  }
}

export async function createFundTransfer(fundTransferData: {
  outlet_id: string;
  date: string;
  amount: number;
  transfer_to: string;
}) {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/fund-transfer`,
      fundTransferData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("✅ FundTransfer created:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Error creating FundTransfer:", err);
    throw new Error(
      err.response?.data?.message || "Failed to create FundTransfer"
    );
  }
}

export async function updateFundTransfer(
  fundTransferId: string,
  fundTransferData: {
    outlet_id: string;
    date: string;
    amount: number;
    transfer_to: string;
  }
) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/fund-transfer/" + fundTransferId,
      fundTransferData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengupdate fund transfer:", err);
  }
}

export async function findFundTransferById(
  fundTransferId: string
): Promise<FundTransferByIdResponse> {
  try {
    const response = await axiosInstance.get<FundTransferByIdResponse>(
      baseUrl + "/fund-transfer/" + fundTransferId,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("❌ Gagal mengambil fund transfer by ID:", err);
    throw new Error(
      err.response?.data?.message || "Failed to fetch fund transfer by ID"
    );
  }
}

export async function deleteFundTransfer(fundTransferId: string) {
  try {
    const response = await axiosInstance.delete(
      baseUrl + "/fund-transfer/" + fundTransferId,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("✅ Fund transfer deleted:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Gagal menghapus fund transfer:", err);
    throw new Error(
      err.response?.data?.message || "Failed to delete fund transfer"
    );
  }
}
