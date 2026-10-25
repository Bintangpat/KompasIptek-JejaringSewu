import type { Metadata } from "next";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "JEJARING-SEWU — Dashboard Otoritas BUMDes & BAPPERIDA",
  description:
    "Portal Pemerintahan Desa & Otoritas Inovasi Ekonomi Sirkular Berbasis SPK AHP-TOPSIS Kabupaten Pringsewu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-slate-50 text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
