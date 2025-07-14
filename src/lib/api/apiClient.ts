import axios, { AxiosRequestConfig, Method } from "axios";
import { getToken, refreshToken } from "./tokenHelper";
import { baseUrl } from "@/app/config/config";

async function request<T = any>(
  method: Method,
  url: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const doRequest = () =>
    axios.request<T>({
      url: baseUrl + url,
      method,
      headers: { Authorization: `Bearer ${getToken()}` },
      ...config,
    });

  try {
    const { data } = await doRequest();
    return data;
  } catch (err: any) {
    if (err.response?.status === 401 && (await refreshToken())) {
      const { data } = await doRequest(); // retry once
      return data;
    }
    throw err;
  }
}

export const apiGet = <T = any>(url: string, params = {}) =>
  request<T>("GET", url, { params });

export const apiPost = <T = any>(url: string, body = {}, config = {}) =>
  request<T>("POST", url, { data: body, ...config });
