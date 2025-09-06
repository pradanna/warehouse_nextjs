export interface OutletPurchaseInput {
  sale_id: string;
  date: string; // ISO format "YYYY-MM-DD"
  amount: {
    cash: number;
    digital: number;
  };
  cash_flow: {
    date: string; // ISO format "YYYY-MM-DD"
    name: string;
  };
}

export interface OutletPurchasesResponse {
  status: number;
  message: string;
  data: OutletPurchase[];
  meta: any | null;
}

export interface OutletPurchase {
  id: string;
  date: string;
  amount: number;
  outlet: Outlet;
  cash_flow: CashFlow;
  sale: Sale;
}

export interface Outlet {
  id: string;
  name: string;
}

export interface CashFlow {
  id: string;
  date: string;
  type: "credit" | "debit"; // kalau pasti 2 opsi ini
  name: string;
  amount: number;
}

export interface Sale {
  id: string;
  date: string;
  reference_number: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  payment_type: "cash" | "digital"; // bisa tambah opsi lain
  payment_status: "paid" | "unpaid" | "pending"; // tambahkan sesuai API
}
