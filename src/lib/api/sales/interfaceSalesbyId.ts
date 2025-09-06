export interface SaleByIdResponse {
  status: number;
  message: string;
  data: SaleById;
}

export interface SaleById {
  id: string;
  date: string; // format: YYYY-MM-DD
  reference_number: string;
  sub_total: number;
  discount: number;
  tax: number;
  total: number;
  description: string;
  payment_type: "cash" | "digital" | "installment"; // enum bisa disesuaikan
  payment_status: "paid" | "unpaid" | "partial"; // enum bisa disesuaikan
  outlet: {
    id: string;
    name: string;
  };
  items: SaleItem[];
  payments: SalePayment[];
  credit: {
    amount_due: number;
    amount_paid: number;
    amount_rest: number;
    due_date: string | null;
  };
  author: {
    id: string;
    username: string;
  };
}

export interface SaleItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SalePayment {
  id: string;
  date: string; // format: YYYY-MM-DD
  payment_type: "cash" | "digital" | "transfer"; // kemungkinan lain bisa ditambah
  amount: number;
  description: string;
  evidence: string | null; // URL atau null
}
