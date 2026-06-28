/* =================================================================
   Seed data — multi-category electronics catalog (phones, tablets,
   smartwatches, audio, laptops, accessories, gaming).
   Inspired by a Kuwaiti electronics retailer's category structure.
   Prices in KWD (KD). Scores 0–100. Sample data only — no scraped or
   copyrighted content. Product visuals come from vector device illustrations
   (js/ui.js → DeviceArt) or real photos you add under images/ (see MH_IMAGE_BASE).
   ================================================================= */

const BRANDS = ["Apple", "Samsung", "Honor", "Xiaomi", "Google", "Huawei",
                "OnePlus", "Motorola", "Nokia", "Infinix", "ZTE", "Nothing", "Sony"];

const CATEGORIES = [
  { id: "smartphones", name_en: "Smartphones", name_ar: "هواتف ذكية" },
  { id: "tablets",     name_en: "Tablets",     name_ar: "أجهزة لوحية" },
  { id: "smartwatches", name_en: "Smartwatches", name_ar: "ساعات ذكية" },
  { id: "audio",       name_en: "Audio",       name_ar: "سماعات" },
  { id: "laptops",     name_en: "Laptops",     name_ar: "لابتوب" },
  { id: "accessories", name_en: "Accessories", name_ar: "إكسسوارات" },
  { id: "gaming",      name_en: "Gaming",      name_ar: "ألعاب" },
];

/* ---- helper to build a complete, safe specs object (keeps every page crash-free) ---- */
function spec(o) {
  return Object.assign({
    screen: 0, refresh: 0, resolution: "—", ram: 0, storage: 0, battery: 0, charging: 0,
    rearCam: "—", frontCam: "—", processor: "—", weight: 0, dimensions: "—", network: "—",
  }, o);
}

