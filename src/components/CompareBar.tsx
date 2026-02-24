"use client";

import Link from "next/link";
import { useCompare } from "@/contexts/CompareContext";
import { GitCompareArrows, X } from "lucide-react";

export default function CompareBar() {
  const { compareIds, clearCompare, count } = useCompare();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary text-white shadow-lg border-t-2 border-accent">
      <div className="max-w-[1400px] mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompareArrows size={20} />
          <span className="text-sm font-semibold">
            เปรียบเทียบสินค้า ({count}/4)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/compare"
            className="bg-accent hover:bg-accent-dark text-white px-4 py-1.5 rounded text-sm font-semibold transition"
          >
            ดูรายการเปรียบเทียบ
          </Link>
          <button
            onClick={clearCompare}
            className="text-white/70 hover:text-white transition"
            title="ล้างรายการ"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
