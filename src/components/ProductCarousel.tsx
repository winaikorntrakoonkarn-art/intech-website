"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: number;
  name: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  category: string;
  inStock: boolean;
  images?: string[];
  featured?: boolean;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
  accent?: boolean;
}

export default function ProductCarousel({ title, products, viewAllLink, accent }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("th-TH", { minimumFractionDigits: 0 });

  if (products.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 rounded-t ${accent ? "bg-accent text-white" : "section-header-bar"}`}>
        <h2 className="font-bold text-sm">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-xs hover:underline opacity-80">
            ดูทั้งหมด &rarr;
          </Link>
        )}
      </div>

      {/* Carousel */}
      <div className="relative bg-white border border-t-0 border-gray-200 rounded-b">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-white/90 border border-gray-200 rounded-r shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>

        {/* Products */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-0 py-4 px-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[170px] px-2 flex flex-col items-center text-center group"
              style={{ scrollSnapAlign: "start" }}
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="w-[130px] h-[100px] bg-gray-50 rounded border border-gray-100 flex items-center justify-center mb-2 group-hover:border-primary transition">
                  <Package size={36} className="text-gray-300 group-hover:text-primary transition" />
                </div>
                <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-tight min-h-[32px] group-hover:text-primary transition">
                  {product.name}
                </p>
              </Link>
              <p className="text-sm font-bold text-primary mt-1">฿{formatPrice(product.price)}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs text-gray-400 line-through">฿{formatPrice(product.originalPrice)}</p>
              )}
              {product.inStock && (
                <button
                  onClick={() =>
                    addToCart({
                      productId: product.id,
                      name: product.name,
                      sku: product.sku || "",
                      price: product.price,
                      category: product.category,
                    }, 1)
                  }
                  className="mt-2 flex items-center gap-1 text-xs bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded transition"
                >
                  <ShoppingCart size={12} />
                  เพิ่มลงตะกร้า
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-white/90 border border-gray-200 rounded-l shadow flex items-center justify-center hover:bg-gray-50 transition"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
