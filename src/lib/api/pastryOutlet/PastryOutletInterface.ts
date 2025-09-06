interface Outlet {
  id: string;
  name: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Author {
  id: string;
  username: string;
}

export interface OutletPastry {
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

interface Meta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface OutletPastriesResponse {
  status: number;
  message: string;
  data: OutletPastry[];
  meta: Meta;
}
