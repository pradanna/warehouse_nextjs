import { baseUrl } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { WarehouseExpenseResponse } from "./getInterface";
import { getToken } from "../tokenHelper";

export async function getWarehouseExpenses({
  expense_category_id,
  date_start,
  date_end,
  page,
  per_page = 10,
}: {
  expense_category_id?: string;
  date_start?: string;
  date_end?: string;
  page?: number;
  per_page?: number;
}): Promise<WarehouseExpenseResponse> {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (expense_category_id)
      params.append("expense_category_id", expense_category_id);
    if (date_start) params.append("date_start", date_start);
    if (date_end) params.append("date_end", date_end);
    params.append("page", String(page));
    params.append("per_page", String(per_page));

    const response = await axiosInstance.get<WarehouseExpenseResponse>(
      `${baseUrl}/warehouse-expense?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("✅ Get WarehouseExpenses Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("❌ Gagal mengambil data WarehouseExpenses:", err);
    throw err;
  }
}

export async function createWarehouseExpense(expenseData: {
  expense_category_id: string;
  date: string;
  amount: number;
  description: string;
}) {
  try {
    const response = await axiosInstance.post(
      `${baseUrl}/warehouse-expense`,
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("✅ WarehouseExpense created:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Error creating WarehouseExpense:", err);
    throw new Error(
      err.response?.data?.message || "Failed to create WarehouseExpense"
    );
  }
}

export async function updateWarehouseExpense(
  expenseId: string,
  expenseData: any
) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/warehouse-expense/" + expenseId,
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengupdate warehouse expense:", err);
  }
}
