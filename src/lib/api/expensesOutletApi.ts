import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "./axiosInstance";

export async function getExpensesOutlet({
  outlet_id,
  expense_category_id,
  date_start,
  date_end,
  page = 1,
  limit = 10,
}: {
  outlet_id: string | null;
  expense_category_id?: string;
  date_start?: string | null;
  date_end?: string | null;
  page?: number;
  limit?: number;
}) {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (outlet_id) params.append("outlet_id", outlet_id);
    if (expense_category_id)
      params.append("expense_category_id", expense_category_id);
    if (date_start) params.append("date_start", date_start);
    if (date_end) params.append("date_end", date_end);
    params.append("page", String(page));
    params.append("per_page", String(limit));

    const response = await axiosInstance.get(
      `${baseUrl}/outlet-expense?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get ExpensesOutlet Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesOutlet:", err);
    throw err;
  }
}

export async function createExpensesOutlet(unitData: any) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/outlet-expense",
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

export async function updateExpensesOutlet(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/outlet-expense/" + unitId,
      { name: unitData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
  }
}

export async function deleteExpensesOutlet(unitId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/outlet-expense/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
  }
}

export async function getExpensesOutletbyId(unitId: string) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/outlet-expense/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesOutlet untuk edit:", err);
  }
}
