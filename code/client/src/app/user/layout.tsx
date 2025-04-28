"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Loader from "@/components/loader";
import { useUserStore } from "@/store/user-store";

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function UserLayout({ children }: HomeLayoutProps) {
  const pathname = usePathname();

  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(pathname);
  }, [fetchUser, pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
