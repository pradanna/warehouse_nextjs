import { baseUrl, getToken } from "@/app/config/config";
import axiosInstance from "./axiosInstance";

export async function getMaterialCategory(
  search: string,
  page: number,
  limit: number
) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/material-category?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get MaterialCategory Success: " + response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data materialCategory:", err);
  }
}

export async function createMaterialCategory(unitData: any) {
  try {
    const response = await axiosInstance.post(
      baseUrl + "/material-category",
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

export async function updateMaterialCategory(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
      baseUrl + "/material-category/" + unitId,
      { name: unitData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data materialCategory untuk edit:", err);
  }
}

export async function deleteMaterialCategory(unitId: string) {
  try {
    const response = await axiosInstance.delete(
      `${baseUrl}/material-category/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data materialCategory untuk edit:", err);
  }
}

export async function getMaterialCategorybyId(unitId: string) {
  try {
    const response = await axiosInstance.get(
      `${baseUrl}/material-category/${unitId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data materialCategory untuk edit:", err);
  }
}