/* ===================== SMARTPHONES ===================== */
const PHONES = [
  {
    id: "p1", type: "phone", brand: "Apple", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max",
    category: "smartphones", tier: "flagship", os: "iOS 17", year: 2023, price: 419, originalPrice: 459, installmentMonths: 12,
    rating: 4.9, reviews: 312, stock: 18, popularity: 99, tags: ["bestSeller", "featured"],
    specs: spec({ screen: 6.7, refresh: 120, resolution: "2796×1290", ram: 8, storage: 256, battery: 4422, charging: 27,
             rearCam: "48MP + 12MP + 12MP", frontCam: "12MP", processor: "Apple A17 Pro", weight: 221, dimensions: "159.9×76.7×8.3mm", network: "5G" }),
    scores: { performance: 98, battery: 86, camera: 96, gaming: 97, overall: 96 }
  },
  {
    id: "p2", type: "phone", brand: "Apple", name: "iPhone 15", slug: "iphone-15",
    category: "smartphones", tier: "flagship", os: "iOS 17", year: 2023, price: 289, originalPrice: 309, installmentMonths: 12,
    rating: 4.7, reviews: 198, stock: 25, popularity: 90, tags: ["featured", "newArrival"],
    specs: spec({ screen: 6.1, refresh: 60, resolution: "2556×1179", ram: 6, storage: 128, battery: 3349, charging: 20,
             rearCam: "48MP + 12MP", frontCam: "12MP", processor: "Apple A16 Bionic", weight: 171, dimensions: "147.6×71.6×7.8mm", network: "5G" }),
    scores: { performance: 92, battery: 80, camera: 90, gaming: 90, overall: 89 }
  },
  {
    id: "p3", type: "phone", brand: "Samsung", name: "Galaxy S24 Ultra", slug: "galaxy-s24-ultra",
    category: "smartphones", tier: "flagship", os: "Android 14", year: 2024, price: 399, originalPrice: 449, installmentMonths: 12,
    rating: 4.8, reviews: 276, stock: 14, popularity: 97, tags: ["bestSeller", "featured", "flashDeal"],
    specs: spec({ screen: 6.8, refresh: 120, resolution: "3120×1440", ram: 12, storage: 256, battery: 5000, charging: 45,
             rearCam: "200MP + 50MP + 12MP + 10MP", frontCam: "12MP", processor: "Snapdragon 8 Gen 3", weight: 232, dimensions: "162.3×79×8.6mm", network: "5G" }),
    scores: { performance: 97, battery: 92, camera: 98, gaming: 96, overall: 95 }
  },
  {
    id: "p4", type: "phone", brand: "Samsung", name: "Galaxy A55", slug: "galaxy-a55",
    category: "smartphones", tier: "midrange", os: "Android 14", year: 2024, price: 129, originalPrice: 145, installmentMonths: 6,
    rating: 4.4, reviews: 142, stock: 40, popularity: 78, tags: ["newArrival"],
    specs: spec({ screen: 6.6, refresh: 120, resolution: "2340×1080", ram: 8, storage: 128, battery: 5000, charging: 25,
             rearCam: "50MP + 12MP + 5MP", frontCam: "32MP", processor: "Exynos 1480", weight: 213, dimensions: "161.1×77.4×8.2mm", network: "5G" }),
    scores: { performance: 74, battery: 88, camera: 78, gaming: 70, overall: 77 }
  },
  {
    id: "p5", type: "phone", brand: "Honor", name: "Honor Magic 6 Pro", slug: "honor-magic-6-pro",
    category: "smartphones", tier: "flagship", os: "Android 14", year: 2024, price: 279, originalPrice: 329, installmentMonths: 12,
    rating: 4.6, reviews: 121, stock: 12, popularity: 85, tags: ["featured", "flashDeal"],
    specs: spec({ screen: 6.8, refresh: 120, resolution: "2800×1280", ram: 12, storage: 256, battery: 5600, charging: 80,
             rearCam: "50MP + 180MP + 50MP", frontCam: "50MP", processor: "Snapdragon 8 Gen 3", weight: 229, dimensions: "162.5×75.8×8.9mm", network: "5G" }),
    scores: { performance: 95, battery: 95, camera: 93, gaming: 94, overall: 93 }
  },
  {
    id: "p6", type: "phone", brand: "Honor", name: "Honor 90", slug: "honor-90",
    category: "smartphones", tier: "midrange", os: "Android 13", year: 2023, price: 109, originalPrice: 129, installmentMonths: 6,
    rating: 4.3, reviews: 96, stock: 33, popularity: 72, tags: [],
    specs: spec({ screen: 6.7, refresh: 120, resolution: "2664×1200", ram: 8, storage: 256, battery: 5000, charging: 66,
             rearCam: "200MP + 12MP + 2MP", frontCam: "50MP", processor: "Snapdragon 7 Gen 1", weight: 183, dimensions: "161.9×74.1×7.8mm", network: "5G" }),
    scores: { performance: 70, battery: 86, camera: 82, gaming: 66, overall: 75 }
  },
  {
    id: "p7", type: "phone", brand: "Xiaomi", name: "Xiaomi 14 Pro", slug: "xiaomi-14-pro",
    category: "smartphones", tier: "flagship", os: "Android 14", year: 2024, price: 269, originalPrice: 299, installmentMonths: 12,
    rating: 4.6, reviews: 134, stock: 16, popularity: 88, tags: ["featured"],
    specs: spec({ screen: 6.73, refresh: 120, resolution: "3200×1440", ram: 12, storage: 256, battery: 4880, charging: 120,
             rearCam: "50MP + 50MP + 50MP", frontCam: "32MP", processor: "Snapdragon 8 Gen 3", weight: 223, dimensions: "161.4×75.3×8.5mm", network: "5G" }),
    scores: { performance: 96, battery: 90, camera: 91, gaming: 95, overall: 92 }
  },
  {
    id: "p8", type: "phone", brand: "Xiaomi", name: "Redmi Note 13 Pro", slug: "redmi-note-13-pro",
    category: "smartphones", tier: "budget", os: "Android 13", year: 2024, price: 79, originalPrice: 95, installmentMonths: 6,
    rating: 4.2, reviews: 211, stock: 55, popularity: 80, tags: ["bestSeller", "flashDeal"],
    specs: spec({ screen: 6.67, refresh: 120, resolution: "2712×1220", ram: 8, storage: 128, battery: 5100, charging: 67,
             rearCam: "200MP + 8MP + 2MP", frontCam: "16MP", processor: "Snapdragon 7s Gen 2", weight: 187, dimensions: "161.2×74.2×7.9mm", network: "4G" }),
    scores: { performance: 66, battery: 87, camera: 80, gaming: 62, overall: 72 }
  },
  {
    id: "p9", type: "phone", brand: "Google", name: "Pixel 8 Pro", slug: "pixel-8-pro",
    category: "smartphones", tier: "flagship", os: "Android 14", year: 2023, price: 309, originalPrice: 349, installmentMonths: 12,
    rating: 4.7, reviews: 167, stock: 11, popularity: 86, tags: ["featured"],
    specs: spec({ screen: 6.7, refresh: 120, resolution: "2992×1344", ram: 12, storage: 128, battery: 5050, charging: 30,
             rearCam: "50MP + 48MP + 48MP", frontCam: "10.5MP", processor: "Google Tensor G3", weight: 213, dimensions: "162.6×76.5×8.8mm", network: "5G" }),
    scores: { performance: 88, battery: 89, camera: 97, gaming: 84, overall: 90 }
  },
  {
    id: "p10", type: "phone", brand: "Google", name: "Pixel 7a", slug: "pixel-7a",
    category: "smartphones", tier: "midrange", os: "Android 13", year: 2023, price: 149, originalPrice: 169, installmentMonths: 6,
    rating: 4.5, reviews: 124, stock: 28, popularity: 76, tags: [],
    specs: spec({ screen: 6.1, refresh: 90, resolution: "2400×1080", ram: 8, storage: 128, battery: 4385, charging: 18,
             rearCam: "64MP + 13MP", frontCam: "13MP", processor: "Google Tensor G2", weight: 193, dimensions: "152×72.9×9mm", network: "5G" }),
    scores: { performance: 80, battery: 82, camera: 92, gaming: 76, overall: 83 }
  },
  {
    id: "p11", type: "phone", brand: "OnePlus", name: "OnePlus 12", slug: "oneplus-12",
    category: "smartphones", tier: "gaming", os: "Android 14", year: 2024, price: 259, originalPrice: 289, installmentMonths: 12,
    rating: 4.7, reviews: 158, stock: 19, popularity: 89, tags: ["featured", "newArrival"],
    specs: spec({ screen: 6.82, refresh: 120, resolution: "3168×1440", ram: 16, storage: 256, battery: 5400, charging: 100,
             rearCam: "50MP + 64MP + 48MP", frontCam: "32MP", processor: "Snapdragon 8 Gen 3", weight: 220, dimensions: "164.3×75.8×9.2mm", network: "5G" }),
    scores: { performance: 97, battery: 93, camera: 89, gaming: 98, overall: 93 }
  },
  {
    id: "p12", type: "phone", brand: "OnePlus", name: "OnePlus Nord 3", slug: "oneplus-nord-3",
    category: "smartphones", tier: "midrange", os: "Android 13", year: 2023, price: 119, originalPrice: 139, installmentMonths: 6,
    rating: 4.3, reviews: 103, stock: 36, popularity: 70, tags: [],
    specs: spec({ screen: 6.74, refresh: 120, resolution: "2772×1240", ram: 8, storage: 128, battery: 5000, charging: 80,
             rearCam: "50MP + 8MP + 2MP", frontCam: "16MP", processor: "MediaTek Dimensity 9000", weight: 193, dimensions: "162.6×75.1×8.2mm", network: "5G" }),
    scores: { performance: 78, battery: 86, camera: 79, gaming: 75, overall: 78 }
  },
  {
    id: "p13", type: "phone", brand: "Nothing", name: "Nothing Phone (2)", slug: "nothing-phone-2",
    category: "smartphones", tier: "midrange", os: "Android 13", year: 2023, price: 199, originalPrice: 229, installmentMonths: 12,
    rating: 4.4, reviews: 88, stock: 15, popularity: 74, tags: ["newArrival"],
    specs: spec({ screen: 6.7, refresh: 120, resolution: "2412×1080", ram: 12, storage: 256, battery: 4700, charging: 45,
             rearCam: "50MP + 50MP", frontCam: "32MP", processor: "Snapdragon 8+ Gen 1", weight: 201, dimensions: "162.1×76.4×8.6mm", network: "5G" }),
    scores: { performance: 86, battery: 84, camera: 83, gaming: 85, overall: 84 }
  },
  {
    id: "p14", type: "phone", brand: "Samsung", name: "Galaxy Z Flip5", slug: "galaxy-z-flip5",
    category: "smartphones", tier: "flagship", os: "Android 13", year: 2023, price: 339, originalPrice: 399, installmentMonths: 12,
    rating: 4.5, reviews: 119, stock: 9, popularity: 82, tags: ["featured", "flashDeal"],
    specs: spec({ screen: 6.7, refresh: 120, resolution: "2640×1080", ram: 8, storage: 256, battery: 3700, charging: 25,
             rearCam: "12MP + 12MP", frontCam: "10MP", processor: "Snapdragon 8 Gen 2", weight: 187, dimensions: "165.1×71.9×6.9mm", network: "5G" }),
    scores: { performance: 90, battery: 72, camera: 85, gaming: 88, overall: 84 }
  },
  {
    id: "p15", type: "phone", brand: "Huawei", name: "Huawei Pura 70 Pro", slug: "huawei-pura-70-pro",
    category: "smartphones", tier: "flagship", os: "HarmonyOS 4", year: 2024, price: 299, originalPrice: 339, installmentMonths: 12,
    rating: 4.5, reviews: 77, stock: 13, popularity: 81, tags: ["featured"],
    specs: spec({ screen: 6.8, refresh: 120, resolution: "2844×1260", ram: 12, storage: 256, battery: 5050, charging: 100,
             rearCam: "50MP + 12.5MP + 48MP", frontCam: "13MP", processor: "Kirin 9010", weight: 226, dimensions: "162.6×76.7×8.4mm", network: "5G" }),
    scores: { performance: 89, battery: 90, camera: 94, gaming: 85, overall: 89 }
  },
  {
    id: "p16", type: "phone", brand: "Motorola", name: "Motorola Edge 50 Pro", slug: "motorola-edge-50-pro",
    category: "smartphones", tier: "midrange", os: "Android 14", year: 2024, price: 139, originalPrice: 159, installmentMonths: 6,
    rating: 4.3, reviews: 64, stock: 22, popularity: 68, tags: ["newArrival"],
    specs: spec({ screen: 6.7, refresh: 144, resolution: "2712×1220", ram: 12, storage: 256, battery: 4500, charging: 125,
             rearCam: "50MP + 13MP + 10MP", frontCam: "50MP", processor: "Snapdragon 7 Gen 3", weight: 186, dimensions: "161.2×72.4×8.2mm", network: "5G" }),
    scores: { performance: 76, battery: 80, camera: 84, gaming: 72, overall: 78 }
  },
  {
    id: "p17", type: "phone", brand: "Infinix", name: "Infinix Note 40 Pro", slug: "infinix-note-40-pro",
    category: "smartphones", tier: "budget", os: "Android 14", year: 2024, price: 59, originalPrice: 69, installmentMonths: 6,
    rating: 4.1, reviews: 142, stock: 60, popularity: 71, tags: ["flashDeal", "bestSeller"],
    specs: spec({ screen: 6.78, refresh: 120, resolution: "2436×1080", ram: 8, storage: 256, battery: 5000, charging: 70,
             rearCam: "108MP + 2MP", frontCam: "32MP", processor: "MediaTek Helio G99", weight: 195, dimensions: "164.5×74.5×7.7mm", network: "4G" }),
    scores: { performance: 58, battery: 85, camera: 74, gaming: 54, overall: 67 }
  },
  {
    id: "p18", type: "phone", brand: "Nokia", name: "Nokia XR21", slug: "nokia-xr21",
    category: "smartphones", tier: "midrange", os: "Android 13", year: 2023, price: 129, originalPrice: 149, installmentMonths: 6,
    rating: 4.2, reviews: 41, stock: 18, popularity: 60, tags: [],
    specs: spec({ screen: 6.49, refresh: 120, resolution: "2400×1080", ram: 6, storage: 128, battery: 4800, charging: 33,
             rearCam: "64MP + 8MP", frontCam: "16MP", processor: "Snapdragon 695", weight: 231, dimensions: "168.5×77.9×10.5mm", network: "5G" }),
    scores: { performance: 64, battery: 84, camera: 72, gaming: 58, overall: 70 }
  },
  {
    id: "p19", type: "phone", brand: "ZTE", name: "ZTE Nubia Z60 Ultra", slug: "zte-nubia-z60-ultra",
    category: "smartphones", tier: "gaming", os: "Android 14", year: 2024, price: 209, originalPrice: 239, installmentMonths: 12,
    rating: 4.4, reviews: 53, stock: 10, popularity: 69, tags: ["newArrival"],
    specs: spec({ screen: 6.8, refresh: 120, resolution: "2480×1116", ram: 12, storage: 256, battery: 6000, charging: 80,
             rearCam: "50MP + 64MP + 50MP", frontCam: "12MP", processor: "Snapdragon 8 Gen 3", weight: 246, dimensions: "164.6×76.9×8.8mm", network: "5G" }),
    scores: { performance: 94, battery: 96, camera: 88, gaming: 95, overall: 91 }
  },
];

