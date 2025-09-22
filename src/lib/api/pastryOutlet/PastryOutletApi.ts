import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { OutletPastriesResponse } from "./PastryOutletInterface";
import { OutletPastryResponse } from "./PastryOutletInterfaceById";
import { WarehouseExpenseByIdResponse } from "../warehouse-expenses/getInterface";

export async function getPastrysOutlet({
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

    const response = await axiosInstance.get<OutletPastriesResponse>(
      `${baseUrl}/outlet-pastry?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get PastrysOutlet Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data pastrys Outlet:", err);
    throw err;
  }
}

export async function createPastrysOutlet(unitData: any) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/outlet-pastry",
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

export async function updatePastrysOutlet(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/outlet-pastry/" + unitId,
      unitData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data pastrysOutlet untuk edit:", err);
  }
}

export async function deletePastrysOutlet(unitId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/outlet-pastry/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data pastrysOutlet untuk edit:", err);
  }
}

export async function getPastrysOutletbyId(unitId: string) {
  try {
    const response = await axiosInstance.get<OutletPastryResponse>(
      `${baseUrl}/outlet-pastry/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data pastrysOutlet untuk edit:", err);
  }
}

export async function deleteWarehouseExpense(expenseId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/warehouse-expense/${expenseId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal menghapus warehouse expense:", err);
  }
}

export async function getWarehouseExpenseById(expenseId: string) {
  try {
    const response = await axiosInstance.get<WarehouseExpenseByIdResponse>(
      `${baseUrl}/warehouse-expense/${expenseId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data warehouse expense untuk edit:", err);
  }
}
