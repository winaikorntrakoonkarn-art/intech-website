import Link from "next/link";
import { ArrowRight, Package, ShoppingCart, HeadphonesIcon } from "lucide-react";
import { getProducts } from "@/lib/data";
import { FLAT_CATEGORIES } from "@/lib/categories";
import Sidebar from "@/components/Sidebar";
import PromoBanner from "@/components/PromoBanner";
import ProductCarousel from "@/components/ProductCarousel";
import BrandSlider from "@/components/BrandSlider";

export default async function HomePage() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 12);
  const newProducts = [...allProducts].sort((a, b) =>
    new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  ).slice(0, 12);

  // Group products by category for "Shop All Products" section
  const productsByCategory: Record<string, typeof allProducts> = {};
  for (const cat of FLAT_CATEGORIES) {
    const catProducts = allProducts.filter((p) => p.category === cat.id);
    if (catProducts.length > 0) {
      productsByCategory[cat.id] = catProducts;
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-4">
      <div className="flex gap-4">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Resource Links Bar */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide">
            {[
              { name: "สินค้าทั้งหมด", href: "/products" },
              { name: "บริการ", href: "/services" },
              { name: "ขอใบเสนอราคา", href: "/quote" },
              { name: "ติดต่อเรา", href: "/contact" },
              { name: "เกี่ยวกับเรา", href: "/about" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-primary hover:text-white hover:border-primary transition whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Promo Banner */}
          <PromoBanner />

          {/* New and Trending */}
          <ProductCarousel
            title="สินค้าใหม่และแนะนำ"
            products={featuredProducts.length > 0 ? featuredProducts : newProducts}
            viewAllLink="/products"
            accent
          />

          {/* Brand Partners */}
          <BrandSlider />

          {/* Shop All Products - Category Sections */}
          <div className="mb-6">
            <div className="section-header-bar rounded-t flex items-center justify-between">
              <span className="font-bold text-sm">Shop All Products</span>
              <Link href="/products" className="text-xs text-white/80 hover:text-white">
                ดูทั้งหมด &rarr;
              </Link>
            </div>
            <div className="bg-white border border-t-0 border-gray-200 rounded-b">
              {FLAT_CATEGORIES.map((cat) => {
                const catProducts = productsByCategory[cat.id];
                if (!catProducts || catProducts.length === 0) return null;

                return (
                  <div key={cat.id} className="border-b border-gray-100 last:border-b-0">
                    {/* Category Header */}
                    <div className="flex items-center justify-between bg-primary/5 px-4 py-2">
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        {cat.name}
                      </Link>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        className="text-xs text-primary hover:underline"
                      >
                        ดูทั้งหมด ({catProducts.length})
                      </Link>
                    </div>

                    {/* Category Products - Horizontal Scroll */}
                    <div className="flex overflow-x-auto scrollbar-hide gap-0 py-3 px-2">
                      {catProducts.slice(0, 8).map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="shrink-0 w-[140px] px-2 flex flex-col items-center text-center group"
                        >
                          <div className="w-[100px] h-[75px] bg-gray-50 rounded border border-gray-100 flex items-center justify-center mb-1.5 group-hover:border-primary transition">
                            <Package size={28} className="text-gray-300 group-hover:text-primary transition" />
                          </div>
                          <p className="text-[11px] font-medium text-gray-600 line-clamp-2 leading-tight group-hover:text-primary transition">
                            {product.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Products Grid */}
          {featuredProducts.length > 0 && (
            <ProductCarousel
              title="สินค้ายอดนิยม"
              products={featuredProducts}
              viewAllLink="/products"
            />
          )}

          {/* CTA Section */}
          <div className="bg-primary rounded p-6 md:p-8 text-center text-white mb-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              ต้องการคำปรึกษา? ติดต่อทีมวิศวกรของเราวันนี้
            </h2>
            <p className="text-white/80 text-sm mb-4">จันทร์ - เสาร์ 8:00 - 17:00 น.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="tel:029525120"
                className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded font-bold text-sm hover:bg-gray-100 transition"
              >
                <HeadphonesIcon size={18} />
                02-952-5120
              </a>
              <a
                href="https://page.line.me/035qyhrg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#06C755] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-[#05a847] transition"
              >
                สอบถามผ่าน LINE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
