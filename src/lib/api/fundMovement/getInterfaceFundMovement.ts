export interface FundTransferResponse {
  status: number;
  message: string;
  data: FundTransfer[];
  meta: PaginationMeta;
}

export interface FundTransferByIdResponse {
  status: number;
  message: string;
  data: FundTransfer;
}

export interface FundTransfer {
  id: string;
  date: string; // format: YYYY-MM-DD
  amount: number;
  transfer_to: string;
  outlet: Outlet;
}

export interface Outlet {
  id: string;
  name: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}