/* ===================== TABLETS ===================== */
const TABLETS = [
  {
    id: "t1", type: "tablet", brand: "Apple", name: "iPad Pro 13\" M4", slug: "ipad-pro-13-m4",
    category: "tablets", os: "iPadOS 17", year: 2024, price: 449, originalPrice: 489, installmentMonths: 12,
    rating: 4.9, reviews: 88, stock: 12, popularity: 92, tags: ["featured", "bestSeller"],
    specs: spec({ screen: 13, refresh: 120, resolution: "2752×2064", ram: 8, storage: 256, processor: "Apple M4", weight: 579, network: "Wi-Fi + 5G" }),
    scores: { performance: 99, battery: 90, camera: 80, gaming: 95, overall: 95 },
    chips: ["13\" OLED", "M4", "256GB", "120Hz"],
    specList: [["spec.display", "13\" Ultra Retina XDR, 120Hz"], ["spec.processor", "Apple M4"], ["spec.ram", "8 GB"], ["spec.storage", "256 GB"], ["spec.os", "iPadOS 17"], ["spec.network", "Wi-Fi + 5G"], ["spec.weight", "579 g"]]
  },
  {
    id: "t2", type: "tablet", brand: "Samsung", name: "Galaxy Tab S9 FE", slug: "galaxy-tab-s9-fe",
    category: "tablets", os: "Android 14", year: 2023, price: 169, originalPrice: 199, installmentMonths: 6,
    rating: 4.5, reviews: 64, stock: 20, popularity: 78, tags: [],
    specs: spec({ screen: 10.9, refresh: 90, resolution: "2304×1440", ram: 6, storage: 128, processor: "Exynos 1380", weight: 523, network: "Wi-Fi" }),
    scores: { performance: 74, battery: 86, camera: 70, gaming: 68, overall: 75 },
    chips: ["10.9\"", "6GB", "128GB", "S Pen"],
    specList: [["spec.display", "10.9\" LCD, 90Hz"], ["spec.processor", "Exynos 1380"], ["spec.ram", "6 GB"], ["spec.storage", "128 GB"], ["spec.os", "Android 14"], ["spec.weight", "523 g"]]
  },
  {
    id: "t3", type: "tablet", brand: "Xiaomi", name: "Xiaomi Pad 6", slug: "xiaomi-pad-6",
    category: "tablets", os: "Android 13", year: 2023, price: 109, originalPrice: 129, installmentMonths: 6,
    rating: 4.4, reviews: 96, stock: 26, popularity: 74, tags: ["flashDeal"],
    specs: spec({ screen: 11, refresh: 144, resolution: "2880×1800", ram: 8, storage: 256, processor: "Snapdragon 870", weight: 490, network: "Wi-Fi" }),
    scores: { performance: 80, battery: 84, camera: 68, gaming: 78, overall: 78 },
    chips: ["11\" 144Hz", "8GB", "256GB"],
    specList: [["spec.display", "11\" LCD, 144Hz"], ["spec.processor", "Snapdragon 870"], ["spec.ram", "8 GB"], ["spec.storage", "256 GB"], ["spec.os", "Android 13"], ["spec.weight", "490 g"]]
  },
];

