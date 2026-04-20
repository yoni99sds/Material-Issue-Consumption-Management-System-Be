export interface User {
  id: string | null;
  username: string;
  role: "admin" | "operator" | "supervisor";
  token: string | null;
}

export interface MaterialIssueHeader {
  id: string | null;
  date: string;
  machine: string;
  workOrderNo: string;
  jobDescription: string | null;
  shift: string;
  operator: string;
  status: "pending" | "approved" | "rejected";
}

export interface MaterialIssueRow {
  sn: number;
  description: string;
  rollNo: string;
  width: number;
  weight: number;
  issuedLength: number;
  waste: number;
  actualSheetProduced: number;
  sheetSize: string;
}

export interface Consumption {
  id: string | null;
  itemCode: string;
  description: string;
  UOM: string;
  issuedQty: number;
  returnedQty: number;
  wasteQty: number;
  remark: string | null;
  date: string;
}
