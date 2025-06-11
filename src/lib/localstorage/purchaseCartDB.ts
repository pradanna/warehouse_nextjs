const ITEM_KEY = "purchaseCart";

export interface PurchaseCartItem {
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

export const setItemsToLocal = (items: PurchaseCartItem[]) => {
  localStorage.setItem("purchaseCart", JSON.stringify(items));
};

export const getItemsFromLocal = (): PurchaseCartItem[] => {
  const data = localStorage.getItem("purchaseCart");
  return data ? JSON.parse(data) : [];
};

export const clearItemsFromLocal = () => {
  localStorage.removeItem("purchaseCart");
};
