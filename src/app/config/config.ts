// config/config.ts
export const baseUrl = "https://warehouse.sukmatrip.com/api/v1";
// export const baseUrl = "http://192.168.0.106:8000/api/v1";

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};
