import axios, { AxiosRequestConfig } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API || "";

/* ---------- token helpers ---------- */
export const getToken = () => localStorage.getItem("access_token") || "";
export const setTokens = (a: string, r: string) => {
  localStorage.setItem("access_token", a);
  localStorage.setItem("refresh_token", r);
};

export async function refreshToken(): Promise<boolean> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;

  try {
    const { data } = await axios.post(
      `${baseUrl}/refresh`,
      { refresh_token: refresh },
      { headers: { "Content-Type": "application/json" } }
    );
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}
