"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function User() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/document");
  }, [router]);

  return null;
}
