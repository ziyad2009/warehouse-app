export type Role = "WORKER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  employeeNo: string;
  role: Role;
  username: string;
  password: string; // demo only
};

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ISSUED";

export type Product = {
  id: string;
  name: string;      // الصنف
  category: string;  // الأصناف
  type: string;      // النوع
  lengthMeter?: number;
  capacity?: string; // السعة
  qtyAvailable: number;
  state?: string;    // الحالة
  returnState?: string; // حالة الرجع
};

export type RequestItem = {
  productId: string;
  qty: number;
};

export type Request = {
  id: string;
  createdBy: string;
  createdAt: string;
  status: RequestStatus;
  items: RequestItem[];
  note?: string;

  approvedBy?: string;
  approvedAt?: string;
  rejectReason?: string;

  issuedAt?: string;
};
