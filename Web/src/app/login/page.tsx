"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Sparkles, Shield, Building, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const user = await login(identifier, password);
      if (user.role === "ADMIN_BUMDES") {
        router.push("/bumdes/overview");
      } else {
        router.push("/bapperida/overview");
      }
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          "Nomor WhatsApp/Email atau kata sandi tidak cocok. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (role: "ADMIN_BUMDES" | "ADMIN_BAPPERIDA") => {
    if (role === "ADMIN_BUMDES") {
      setIdentifier("081234567891");
      setPassword("AdminBumdes123!");
    } else {
      setIdentifier("081234567892");
      setPassword("BapperidaPringsewu123!");
    }
    setErrorMsg(null);
  };

  const directDemoLogin = (role: "ADMIN_BUMDES" | "ADMIN_BAPPERIDA") => {
    const user = loginAsDemo(role);
    if (user.role === "ADMIN_BUMDES") {
      router.push("/bumdes/overview");
    } else {
      router.push("/bapperida/overview");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md z-10 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-1 shadow-lg shadow-emerald-950">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            JEJARING-SEWU
          </h1>
          <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
            SINERGI-PEKON KABUPATEN PRINGSEWU
          </p>
          <p className="text-xs text-slate-400">
            Portal Otoritas BUMDes & Command Center BAPPERIDA
          </p>
        </div>

        <Card className="border-slate-800 bg-slate-950/80 backdrop-blur-md shadow-2xl text-slate-100">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg text-white">Masuk ke Portal</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Gunakan akun resmi pengurus BUMDes atau pejabat BAPPERIDA.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Nomor WhatsApp / Email
                </label>
                <Input
                  type="text"
                  placeholder="081234567891 atau admin@bumdes.id"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Kata Sandi
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm h-10 mt-2 shadow-lg shadow-emerald-950"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memverifikasi Kredensial...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk ke Sistem <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          {/* Quick Demo Fill Section */}
          <CardFooter className="flex flex-col border-t border-slate-800 pt-4 gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider self-start">
              Akses Cepat Pengujian (Lomba Kompas Iptek):
            </span>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => directDemoLogin("ADMIN_BUMDES")}
                className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-[11px] h-9 gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin BUMDes</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => directDemoLogin("ADMIN_BAPPERIDA")}
                className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-[11px] h-9 gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>BAPPERIDA</span>
              </Button>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-1">
              Backend live: <code>http://localhost:4000/api/v1</code>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
