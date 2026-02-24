export interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

export const CATEGORIES: Category[] = [
  {
    id: "inverters",
    name: "Inverter / VFD",
    slug: "inverters",
    children: [
      { id: "ms300", name: "MS300 Series", slug: "ms300" },
      { id: "me300", name: "ME300 Series", slug: "me300" },
      { id: "vfd-e", name: "VFD-E Series", slug: "vfd-e" },
      { id: "vfd-el", name: "VFD-EL Series", slug: "vfd-el" },
    ],
  },
  { id: "hmi", name: "HMI Touch Screen", slug: "hmi" },
  { id: "plc", name: "PLC Controller", slug: "plc" },
  { id: "servo", name: "Servo Motor & Drive", slug: "servo" },
  { id: "dtk", name: "Temperature Controller", slug: "dtk" },
  { id: "power-supply", name: "Power Supply", slug: "power-supply" },
];

// Flat list of all leaf category IDs for filtering
export const FLAT_CATEGORIES = [
  { id: "ms300", name: "MS300 Inverter", slug: "ms300" },
  { id: "me300", name: "ME300 Inverter", slug: "me300" },
  { id: "vfd-e", name: "VFD-E Inverter", slug: "vfd-e" },
  { id: "vfd-el", name: "VFD-EL Inverter", slug: "vfd-el" },
  { id: "hmi", name: "HMI Touch Screen", slug: "hmi" },
  { id: "plc", name: "PLC Controller", slug: "plc" },
  { id: "servo", name: "Servo Motor & Drive", slug: "servo" },
  { id: "dtk", name: "Temperature Controller", slug: "dtk" },
  { id: "power-supply", name: "Power Supply", slug: "power-supply" },
] as const;

export type CategoryId = (typeof FLAT_CATEGORIES)[number]["id"];

export function getCategoryName(id: string): string {
  const cat = FLAT_CATEGORIES.find((c) => c.id === id);
  return cat ? cat.name : id;
}

export function getAllLeafIds(): string[] {
  const ids: string[] = [];
  function walk(cats: Category[]) {
    for (const cat of cats) {
      if (cat.children) {
        walk(cat.children);
      } else {
        ids.push(cat.id);
      }
    }
  }
  walk(CATEGORIES);
  return ids;
}