/* ===================== SMARTWATCHES ===================== */
const WATCHES = [
  {
    id: "w1", type: "watch", brand: "Apple", name: "Apple Watch Series 10", slug: "apple-watch-series-10",
    category: "smartwatches", os: "watchOS 11", year: 2024, price: 149, originalPrice: 169, installmentMonths: 6,
    rating: 4.8, reviews: 132, stock: 30, popularity: 91, tags: ["featured", "bestSeller"],
    specs: spec({ screen: 1.96, resolution: "416×496", battery: 18, weight: 36, network: "GPS + Cellular" }),
    scores: { performance: 92, battery: 75, camera: 0, gaming: 0, overall: 88 },
    chips: ["1.96\" OLED", "ECG", "GPS"],
    specList: [["spec.display", "1.96\" LTPO OLED"], ["watch.battery", "18 ساعة / 18h"], ["spec.os", "watchOS 11"], ["spec.network", "GPS + Cellular"], ["spec.weight", "36 g"]]
  },
  {
    id: "w2", type: "watch", brand: "Samsung", name: "Galaxy Watch 7", slug: "galaxy-watch-7",
    category: "smartwatches", os: "Wear OS 5", year: 2024, price: 99, originalPrice: 119, installmentMonths: 6,
    rating: 4.5, reviews: 74, stock: 24, popularity: 79, tags: ["newArrival"],
    specs: spec({ screen: 1.5, resolution: "480×480", battery: 40, weight: 34, network: "GPS + LTE" }),
    scores: { performance: 80, battery: 80, camera: 0, gaming: 0, overall: 80 },
    chips: ["1.5\" AMOLED", "BioActive", "LTE"],
    specList: [["spec.display", "1.5\" Super AMOLED"], ["watch.battery", "40 ساعة / 40h"], ["spec.os", "Wear OS 5"], ["spec.network", "GPS + LTE"], ["spec.weight", "34 g"]]
  },
  {
    id: "w3", type: "watch", brand: "Huawei", name: "Huawei Watch GT 5", slug: "huawei-watch-gt-5",
    category: "smartwatches", os: "HarmonyOS", year: 2024, price: 79, originalPrice: 95, installmentMonths: 6,
    rating: 4.4, reviews: 58, stock: 28, popularity: 72, tags: ["flashDeal"],
    specs: spec({ screen: 1.43, resolution: "466×466", battery: 336, weight: 48, network: "GPS" }),
    scores: { performance: 70, battery: 96, camera: 0, gaming: 0, overall: 78 },
    chips: ["1.43\" AMOLED", "14-day battery", "GPS"],
    specList: [["spec.display", "1.43\" AMOLED"], ["watch.battery", "حتى 14 يوم / up to 14 days"], ["spec.os", "HarmonyOS"], ["spec.network", "GPS"], ["spec.weight", "48 g"]]
  },
];

