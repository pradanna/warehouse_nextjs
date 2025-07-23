import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "./axiosInstance";

export async function getExpensesOutlet(
  search: string,
  page: number,
  limit: number
) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/outlet-expense?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get ExpensesOutlet Success: " + response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data expensesOutlet:", err);
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
