"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import {
  Sparkles,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Compass,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, activeRole } = useAuth();
  const [identifier, setIdentifier] = useState("081298765432");
  const [password, setPassword] = useState("••••••••");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [targetRole, setTargetRole] = useState<UserRole>("ADMIN_BUMDES");

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpOpen(true);
  };

  const handleVerifyOtp = () => {
    switchRole(targetRole);
    setOtpOpen(false);
    toast.success("Verifikasi Berhasil", {
      description: `Masuk sebagai ${targetRole} di Pekon Pagelaran`,
    });
    if (targetRole === "ADMIN_BAPPERIDA") {
      router.push("/bapperida/overview");
    } else if (targetRole === "WARGA") {
      router.push("/citizen/bursa");
    } else {
      router.push("/bumdes/overview");
    }
  };

  const handleQuickAccess = (role: UserRole, targetRoute: string) => {
    switchRole(role);
    toast.success(`Mode Zero-Auth Diaktifkan`, {
      description: `Beralih peran ke ${role}`,
    });
    router.push(targetRoute);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-background px-4 py-8">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Top Bar with Brand & Theme Toggle */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight text-foreground text-sm sm:text-base">
            JEJARING-SEWU
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md z-10 space-y-6">
        <Card className="border-border/60 bg-card/80 backdrop-blur-md shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Portal Otoritas & Demo
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Akses sistem administrasi Pekon & Pemantauan Daerah
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="phone" className="text-xs gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp / HP
                </TabsTrigger>
                <TabsTrigger value="email" className="text-xs gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email Dinas
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleStandardLogin} className="space-y-4">
                <TabsContent value="phone" className="space-y-3 mt-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone-input" className="text-xs">
                      Nomor WhatsApp / HP Terdaftar
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone-input"
                        type="tel"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Contoh: 081298765432"
                        className="pl-9 text-xs h-9"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-3 mt-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="email-input" className="text-xs">
                      Email Resmi Dinas / BAPPERIDA
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-input"
                        type="email"
                        placeholder="admin@pringsewukab.go.id"
                        className="pl-9 text-xs h-9"
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="space-y-1.5">
                  <Label htmlFor="password-input" className="text-xs">
                    Kata Sandi (Password)
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="pl-9 text-xs h-9"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full text-xs h-9 font-medium gap-2">
                  <span>Masuk dengan OTP</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </form>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0 border-t border-border/40 mt-4 px-6 pb-6">
            <div className="text-center pt-3">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Akses Langsung Tanpa Login (Zero-Auth)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="justify-between h-9 text-xs border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-500 text-foreground"
                onClick={() => handleQuickAccess("ADMIN_BUMDES", "/bumdes/overview")}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-500" />
                  <span>Dashboard BUMDes Pekon</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40">
                  ADMIN_BUMDES
                </Badge>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-between h-9 text-xs border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-500 text-foreground"
                onClick={() => handleQuickAccess("ADMIN_BAPPERIDA", "/bapperida/overview")}
              >
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-cyan-500" />
                  <span>Analitik Daerah BAPPERIDA</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-cyan-500 border-cyan-500/40">
                  ADMIN_BAPPERIDA
                </Badge>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="justify-between h-9 text-xs border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-500 text-foreground"
                onClick={() => handleQuickAccess("WARGA", "/citizen/bursa")}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span>Portal Warga & PWA Bursa</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/40">
                  WARGA
                </Badge>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* OTP Modal Dialog */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-base font-bold">Verifikasi 6-Digit OTP</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Kode OTP simulasi telah dikirimkan ke nomor WhatsApp <b>{identifier}</b>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4">
            <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <span className="text-[11px] text-muted-foreground mt-3">
              Ketik sembarang 6 angka untuk verifikasi demo
            </span>
          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOtpOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button size="sm" onClick={handleVerifyOtp} className="text-xs">
              Verifikasi & Masuk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
