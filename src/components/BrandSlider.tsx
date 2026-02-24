"use client";

const brands = [
  { name: "Delta Electronics", color: "#C4161C" },
  { name: "Delta Industrial Automation", color: "#003366" },
  { name: "Delta Power Electronics", color: "#00447c" },
  { name: "Delta SCADA", color: "#2e7d32" },
  { name: "Delta VFD", color: "#ff6600" },
  { name: "Delta Servo", color: "#1565c0" },
];

export default function BrandSlider() {
  return (
    <div className="mb-6">
      <div className="section-header-bar rounded-t flex items-center justify-between">
        <span className="font-bold text-sm">Brand Partners</span>
      </div>
      <div className="bg-white border border-t-0 border-gray-200 rounded-b overflow-hidden">
        <div className="flex items-center justify-around py-5 px-4 gap-6 flex-wrap">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.charAt(0)}
              </div>
              <span className="text-xs font-medium whitespace-nowrap">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