/* ===================== AUDIO ===================== */
const AUDIO = [
  {
    id: "a1", type: "audio", brand: "Apple", name: "AirPods Pro 2 (USB-C)", slug: "airpods-pro-2",
    category: "audio", os: "—", year: 2023, price: 69, originalPrice: 79, installmentMonths: 6,
    rating: 4.8, reviews: 240, stock: 50, popularity: 94, tags: ["bestSeller", "featured"],
    specs: spec({ battery: 6, charging: 0, weight: 5 }),
    scores: { performance: 0, battery: 80, camera: 0, gaming: 0, overall: 90 },
    chips: ["ANC", "USB-C", "6h+24h"],
    specList: [["audio.type", "In-ear ANC"], ["audio.battery", "6h (+24h case)"], ["audio.feat", "Active Noise Cancellation, Spatial Audio"], ["audio.conn", "Bluetooth 5.3"]]
  },
  {
    id: "a2", type: "audio", brand: "Samsung", name: "Galaxy Buds3 Pro", slug: "galaxy-buds3-pro",
    category: "audio", os: "—", year: 2024, price: 59, originalPrice: 69, installmentMonths: 6,
    rating: 4.5, reviews: 110, stock: 44, popularity: 82, tags: ["newArrival"],
    specs: spec({ battery: 6, weight: 5 }),
    scores: { performance: 0, battery: 78, camera: 0, gaming: 0, overall: 84 },
    chips: ["ANC", "Hi-Fi", "6h+20h"],
    specList: [["audio.type", "In-ear ANC"], ["audio.battery", "6h (+20h case)"], ["audio.feat", "Adaptive ANC, 24-bit Hi-Fi"], ["audio.conn", "Bluetooth 5.4"]]
  },
  {
    id: "a3", type: "audio", brand: "Sony", name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5",
    category: "audio", os: "—", year: 2022, price: 109, originalPrice: 129, installmentMonths: 6,
    rating: 4.9, reviews: 198, stock: 17, popularity: 88, tags: ["featured", "flashDeal"],
    specs: spec({ battery: 30, weight: 250 }),
    scores: { performance: 0, battery: 95, camera: 0, gaming: 0, overall: 93 },
    chips: ["Over-ear", "Best ANC", "30h"],
    specList: [["audio.type", "Over-ear ANC"], ["audio.battery", "30h"], ["audio.feat", "Industry-leading noise cancellation"], ["audio.conn", "Bluetooth 5.2, Multipoint"]]
  },
];

