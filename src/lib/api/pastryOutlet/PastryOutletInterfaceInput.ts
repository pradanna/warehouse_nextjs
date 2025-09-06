import { Item } from "./PastryOutletInterfaceById";

export interface OutletPastryCreate {
  outlet_id: string;
  date: string; // format: YYYY-MM-DD
  reference_number: string;
  carts: Item[];
}
