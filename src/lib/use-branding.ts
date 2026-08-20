import useSWR from "swr";
import { fetcher } from "./api";
import type { Settings } from "@/types";

const FALLBACK = { app_name: "Super OEY", logo_path: null as string | null };

export function useBranding() {
  const { data } = useSWR<Pick<Settings, "app_name" | "logo_path">>("/public/settings", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60_000,
  });

  return data ?? FALLBACK;
}
