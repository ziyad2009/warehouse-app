"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";



const router = useRouter();
export default function Topbar({
  onMenu,
  userName,
  role,
  approvedCount,
  
}: {
  onMenu: () => void;
  userName: string;
  role: "WORKER" | "ADMIN";
  approvedCount: number;
}) {
  
  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 h-14 flex items-center gap-3">
        <button
          onClick={onMenu}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
          aria-label="menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="flex-1">
          <div className="text-sm text-gray-500">مرحبًا</div>
          <div className="font-semibold text-blue-300 "  >{userName}</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm px-3 py-1 rounded-full bg-gray-100">
            الدور: <span className="font-semibold">{role}</span>
          </div>

          <div className="text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            الموافق عليها: <span className="font-semibold">{approvedCount}</span>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button  onClick={async () => {await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login");
        router.refresh();
      }}
       className="px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800">
              خروج
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
