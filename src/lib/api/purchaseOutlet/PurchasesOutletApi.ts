import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { OutletPurchasesResponse } from "./PurchaseOutletInterface";
import { OutletPurchaseByIdResponse } from "./PurchaseOutletInterfaceById";

export async function getPurchasesOutlet({
  outlet_id,
  expense_category_id,
  year,
  month,
  page = 1,
  limit = 10,
}: {
  outlet_id: string | null;
  expense_category_id?: string;
  year?: string | null;
  month?: string | null;
  page?: number;
  limit?: number;
}) {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (outlet_id) params.append("outlet_id", outlet_id);
    if (expense_category_id)
      params.append("expense_category_id", expense_category_id);
    if (year) params.append("year", year);
    if (month) params.append("month", month);
    params.append("page", String(page));
    params.append("per_page", String(limit));

    const response = await axiosInstance.get<OutletPurchasesResponse>(
      `${baseUrl}/outlet-purchase?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get PurchasesOutlet Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data purchases Outlet:", err);
    throw err;
  }
}

export async function createPurchasesOutlet(unitData: any) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/outlet-purchase",
      unitData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    // handleClose();
    return response.data;
  } catch (err: any) {
    console.error("Error creating item:", err);
    throw new Error(err.response?.data?.message || "Failed to create item");
  }
}

export async function updatePurchasesOutlet(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/outlet-purchase/" + unitId,
      unitData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data purchasesOutlet untuk edit:", err);
  }
}

export async function deletePurchasesOutlet(unitId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/outlet-purchase/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data purchasesOutlet untuk edit:", err);
  }
}

export async function getPurchasesOutletbyId(unitId: string) {
  try {
    const response = await axiosInstance.get<OutletPurchaseByIdResponse>(
      `${baseUrl}/outlet-purchase/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data purchasesOutlet untuk edit:", err);
  }
}
