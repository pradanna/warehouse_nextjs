export interface OutletPurchaseByIdResponse {
  status: number;
  message: string;
  data: OutletPurchaseById;
}

export interface OutletPurchaseById {
  id: string;
  date: string; // format "YYYY-MM-DD"
  amount: number;
  cash: number;
  digital: number;
  outlet: {
    id: string;
    name: string;
  };
  cash_flow: {
    id: string;
    date: string; // format "YYYY-MM-DD"
    type: "credit" | "debit";
    name: string;
    amount: number;
  };
  sale: {
    id: string;
    date: string; // format "YYYY-MM-DD"
    reference_number: string;
    sub_total: number;
    discount: number;
    tax: number;
    total: number;
    payment_type: "cash" | "digital" | "installment"; // bisa disesuaikan enum-nya
    payment_status: "paid" | "unpaid" | "partial"; // sesuai kemungkinan dari API
  };
}
