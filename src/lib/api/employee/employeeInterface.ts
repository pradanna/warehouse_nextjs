export interface Employee {
  id: string;
  name: string;
}

export interface Meta {
  page: number;
  per_page: number;
  total_rows: number;
  total_pages: number;
}

export interface EmployeeResponse {
  status: number;
  message: string;
  data: Employee[];
  meta: Meta;
}

export interface EmployeeByIdResponse {
  status: number;
  message: string;
  data: Employee;
}

export interface EmployeeByUpdatedResponse {
  status: number;
  message: string;
  data: Employee;
}
