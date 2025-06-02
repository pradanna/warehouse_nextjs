import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";

export async function getUnit(search: string, page: number, limit: number) {
  try {
    const response = await axios.get(
      `${baseUrl}/unit?param=${search}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Get Unit Success: " + response.data.data);
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data unit:", err);
  }
}

export async function createUnit(unitData: any) {
  try {
    const response = await axios.post(baseUrl + "/unit", unitData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    // handleClose();
    return response.data;
  } catch (err: any) {
    console.error("Error creating item:", err);
    throw new Error(err.response?.data?.message || "Failed to create item");
  }
}

export async function updateUnit(unitId: string, unitData: any) {
  try {
    const response = await axios.put(
      baseUrl + "/unit/" + unitId,
      { name: unitData },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data unit untuk edit:", err);
  }
}

export async function deleteUnit(unitId: string) {
  try {
    const response = await axios.delete(`${baseUrl}/unit/${unitId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data unit untuk edit:", err);
  }
}

export async function getUnitbyId(unitId: string) {
  try {
    const response = await axios.get(`${baseUrl}/unit/${unitId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data unit untuk edit:", err);
  }
}
