export interface WarehouseExpenseCategory {
  id: string;
  name: string;
}

export interface WarehouseExpenseAuthor {
  id: string;
  username: string;
}

export interface WarehouseExpense {
  id: string;
  date: string; // format: YYYY-MM-DD
  amount: number;
  description: string;
  category: WarehouseExpenseCategory;
  author: WarehouseExpenseAuthor;
}

export interface WarehouseExpenseMeta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface WarehouseExpenseResponse {
  status: number;
  message: string;
  data: WarehouseExpense[];
  meta: WarehouseExpenseMeta;
}

export interface WarehouseExpenseByIdResponse {
  status: number;
  message: string;
  data: WarehouseExpense;
  meta: WarehouseExpenseMeta;
}
