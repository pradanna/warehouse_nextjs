export interface FundTransferInput {
  outlet_id: string;
  date: string; // format: YYYY-MM-DD
  amount: number;
  transfer_to: string;
}
