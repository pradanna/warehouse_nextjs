// Type untuk outlet
export type OutletData = {
  id: string;
  name: string;
};

// Key yang digunakan untuk menyimpan di localStorage
const SUPPLIER_KEY = "selectedOutlet";

/**
 * Simpan outlet ke localStorage
 * @param id - ID outlet
 * @param name - Nama outlet
 */
export const saveOutletToLocal = (id: string, name: string) => {
  const outletData: OutletData = { id, name };
  localStorage.setItem(SUPPLIER_KEY, JSON.stringify(outletData));
};

/**
 * Ambil data outlet dari localStorage
 * @returns OutletData atau null jika tidak ada
 */
export const getOutletFromLocal = (): OutletData | null => {
  const data = localStorage.getItem(SUPPLIER_KEY);
  return data ? JSON.parse(data) : null;
};

/**
 * Hapus data outlet dari localStorage
 */
export const clearOutletFromLocal = () => {
  localStorage.removeItem(SUPPLIER_KEY);
};
