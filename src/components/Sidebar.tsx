"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/categories";

interface SidebarProps {
  activeCategory?: string;
}

function CategoryItem({ cat, activeCategory, depth = 0 }: { cat: Category; activeCategory?: string; depth?: number }) {
  const hasChildren = cat.children && cat.children.length > 0;
  const isParentActive = hasChildren && cat.children!.some(c => c.id === activeCategory);
  const [expanded, setExpanded] = useState(isParentActive);
  const isActive = cat.id === activeCategory;

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-blue-50 hover:text-primary transition ${
            isParentActive ? "text-primary font-semibold" : "text-gray-700"
          }`}
        >
          <span>{cat.name}</span>
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {expanded && (
          <div className="border-l-2 border-primary/20 ml-3">
            {cat.children!.map((child) => (
              <CategoryItem key={child.id} cat={child} activeCategory={activeCategory} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className={`block px-3 py-2 text-sm transition ${
        depth > 0 ? "pl-4" : ""
      } ${
        isActive
          ? "bg-primary text-white font-semibold"
          : "text-gray-700 hover:bg-blue-50 hover:text-primary"
      }`}
    >
      {cat.name}
    </Link>
  );
}

export default function Sidebar({ activeCategory }: SidebarProps) {
  return (
    <aside className="w-[220px] shrink-0 hidden lg:block">
      <div className="sticky top-[120px]">
        <div className="section-header-bar flex items-center gap-2 rounded-t">
          <span className="text-white font-bold text-sm">Shopping Categories</span>
        </div>
        <div className="bg-white border border-t-0 border-gray-200 rounded-b">
          {CATEGORIES.map((cat) => (
            <CategoryItem key={cat.id} cat={cat} activeCategory={activeCategory} />
          ))}
          <Link
            href="/products"
            className="block px-3 py-2 text-sm text-primary font-semibold hover:bg-blue-50 border-t border-gray-100 transition"
          >
            ดูสินค้าทั้งหมด &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}
