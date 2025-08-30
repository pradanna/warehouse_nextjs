import { baseUrl, getToken } from "@/app/config/config";
import axios from "axios";
import axiosInstance from "./axiosInstance";
import { parseError } from "../helper";
import { toast } from "react-toastify";

export async function getUnit(search: string, page: number, limit: number) {
  try {
    const response = await axiosInstance.get(
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
    const response = await axiosInstance.post(baseUrl + "/unit", unitData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (err: any) {
    const friendlyMessage = parseError(err, "Nama Unit");
    toast.error(friendlyMessage);
    throw new Error(friendlyMessage);
  }
}

export async function updateUnit(unitId: string, unitData: any) {
  try {
    const response = await axiosInstance.put(
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
    const friendlyMessage = parseError(err, "Nama Unit");
    toast.error(friendlyMessage);
    throw new Error(friendlyMessage);
  }
}

export async function deleteUnit(unitId: string) {
  try {
    const response = await axiosInstance.delete(`${baseUrl}/unit/${unitId}`, {
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
    const response = await axiosInstance.get(`${baseUrl}/unit/${unitId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Gagal mengambil data unit untuk edit:", err);
  }
}
