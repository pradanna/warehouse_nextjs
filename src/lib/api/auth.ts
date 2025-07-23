import axios from "axios";
import { baseUrl, getToken } from "@/app/config/config";
export async function refreshToken(refreshToken: string) {
  const response = await axios.post(`${baseUrl}/refresh-token`, {
    refresh_token: refreshToken,
  });
  return response.data;
}
