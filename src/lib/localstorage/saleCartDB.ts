const ITEM_KEY = "salesCart";

export interface SaleCartItem {
  inventory_id: string;
  item_id: string;
  name: string;
  unit_id: string;
  unit_name: string;
  quantity: number;
  price: number;
  total: number;
  [key: string]: any;
}

export const setItemsToLocal = (items: SaleCartItem[]) => {
  localStorage.setItem("salesCart", JSON.stringify(items));
};

export const getItemsFromLocal = (): SaleCartItem[] => {
  const data = localStorage.getItem("salesCart");
  return data ? JSON.parse(data) : [];
};

export const clearItemsFromLocal = () => {
  localStorage.removeItem("salesCart");
};
