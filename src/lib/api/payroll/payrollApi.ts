// lib/api/payrollApi.ts

import { baseUrl } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { getToken } from "../tokenHelper";
import {
  Payroll,
  PayrollResponse,
  PayrollResponseDetail,
} from "./payrolInterface";

/**
 * Fetch Payrolls dengan filter dan pagination
 */
export const fetchAllPayrolls = async (
  outlet_id: string,
  year?: string,
  month?: string,
  page: number = 1,
  per_page: number = 10
): Promise<PayrollResponse | null> => {
  try {
    const params = new URLSearchParams();

    if (outlet_id) params.append("outlet_id", outlet_id);
    if (year) params.append("year", year.toString());
    if (month) params.append("month", month.toString());
    params.append("page", page.toString());
    params.append("per_page", per_page.toString());

    const res = await axiosInstance.get(
      `${baseUrl}/payroll?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Gagal fetch payrolls:", err);
    return null;
  }
};

/**
 * Create Payroll
 */
export async function createPayroll({
  outlet_id,
  date,
  items,
}: {
  outlet_id: string;
  date: string; // YYYY-MM-DD
  items: { employee_id: string; amount: number }[];
}): Promise<Payroll | null> {
  try {
    const response = await axiosInstance.post<{ data: Payroll }>(
      `${baseUrl}/payroll`,
      { outlet_id, date, items },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log("Payroll created:", response.data.data);
    return response.data.data;
  } catch (err) {
    console.error("Gagal membuat payroll:", err);
    throw err;
  }
}

/**
 * Find Payroll By ID
 */
export const fetchPayrollById = async (
  id: string
): Promise<PayrollResponseDetail | null> => {
  try {
    const res = await axiosInstance.get<PayrollResponseDetail>(
      `${baseUrl}/payroll/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Gagal fetch payroll dengan id ${id}:`, err);
    return null;
  }
};

/**
 * Update Payroll
 */
export const updatePayroll = async (
  id: string,
  {
    outlet_id,
    date,
    items,
  }: {
    outlet_id: string;
    date: string;
    items: { employee_id: string; amount: number }[];
  }
): Promise<Payroll | null> => {
  try {
    const res = await axiosInstance.put<Payroll>(
      `${baseUrl}/payroll/${id}`,
      { outlet_id, date, items },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`Gagal update payroll dengan id ${id}:`, err);
    return null;
  }
};

/**
 * Delete Payroll
 */
export const deletePayroll = async (id: string): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${baseUrl}/payroll/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return true;
  } catch (err) {
    console.error(`Gagal delete payroll dengan id ${id}:`, err);
    return false;
  }
};
