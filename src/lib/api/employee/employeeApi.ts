// lib/api/employeeApi.ts

import { baseUrl } from "@/app/config/config";
import axiosInstance from "../axiosInstance";
import { getToken } from "../tokenHelper";
import {
  Employee,
  EmployeeByIdResponse,
  EmployeeByUpdatedResponse,
  EmployeeResponse,
} from "./employeeInterface";

/**
 * Fetch Employees dengan filter dan pagination
 */
export const fetchEmployees = async (
  param: string = "",
  page: number = 1,
  per_page: number = 10
): Promise<EmployeeResponse | null> => {
  try {
    const res = await axiosInstance.get<EmployeeResponse>(
      `${baseUrl}/employee`,
      {
        params: { param, page, per_page },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Gagal fetch employees:", err);
    return null;
  }
};

/**
 * Create Employee
 */
export async function createEmployee({ name }: { name: string }) {
  try {
    const response = await axiosInstance.post<{ data: Employee }>(
      `${baseUrl}/employee`,
      { name }, // body request
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    console.log(" Employee created:", response.data.data);
    return response.data.data;
  } catch (err) {
    console.error(" Gagal membuat employee:", err);
    throw err;
  }
}

export const fetchEmployeeById = async (
  id: string
): Promise<EmployeeByIdResponse | null> => {
  try {
    const res = await axiosInstance.get<EmployeeByIdResponse>(
      `${baseUrl}/employee/${id}`
    );
    return res.data;
  } catch (err) {
    console.error(`Gagal fetch employee dengan id ${id}:`, err);
    return null;
  }
};

// ✅ Update employee
export const updateEmployee = async (
  id: string,
  name: string
): Promise<EmployeeByUpdatedResponse | null> => {
  try {
    const res = await axiosInstance.put<EmployeeByUpdatedResponse>(
      `${baseUrl}/employee/${id}`,
      { name }
    );
    return res.data;
  } catch (err) {
    console.error(`Gagal update employee dengan id ${id}:`, err);
    return null;
  }
};

// ✅ Delete employee
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    await axiosInstance.delete(`${baseUrl}/employee/${id}`);
    return true;
  } catch (err) {
    console.error(`Gagal delete employee dengan id ${id}:`, err);
    return false;
  }
};
