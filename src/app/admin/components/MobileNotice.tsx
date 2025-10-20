"use client";
import { MonitorSmartphone } from "lucide-react";

export function MobileNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1d2b53] via-[#233b6d] to-[#0f172a] px-6 py-16 text-white">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="relative h-24 w-24 rounded-full bg-white/10 backdrop-blur">
            <div className="absolute inset-0 flex items-center justify-center text-[#24CFA7]">
              <MonitorSmartphone className="h-10 w-10" aria-hidden />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Dashboard Khusus Desktop</h1>
          <p className="text-sm text-white/80">Area admin hanya dapat diakses menggunakan desktop, laptop, atau tablet. Silakan lanjutkan melalui perangkat dengan layar lebih besar untuk pengalaman terbaik.</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-5 text-left text-sm text-white/80 backdrop-blur">
          <p className="font-medium text-white">Tips</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Gunakan browser terbaru untuk akses penuh fitur.</li>
            <li>Jika memakai tablet, aktifkan mode landscape agar tata letak optimal.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


