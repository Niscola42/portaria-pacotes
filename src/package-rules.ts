import type { PackageItem } from "./types.ts";

export type CreatePackageInput = Pick<PackageItem, "trackingCode" | "residentId" | "volumes">;

type CreatePackageOptions = {
  id?: string;
  now?: Date;
  random?: () => number;
};

export function normalizeTrackingCode(value: string) {
  return value.trim().toUpperCase();
}

export function findPackageByTrackingCode(packages: PackageItem[], trackingCode: string) {
  const normalizedCode = normalizeTrackingCode(trackingCode);
  return packages.find((item) => item.trackingCode === normalizedCode);
}

export function generatePickupPin(random: () => number = Math.random) {
  return String(Math.floor(1000 + random() * 9000));
}

export function createPackageRecord(input: CreatePackageInput, options: CreatePackageOptions = {}): PackageItem {
  const now = options.now ?? new Date();
  const random = options.random ?? Math.random;
  const timestamp = now.toISOString();

  return {
    id: options.id ?? `${now.getTime()}-${random().toString(16).slice(2)}`,
    ...input,
    trackingCode: normalizeTrackingCode(input.trackingCode),
    receivedAt: timestamp,
    receivedBy: "Marcos Almeida",
    pickupPin: generatePickupPin(random),
    notificationCount: 1,
    lastNotificationAt: timestamp,
    status: "pending",
  };
}

export function resendPackageNotification(packages: PackageItem[], id: string, now = new Date()) {
  const exists = packages.some((item) => item.id === id && item.status === "pending");
  if (!exists) return { packages, success: false };

  return {
    success: true,
    packages: packages.map((item) => item.id === id ? {
      ...item,
      notificationCount: (item.notificationCount ?? 1) + 1,
      lastNotificationAt: now.toISOString(),
    } : item),
  };
}

export type CollectionResult = "ok" | "invalid-pin" | "not-found";

export function collectPackageRecord(packages: PackageItem[], id: string, pin: string, now = new Date()): {
  packages: PackageItem[];
  result: CollectionResult;
} {
  const item = packages.find((entry) => entry.id === id);
  if (!item) return { packages, result: "not-found" };
  if (item.pickupPin !== pin.trim()) return { packages, result: "invalid-pin" };

  return {
    result: "ok",
    packages: packages.map((entry) => entry.id === id ? {
      ...entry,
      status: "collected",
      collectedAt: now.toISOString(),
      collectedBy: "Morador",
    } : entry),
  };
}
