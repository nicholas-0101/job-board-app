"use client";
import { useEffect, useState } from "react";

export function Toast({ message, show, onClose }: { message: string; show: boolean; onClose?: () => void }) {
  const [visible, setVisible] = useState(show);
  useEffect(() => setVisible(show), [show]);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => { setVisible(false); onClose?.(); }, 2500);
    return () => clearTimeout(t);
  }, [visible, onClose]);
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-lg bg-gray-900 text-white px-4 py-2 shadow-lg">{message}</div>
    </div>
  );
}
