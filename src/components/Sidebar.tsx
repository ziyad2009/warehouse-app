"use client";

import Link from "next/link";
import clsx from "clsx";

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-xl hover:bg-gray-100 text-gray-800"
    >
      {label}
    </Link>
  );
}

export default function Sidebar({
  open,
  onClose,
  role,
}: {
  open: boolean;
  onClose: () => void;
  role: "WORKER" | "ADMIN";
}) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block bg-white rounded-2xl shadow-sm border p-4 h-fit">
        <div className="font-semibold mb-3">القائمة</div>
        <nav className="space-y-1">
          <NavItem href="/dashboard" label="الرئيسية" />
          <NavItem href="/requests" label="الطلبات" />
          <NavItem href="/requests/new" label="طلب صرف جديد" />
          {role === "ADMIN" && <NavItem href="/admin/approvals" label="موافقات الأدمن" />}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <div className={clsx("lg:hidden", open ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
        <aside className="fixed right-0 top-0 h-full w-72 bg-white z-50 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">القائمة</div>
            <button onClick={onClose} className="px-3 py-1 rounded-lg bg-gray-100">
              إغلاق
            </button>
          </div>
          <nav className="space-y-1" onClick={onClose}>
            <NavItem href="/dashboard" label="الرئيسية" />
            <NavItem href="/requests" label="الطلبات" />
            <NavItem href="/requests/new" label="طلب صرف جديد" />
            {role === "ADMIN" && <NavItem href="/admin/approvals" label="موافقات الأدمن" />}
          </nav>
        </aside>
      </div>
    </>
  );
}
