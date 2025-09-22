export interface WarehouseExpenseInput {
  expense_category_id: string;
  date: string; // format: YYYY-MM-DD
  amount: number;
  description: string;
}
