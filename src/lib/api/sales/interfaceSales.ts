export interface SaleResponse {
  status: number;
  message: string;
  data: Sale[];
  meta: Meta;
}

export interface Sale {
  id: string;
  date: string; // YYYY-MM-DD
  reference_number: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  description: string;
  payment_type: "cash" | "digital" | "installment";
  payment_status: "paid" | "unpaid" | "partial";
  outlet: Outlet;
  items: SaleItem[];
  payments: Payment[];
  credit: Credit;
  author: Author;
}

export interface Outlet {
  id: string;
  name: string;
}

export interface SaleItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Payment {
  id: string;
  date: string; // YYYY-MM-DD
  payment_type: "cash" | "digital";
  amount: number;
  description: string;
  evidence: string | null;
}

export interface Credit {
  amount_due: number;
  amount_paid: number;
  amount_rest: number;
  due_date: string | null; // bisa null
}

export interface Author {
  id: string;
  username: string;
}

export interface Meta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}
