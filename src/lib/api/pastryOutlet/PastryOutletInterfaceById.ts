interface Outlet {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  qty: number;
  price: number;
  total: number;
}

interface Author {
  id: string;
  username: string;
}

interface OutletPastryData {
  id: string;
  date: string; // format YYYY-MM-DD
  reference_number: string;
  sub_total: number;
  discount: number;
  total: number;
  outlet: Outlet;
  items: Item[];
  author: Author;
}

export interface OutletPastryResponse {
  status: number;
  message: string;
  data: OutletPastryData;
}