/* ===================== LAPTOPS ===================== */
const LAPTOPS = [
  {
    id: "l1", type: "laptop", brand: "Apple", name: "MacBook Air 13\" M3", slug: "macbook-air-13-m3",
    category: "laptops", os: "macOS Sonoma", year: 2024, price: 379, originalPrice: 419, installmentMonths: 12,
    rating: 4.9, reviews: 156, stock: 14, popularity: 90, tags: ["featured", "bestSeller"],
    specs: spec({ screen: 13.6, resolution: "2560×1664", ram: 8, storage: 256, processor: "Apple M3", weight: 1240 }),
    scores: { performance: 96, battery: 95, camera: 0, gaming: 70, overall: 94 },
    chips: ["13.6\"", "M3", "8GB", "256GB"],
    specList: [["spec.display", "13.6\" Liquid Retina"], ["spec.processor", "Apple M3 (8-core)"], ["spec.ram", "8 GB"], ["spec.storage", "256 GB SSD"], ["spec.os", "macOS Sonoma"], ["spec.weight", "1.24 kg"]]
  },
  {
    id: "l2", type: "laptop", brand: "Samsung", name: "Galaxy Book4", slug: "galaxy-book4",
    category: "laptops", os: "Windows 11", year: 2024, price: 249, originalPrice: 289, installmentMonths: 12,
    rating: 4.4, reviews: 47, stock: 16, popularity: 70, tags: [],
    specs: spec({ screen: 15.6, resolution: "1920×1080", ram: 16, storage: 512, processor: "Intel Core i5", weight: 1550 }),
    scores: { performance: 78, battery: 82, camera: 0, gaming: 60, overall: 76 },
    chips: ["15.6\"", "Core i5", "16GB", "512GB"],
    specList: [["spec.display", "15.6\" FHD"], ["spec.processor", "Intel Core i5-1335U"], ["spec.ram", "16 GB"], ["spec.storage", "512 GB SSD"], ["spec.os", "Windows 11"], ["spec.weight", "1.55 kg"]]
  },
];

