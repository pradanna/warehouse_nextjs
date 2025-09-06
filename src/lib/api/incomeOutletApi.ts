import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "./axiosInstance";

export async function getIncomesOutlet({
  outlet_id,
  year,
  month,
  page = 1,
  limit = 10,
}: {
  outlet_id: string | null;
  year?: string | null;
  month?: string | null;
  page?: number;
  limit?: number;
}) {
  try {
    // Buat query params
    const params = new URLSearchParams();

    if (outlet_id) params.append("outlet_id", outlet_id);

    if (year) params.append("year", year);
    if (month) params.append("month", month);
    params.append("page", String(page));
    params.append("per_page", String(limit));

    const response = await axiosInstance.get(
      `${baseUrl}/outlet-income?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get IncomesOutlet Success:", response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data incomeOutlet:", err);
    throw err;
  }
}

export async function createIncomesOutlet(unitData: any) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/outlet-income",
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

export async function updateIncomesOutlet(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/outlet-income/" + unitId,
      unitData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data incomeOutlet untuk edit:", err);
  }
}

export async function deleteIncomesOutlet(unitId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/outlet-income/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data incomeOutlet untuk edit:", err);
  }
}

export async function getIncomesOutletbyId(unitId: string) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/outlet-income/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data incomeOutlet untuk edit:", err);
  }
}

export async function updateIncomeMutation(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/outlet-income/" + unitId + "/mutation",
      unitData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data incomeOutlet untuk edit:", err);
  }
}
