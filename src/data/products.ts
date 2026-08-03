import { hardwareData } from "@/data/hardwareData";
import { monitorData } from "@/data/monitorData";
import { headphoneData } from "@/data/headphoneData";
import { mouseData } from "@/data/mouseData";
import { keyboardData } from "@/data/keyboardData";
import { webcamData } from "@/data/webcamData";
import { dockStationData } from "@/data/dockStationData";
import { backpackData } from "@/data/backpackData";

/** Normalized product shape used by product detail and compare views. */
export interface CatalogProduct {
  brand: string;
  model: string;
  category: string;
  description: string;
  card_description?: string;
  features?: string;
  image: string;
  price: number;
  recommended?: boolean;
  processor?: string;
  memory?: string;
  storage?: string;
  display?: string;
  graphics?: string;
  operating_system?: string;
  ports?: string;
  battery?: string;
  other?: string;
  display_resolution?: string;
  aspect_ratio?: string;
  display_type?: string;
  curvature?: string;
  touchscreen?: string;
  pixel_density?: string;
  refresh_rate?: string;
  headphone_jack?: string;
  connectivity?: string;
  compatibility?: string;
  number_keys?: number;
  button_quantity?: number;
  video_resolution?: string;
  image_aspect_ratio?: string;
  image_capture_rate?: string;
  power?: string;
  dimensions?: string;
  weight?: string;
  size?: string;
  capacity?: string;
  [key: string]: unknown;
}

export interface SearchableProduct extends CatalogProduct {
  searchableText: string;
  processorTier?: number;
  graphicsTier?: number;
  displaySize?: number;
  priceTier?: number;
  resolutionTier?: number;
  sizeTier?: number;
  refreshRate?: number;
  buttonCount?: number;
  keyCount?: number;
}

function getProcessorTier(processor: string | undefined): number {
  if (!processor) return 1;
  const proc = processor.toLowerCase();
  if (proc.includes("i9") || proc.includes("ryzen 9")) return 5;
  if (proc.includes("i7") || proc.includes("ryzen 7")) return 4;
  if (proc.includes("i5") || proc.includes("ryzen 5")) return 3;
  if (proc.includes("i3") || proc.includes("ryzen 3")) return 2;
  return 1;
}

function getGraphicsTier(graphics: string | undefined): number {
  if (!graphics) return 1;
  const gfx = graphics.toUpperCase();
  if (gfx.includes("RTX 4090") || gfx.includes("RTX 4080")) return 5;
  if (gfx.includes("RTX 4070") || gfx.includes("RTX 4060")) return 4;
  if (gfx.includes("RTX 30") || gfx.includes("GTX 1660")) return 3;
  if (gfx.includes("GTX") || gfx.includes("MX")) return 2;
  return 1;
}

function extractDisplaySize(display: string | undefined): number {
  if (!display) return 0;
  const sizeMatch = display.match(/(\d+(\.\d+)?)/);
  return sizeMatch ? parseFloat(sizeMatch[1]) : 0;
}

function getPriceTier(price: number): number {
  if (price >= 2000) return 5;
  if (price >= 1000) return 4;
  if (price >= 500) return 3;
  if (price >= 200) return 2;
  return 1;
}

function getResolutionTier(resolution: string | undefined): number {
  if (!resolution) return 1;
  const res = resolution.toLowerCase();
  if (res.includes("4k") || res.includes("3840")) return 5;
  if (res.includes("2k") || res.includes("2560")) return 4;
  if (res.includes("1080") || res.includes("1920")) return 3;
  if (res.includes("720")) return 2;
  return 1;
}

function getMonitorSizeTier(resolution: string | undefined): number {
  if (!resolution) return 1;
  const res = resolution.toLowerCase();
  if (res.includes("34") || res.includes("ultrawide")) return 5;
  if (res.includes("32") || res.includes("27")) return 4;
  if (res.includes("24") || res.includes("22")) return 3;
  return 2;
}

