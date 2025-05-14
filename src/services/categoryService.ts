// services/categoryService.ts
import axios from "axios";
import { baseUrl } from "@/app/config/config";

export interface Category {
  id?: number;
  name: string;
  description: string;
}

const API_URL = `${baseUrl}/categories`;

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json(); // Ambil data dari response
    console.log("Data kategori dari API:", data); // ✅ Log hasilnya sebelum return

    // Sorting by created_at ascending before returning
    return data.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  } catch (error) {
    console.error("Fetching categories failed:", error);
    throw error;
  }
};

export const storeCategory = async (newCategory: Category) => {
  const response = await axios.post(`${baseUrl}/categories`, newCategory);
  return response.data;
};

export const editCategory = async (newCategory: Category) => {
  const response = await axios.post(`${baseUrl}/categories`, newCategory);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await axios.delete(
    `${baseUrl}/categories/${encodeURIComponent(id)}`
  );
  return response.data;
};