/* ===================== ACCESSORIES ===================== */
const ACCESSORIES = [
  {
    id: "ac1", type: "accessory", brand: "Apple", name: "20W USB-C Power Adapter", slug: "apple-20w-adapter",
    category: "accessories", os: "—", year: 2023, price: 9, originalPrice: 12, installmentMonths: 0,
    rating: 4.6, reviews: 320, stock: 120, popularity: 75, tags: ["bestSeller"],
    specs: spec({ charging: 20 }),
    scores: { performance: 0, battery: 0, camera: 0, gaming: 0, overall: 70 },
    chips: ["20W", "USB-C", "Fast charge"],
    specList: [["acc.power", "20W USB-C"], ["acc.compat", "iPhone / iPad"], ["pd.warranty", "1 year"]]
  },
  {
    id: "ac2", type: "accessory", brand: "Samsung", name: "25,000mAh Power Bank", slug: "powerbank-25000",
    category: "accessories", os: "—", year: 2024, price: 18, originalPrice: 25, installmentMonths: 0,
    rating: 4.5, reviews: 144, stock: 80, popularity: 73, tags: ["flashDeal"],
    specs: spec({ battery: 25000, charging: 45 }),
    scores: { performance: 0, battery: 95, camera: 0, gaming: 0, overall: 80 },
    chips: ["25,000mAh", "45W", "2 ports"],
    specList: [["acc.capacity", "25,000 mAh"], ["acc.power", "45W USB-C PD"], ["acc.ports", "USB-C + USB-A"]]
  },
  {
    id: "ac3", type: "accessory", brand: "Honor", name: "Magnetic Wireless Charger", slug: "magnetic-charger",
    category: "accessories", os: "—", year: 2024, price: 12, originalPrice: 16, installmentMonths: 0,
    rating: 4.3, reviews: 67, stock: 95, popularity: 64, tags: [],
    specs: spec({ charging: 15 }),
    scores: { performance: 0, battery: 0, camera: 0, gaming: 0, overall: 68 },
    chips: ["15W", "Magnetic", "Wireless"],
    specList: [["acc.power", "15W wireless"], ["acc.feat", "Magnetic alignment"]]
  },
];

