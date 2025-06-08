// Type untuk supplier
export type SupplierData = {
  id: string;
  name: string;
};

// Key yang digunakan untuk menyimpan di localStorage
const SUPPLIER_KEY = "selectedSupplier";

/**
 * Simpan supplier ke localStorage
 * @param id - ID supplier
 * @param name - Nama supplier
 */
export const saveSupplierToLocal = (id: string, name: string) => {
  const supplierData: SupplierData = { id, name };
  localStorage.setItem(SUPPLIER_KEY, JSON.stringify(supplierData));
};

/**
 * Ambil data supplier dari localStorage
 * @returns SupplierData atau null jika tidak ada
 */
export const getSupplierFromLocal = (): SupplierData | null => {
  const data = localStorage.getItem(SUPPLIER_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Hapus data supplier dari localStorage
 */
export const clearSupplierFromLocal = () => {
  localStorage.removeItem(SUPPLIER_KEY);
};