function extractRefreshRate(refreshRate: string | undefined): number {
  if (!refreshRate) return 60;
  const rateMatch = refreshRate.match(/(\d+)/);
  return rateMatch ? parseInt(rateMatch[1], 10) : 60;
}

/** All catalog products in a card-friendly shape. */
export function getAllProducts(): CatalogProduct[] {
  return [
    ...hardwareData.map((item) => ({ ...item, category: item.category || "Hardware" })),
    ...headphoneData.map((item) => ({ ...item, category: "Headphones" })),
    ...monitorData.map((item) => ({ ...item, category: "Monitors" })),
    ...mouseData.map((item) => ({
      ...item,
      category: "Mice",
      card_description: item.description,
    })),
    ...keyboardData.map((item) => ({ ...item, category: "Keyboards" })),
    ...webcamData.map((item) => ({ ...item, category: "Webcams" })),
    ...dockStationData.map((item) => ({ ...item, category: "Docking Stations" })),
    ...backpackData.map((item) => ({ ...item, category: "Backpacks" })),
  ];
}

/** Products enriched for local search scoring. */
export function getSearchableProducts(): SearchableProduct[] {
  return [
    ...hardwareData.map((item) => ({
      ...item,
      category: item.category || "Hardware",
      searchableText: `${item.brand} ${item.model} ${item.processor || ""} ${item.graphics || ""} ${item.display || ""} ${item.description || ""}`.toLowerCase(),
      processorTier: getProcessorTier(item.processor),
      graphicsTier: getGraphicsTier(item.graphics),
      displaySize: extractDisplaySize(item.display),
      priceTier: getPriceTier(item.price),
    })),
    ...headphoneData.map((item) => ({
      ...item,
      category: "Headphones",
      searchableText: `${item.brand} ${item.model} ${item.features || ""} ${item.description || ""}`.toLowerCase(),
      priceTier: getPriceTier(item.price),
      recommended: item.recommended,
    })),
    ...monitorData.map((item) => ({
      ...item,
      category: "Monitors",
      searchableText: `${item.brand} ${item.model} ${item.display_resolution || ""} ${item.display_type || ""} ${item.description || ""}`.toLowerCase(),
      resolutionTier: getResolutionTier(item.display_resolution),
      sizeTier: getMonitorSizeTier(item.display_resolution),
      priceTier: getPriceTier(item.price),
      refreshRate: extractRefreshRate(item.refresh_rate),
    })),
    ...mouseData.map((item) => ({
      ...item,
      category: "Mice",
      searchableText: `${item.brand} ${item.model} ${item.description || ""} ${item.connectivity || ""} ${item.compatibility || ""}`.toLowerCase(),
      priceTier: getPriceTier(item.price),
      buttonCount: item.button_quantity,
      recommended: item.recommended,
    })),
    ...keyboardData.map((item) => ({
      ...item,
      category: "Keyboards",
      searchableText: `${item.brand} ${item.model} ${item.connectivity || ""} ${item.compatibility || ""} ${item.description || ""}`.toLowerCase(),
      priceTier: getPriceTier(item.price),
      keyCount: item.number_keys,
      recommended: item.recommended,
    })),
    ...webcamData.map((item) => ({
      ...item,
      category: "Webcams",
      searchableText: `${item.brand} ${item.model} ${item.video_resolution || ""} ${item.display_resolution || ""} ${item.description || ""}`.toLowerCase(),
      priceTier: getPriceTier(item.price),
      resolutionTier: getResolutionTier(item.video_resolution),
      recommended: item.recommended,
    })),
    ...dockStationData.map((item) => ({
      ...item,
      category: "Docking Stations",
      searchableText: `${item.brand} ${item.model} ${item.ports || ""} ${item.power || ""} ${item.description || ""}`.toLowerCase(),
      priceTier: getPriceTier(item.price),
      recommended: item.recommended,
    })),
    ...backpackData.map((item) => ({
      ...item,
      category: "Backpacks",
      searchableText: `${item.brand} ${item.model} ${item.features || ""} ${item.size || ""} ${item.capacity || ""} ${item.description || ""}`.toLowerCase(),
      priceTier: getPriceTier(item.price),
      recommended: item.recommended,
    })),
  ];
}