/* ===================== GAMING ===================== */
const GAMING = [
  {
    id: "g1", type: "gaming", brand: "Sony", name: "DualSense Controller", slug: "dualsense-controller",
    category: "gaming", os: "—", year: 2023, price: 22, originalPrice: 28, installmentMonths: 0,
    rating: 4.7, reviews: 210, stock: 40, popularity: 85, tags: ["bestSeller", "featured"],
    specs: spec({ battery: 12 }),
    scores: { performance: 0, battery: 70, camera: 0, gaming: 90, overall: 86 },
    chips: ["PS5", "Haptics", "USB-C"],
    specList: [["game.platform", "PlayStation 5 / PC"], ["game.feat", "Haptic feedback, adaptive triggers"], ["acc.conn", "Bluetooth / USB-C"]]
  },
  {
    id: "g2", type: "gaming", brand: "Xiaomi", name: "Gaming Trigger Set", slug: "gaming-triggers",
    category: "gaming", os: "—", year: 2024, price: 5, originalPrice: 8, installmentMonths: 0,
    rating: 4.2, reviews: 98, stock: 150, popularity: 60, tags: ["flashDeal"],
    specs: spec({}),
    scores: { performance: 0, battery: 0, camera: 0, gaming: 75, overall: 62 },
    chips: ["PUBG", "Mobile", "L1/R1"],
    specList: [["game.platform", "Mobile (PUBG / CoD)"], ["game.feat", "Sensitive shoulder triggers"]]
  },
];

const SEED_PHONES = [].concat(PHONES, TABLETS, WATCHES, AUDIO, LAPTOPS, ACCESSORIES, GAMING);

/* Sample orders for the admin dashboard */
const SEED_ORDERS = [
  { id: "ORD-1042", customer: "أحمد الصباح", date: "2026-06-20", items: 2, total: 718, status: "Delivered", payment: "KNET" },
  { id: "ORD-1043", customer: "سارة خالد", date: "2026-06-22", items: 1, total: 399, status: "Shipped", payment: "Visa" },
  { id: "ORD-1044", customer: "محمد ناصر", date: "2026-06-24", items: 3, total: 507, status: "Processing", payment: "KNET" },
  { id: "ORD-1045", customer: "ليلى حسن", date: "2026-06-25", items: 1, total: 289, status: "Pending", payment: "COD" },
];

/* Customer reviews for homepage */
const SEED_TESTIMONIALS = [
  { name: "فاطمة A.", rating: 5, text_en: "Fast delivery and the phone finder helped me pick the perfect device for photography!", text_ar: "توصيل سريع ومساعد اختيار الهاتف ساعدني أختار الجهاز المثالي للتصوير!" },
  { name: "عمر K.", rating: 5, text_en: "Great prices and the comparison tool is genuinely useful. Highly recommend.", text_ar: "أسعار ممتازة وأداة المقارنة مفيدة جداً. أنصح بها بشدة." },
  { name: "نورة S.", rating: 4, text_en: "Smooth checkout and installment options made it easy. Will buy again.", text_ar: "عملية شراء سلسة وخيارات التقسيط سهّلت الأمر. سأشتري مرة أخرى." },
  { name: "يوسف M.", rating: 5, text_en: "The AI assistant recommended a phone under my budget instantly. Impressive.", text_ar: "المساعد الذكي اقترح هاتفاً ضمن ميزانيتي فوراً. مبهر." },
];

/* ---- Real-photo support ----------------------------------------------------
   Leave empty to use the built-in vector device illustrations.
   Set to "images/" (or a full CDN/URL prefix) to load real photos. Each product
   then loads:  <base><category>/<slug>.jpg   e.g.  images/smartphones/iphone-15-pro-max.jpg
   A missing photo automatically falls back to the illustration — nothing breaks.
   You can also give any single product its own `image: "https://..."` (or local path)
   to override just that one. See images/README.md for how to add photos legally. */
window.MH_IMAGE_BASE = "images/";

/* Brand: store name + optional custom logo file.
   Drop your own logo at images/logo.svg (or .png) and set MH_LOGO to its path
   to replace the built-in wordmark everywhere automatically. */
window.MH_BRAND = "Mobile 2000";
window.MH_LOGO = ""; // e.g. "images/logo.svg"

window.DB = { BRANDS, CATEGORIES, SEED_PHONES, SEED_ORDERS, SEED_TESTIMONIALS };
