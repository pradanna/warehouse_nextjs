import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "./axiosInstance";

export async function getExpensesCategory(
  search: string,
  page: number,
  limit: number
) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/expense-category?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get ExpensesCategory Success: " + response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesCategory:", err);
  }
}

export async function createExpensesCategory(unitData: any) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/expense-category",
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

export async function updateExpensesCategory(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/expense-category/" + unitId,
      { name: unitData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesCategory untuk edit:", err);
  }
}

export async function deleteExpensesCategory(unitId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/expense-category/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesCategory untuk edit:", err);
  }
}

export async function getExpensesCategorybyId(unitId: string) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/expense-category/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesCategory untuk edit:", err);
  }
}
