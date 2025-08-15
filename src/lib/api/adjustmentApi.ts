import {
  baseUrl,
  getRefreshToken,
  getToken,
  setToken,
} from "@/app/config/config";
import axios from "axios";
import { refreshToken } from "./auth";

export async function getAdjustment(
  currentPage: number,
  limit: number,
  param: string,
  type: any
) {
  try {
    const res = await axios.get(`${baseUrl}/inventory-adjustment`, {
      params: {
        page: currentPage,
        per_page: limit,
        param: param,
        type: type,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newAccessToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newAccessToken);

        // Coba ulangi request
        const retryRes = await axios.get(`${baseUrl}/inventory-adjustment`, {
          params: {
            page: currentPage,
            per_page: limit,
            param: param,
            type: type,
          },
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        return retryRes.data;
      } catch (refreshErr) {
        console.error("Gagal refresh token saat getAdjustment:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.error("Gagal mengambil data inventory:", err);
      throw err;
    }
  }
}

export async function getAdjustmentIn(
  currentPage: number,
  limit: number,
  param: string,
  date_start: Date | string | null,
  date_end: Date | string | null
) {
  try {
    const res = await axios.get(`${baseUrl}/inventory-adjustment`, {
      params: {
        page: currentPage,
        per_page: limit,
        param: param,
        date_start,
        date_end,
        type: "in",
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    console.log("Response param:", res.data);

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newAccessToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newAccessToken);

        // Retry request
        const retryRes = await axios.get(`${baseUrl}/inventory-adjustment`, {
          params: {
            page: currentPage,
            per_page: limit,
            param,
            date_start,
            date_end,
            type: "in",
          },
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        return retryRes.data;
      } catch (refreshErr) {
        console.error("Gagal refresh token saat getAdjustmentIn:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.error("Gagal mengambil data inventory:", err);
      throw err;
    }
  }
}

export async function getAdjustmentOut(
  currentPage: number,
  limit: number,
  param: string,
  date_start: string | Date | null,
  date_end: string | Date | null
) {
  try {
    const res = await axios.get(`${baseUrl}/inventory-adjustment`, {
      params: {
        page: currentPage,
        per_page: limit,
        param,
        date_start,
        date_end,
        type: "out",
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newAccessToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newAccessToken);

        // Retry request
        const retryRes = await axios.get(`${baseUrl}/inventory-adjustment`, {
          params: {
            page: currentPage,
            per_page: limit,
            param,
            date_start,
            date_end,
            type: "out",
          },
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        return retryRes.data;
      } catch (refreshErr) {
        console.error("Gagal refresh token saat getAdjustmentOut:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.error("Gagal mengambil data inventory:", err);
      throw err;
    }
  }
}

export async function createAdjustment(payload: any) {
  try {
    const response = await axios.post(
      `${baseUrl}/inventory-adjustment`,
      payload,
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        // Refresh token
        const refreshRes = await refreshToken(getRefreshToken());
        const newAccessToken = refreshRes.data.access_token;

        // Simpan token baru
        setToken(newAccessToken);

        // Retry request
        const retryRes = await axios.post(
          `${baseUrl}/inventory-adjustment`,
          payload,
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          }
        );

        return retryRes.data;
      } catch (refreshErr) {
        console.error("Gagal refresh token saat createAdjustment:", refreshErr);
        throw refreshErr;
      }
    } else {
      console.error("Gagal membuat adjustment:", error);
      throw error;
    }
  }
}

export async function updateAdjustment() {}

export async function deleteAdjustment() {}

export async function getAdjustmentById(id: any) {
  try {
    const response = await axios.get(`${baseUrl}/inventory-adjustment/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const refreshRes = await refreshToken(getRefreshToken());
        const newAccessToken = refreshRes.data.access_token;
        setToken(newAccessToken);

        // Retry
        const retryRes = await axios.get(
          `${baseUrl}/inventory-adjustment/${id}`,
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          }
        );
        return retryRes.data;
      } catch (refreshErr) {
        console.error(
          "Gagal refresh token saat getAdjustmentById:",
          refreshErr
        );
        throw refreshErr;
      }
    } else {
      console.error("Gagal mengambil data adjustment:", error);
      throw error;
    }
  }
}
