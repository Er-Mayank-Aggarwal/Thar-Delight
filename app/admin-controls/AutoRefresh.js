"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ interval = 60000 }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      // router.refresh() forces Next.js to fetch the latest server component payload
      // in the background without a full page reload or losing client state.
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null;
}
