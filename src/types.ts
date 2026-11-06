export type Resident = {
  id: string;
  name: string;
  block: string;
  apartment: string;
  phone: string;
};

export type PackageStatus = "pending" | "collected";

export type PackageItem = {
  id: string;
  trackingCode: string;
  residentId: string;
  volumes: number;
  receivedAt: string;
  receivedBy: string;
  pickupPin: string;
  notificationCount: number;
  lastNotificationAt: string;
  status: PackageStatus;
  collectedAt?: string;
  collectedBy?: string;
};
