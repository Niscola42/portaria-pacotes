import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  collectPackageRecord,
  createPackageRecord,
  CreatePackageInput,
  resendPackageNotification,
} from "./package-rules";
import { PackageItem } from "./types";

const STORAGE_KEY = "portaria-pacotes:packages:v1";

type StoreValue = {
  packages: PackageItem[];
  ready: boolean;
  addPackage: (input: CreatePackageInput) => PackageItem;
  resendPickupCode: (id: string) => boolean;
  collectPackage: (id: string, pin: string) => "ok" | "invalid-pin" | "not-found";
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => value && setPackages(JSON.parse(value)))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
  }, [packages, ready]);

  const value = useMemo<StoreValue>(() => ({
    packages,
    ready,
    addPackage(input) {
      const item = createPackageRecord(input);
      setPackages((current) => [item, ...current]);
      return item;
    },
    resendPickupCode(id) {
      const result = resendPackageNotification(packages, id);
      if (!result.success) return false;
      setPackages(result.packages);
      return true;
    },
    collectPackage(id, pin) {
      const result = collectPackageRecord(packages, id, pin);
      if (result.result === "ok") setPackages(result.packages);
      return result.result;
    },
  }), [packages, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore deve ser usado dentro de StoreProvider");
  return value;
}