export function findProductByModel(model: string): CatalogProduct | null {
  const hardware = hardwareData.find((p) => p.model === model);
  if (hardware) return { ...hardware, category: hardware.category };

  const monitor = monitorData.find((p) => p.model === model);
  if (monitor) {
    return {
      ...monitor,
      category: "Monitors",
      card_description: monitor.card_description,
      processor: "",
      memory: "",
      storage: "",
      display: monitor.display_resolution,
      graphics: "",
      operating_system: "",
      ports: "",
      battery: "",
      other: `Curvature: ${monitor.curvature}, Touchscreen: ${monitor.touchscreen}, Pixel Density: ${monitor.pixel_density}, Refresh Rate: ${monitor.refresh_rate}`,
      features: `${monitor.display_resolution}, ${monitor.aspect_ratio}, ${monitor.display_type}`,
    };
  }

  const headphone = headphoneData.find((p) => p.model === model);
  if (headphone) {
    return {
      ...headphone,
      category: "Headphones",
      card_description: headphone.card_description,
      processor: "",
      memory: "",
      storage: "",
      display: "",
      graphics: "",
      operating_system: "",
      ports: headphone.headphone_jack,
      battery: headphone.battery,
      other: headphone.connectivity,
      features: headphone.features,
    };
  }

  const mouse = mouseData.find((p) => p.model === model);
  if (mouse) {
    return {
      ...mouse,
      category: "Mice",
      card_description: mouse.description,
      processor: "",
      memory: "",
      storage: "",
      display: "",
      graphics: "",
      operating_system: "",
      ports: "",
      battery: "",
      other: "",
      features: "",
    };
  }

  const keyboard = keyboardData.find((p) => p.model === model);
  if (keyboard) {
    return {
      ...keyboard,
      category: "Keyboards",
      card_description: keyboard.card_description,
      processor: "",
      memory: "",
      storage: "",
      display: "",
      graphics: "",
      operating_system: "",
      ports: "",
      battery: keyboard.battery,
      other: keyboard.compatibility,
      features: `${keyboard.connectivity}, ${keyboard.number_keys} keys`,
    };
  }

  const webcam = webcamData.find((p) => p.model === model);
  if (webcam) {
    return {
      ...webcam,
      category: "Webcams",
      card_description: webcam.card_description,
      processor: "",
      memory: "",
      storage: "",
      display: webcam.display_resolution,
      graphics: "",
      operating_system: "",
      ports: "",
      battery: "",
      other: `Video Resolution: ${webcam.video_resolution}, Image Aspect Ratio: ${webcam.image_aspect_ratio}, Image Capture Rate: ${webcam.image_capture_rate}`,
      features: `${webcam.video_resolution}, ${webcam.display_resolution}, ${webcam.image_capture_rate}`,
    };
  }

  const dockStation = dockStationData.find((p) => p.model === model);
  if (dockStation) {
    return {
      ...dockStation,
      category: "Docking Stations",
      card_description: dockStation.card_description,
      processor: "",
      memory: "",
      storage: "",
      display: "",
      graphics: "",
      operating_system: "",
      ports: dockStation.ports,
      battery: "",
      other: `Dimensions: ${dockStation.dimensions}, Weight: ${dockStation.weight}`,
      features: `${dockStation.ports}, ${dockStation.power}`,
    };
  }

  const backpack = backpackData.find((p) => p.model === model);
  if (backpack) {
    return {
      ...backpack,
      category: "Backpacks",
      card_description: backpack.card_description,
      processor: "",
      memory: "",
      storage: "",
      display: "",
      graphics: "",
      operating_system: "",
      ports: "",
      battery: "",
      other: `Size: ${backpack.size}, Capacity: ${backpack.capacity}`,
      features: backpack.features,
    };
  }

  return null;
}
