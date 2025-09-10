export interface PayrollResponse {
  status: number;
  message: string;
  data: Payroll[];
  meta: Meta;
}

export interface PayrollResponseDetail {
  status: number;
  message: string;
  data: Payroll;
  meta: Meta;
}

export interface Meta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface Payroll {
  id?: string;
  outlet_id: string;
  date: string;
  amount: number;
  outlet?: Outlet;
  items: PayrollItem[];
}

export interface Outlet {
  id: string;
  name: string;
}

export interface PayrollItem {
  employee_id: string;
  amount: number;
  employee?: Employee;
}

export interface Employee {
  id: string;
  name: string;
}
