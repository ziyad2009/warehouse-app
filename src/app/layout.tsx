import "./globals.css";

export const metadata = {
  title: "Warehouse App",
  description: "Warehouse requests & approvals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
