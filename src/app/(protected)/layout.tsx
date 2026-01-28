import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warehouse App",
  description: "Warehouse requests & approvals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
