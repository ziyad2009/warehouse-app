import { Product, Request, User } from "./types";

export const users: User[] = [
  { id: "u1", name: "يوسف فهد العتيبي", employeeNo: "4331373", role: "WORKER", username: "worker", password: "1234" },
  { id: "u2", name: "المالك (Admin)", employeeNo: "9000001", role: "ADMIN", username: "admin", password: "1234" },
];

export const products: Product[] = [
  { id: "p1", name: "SPD", category: "SPD", type: "كهربائي", qtyAvailable: 2828, state: "جيد" },
  { id: "p2", name: "حلية", category: "حلية", type: "عادي", qtyAvailable: 1579, state: "جيد" },
  { id: "p3", name: "درايفر 150W", category: "درايفر", type: "درايفر", capacity: "150 وات", qtyAvailable: 546, state: "رجع" },
  { id: "p4", name: "درايفر 220W", category: "درايفر", type: "درايفر", capacity: "220 وات", qtyAvailable: 994, state: "رجع" },
  { id: "p5", name: "فانوس ابراج 225W", category: "فوانيس", type: "فوانيس ابراج", capacity: "225 وات", qtyAvailable: 10, state: "رجع" },
  { id: "p6", name: "قاطع on/off 10A", category: "قاطع", type: "مفتاح on/off", capacity: "10A / 400V", qtyAvailable: 148, state: "جيد" },
];

let requestSeq = 1001;

export const requests: Request[] = [
  {
    id: "REQ-1000",
    createdBy: "u1",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: "APPROVED",
    items: [{ productId: "p6", qty: 2 }],
    note: "احتياج عاجل",
    approvedBy: "u2",
    approvedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
   {
    id: "REQ-1001",
    createdBy: "u1",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: "APPROVED",
    items: [{ productId: "p6", qty: 3 }],
    note: "احتياج عاجل",
    approvedBy: "u2",
    approvedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
   {
    id: "REQ-1003",
    createdBy: "u1",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: "APPROVED",
    items: [{ productId: "p6", qty: 4 }],
    note: "احتياج عاجل",
    approvedBy: "u2",
    approvedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

export function nextRequestId() {
  requestSeq += 1;
  return `REQ-${requestSeq}`;
}
