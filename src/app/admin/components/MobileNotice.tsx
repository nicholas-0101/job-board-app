"use client";
import { MonitorSmartphone } from "lucide-react";

export function MobileNotice() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-secondary-50 to-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:py-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="mx-auto max-w-md space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 rounded-full bg-white/70 backdrop-blur shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center text-[#24CFA7]">
                  <MonitorSmartphone className="h-10 w-10" aria-hidden />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-[#467EC7]">Desktop-Only Dashboard</h1>
              <p className="text-sm text-muted-foreground">Admin area can only be accessed using desktop, laptop, or tablet. Please continue through a device with a larger screen for the best experience.</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-5 text-left text-sm text-muted-foreground backdrop-blur shadow-sm">
              <p className="font-medium text-foreground">Tips</p>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>Use the latest browser for full feature access.</li>
                <li>If using a tablet, enable landscape mode for optimal layout.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


