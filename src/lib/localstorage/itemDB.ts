const ITEM_KEY = "cart_items";

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  [key: string]: any; // tambahan fleksibilitas
}

export const setItemsToLocal = (items: CartItem[]) => {
  localStorage.setItem(ITEM_KEY, JSON.stringify(items));
};

export const getItemsFromLocal = (): CartItem[] => {
  const data = localStorage.getItem(ITEM_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearItemsFromLocal = () => {
  localStorage.removeItem(ITEM_KEY);
};
