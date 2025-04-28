"use client";

import NavDocument from "@/components/nav/nav-document";
import NavHomeAuth from "@/components/nav/nav-home-auth";
import NavHome from "@/components/nav/nav-home";
import NavUser from "@/components/nav/nav-user";
import { useUserStore } from "@/store/user-store";

type HeaderProps = {
  variant?: string;
};

export default function Header({ variant = "home" }: HeaderProps) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (variant === "home") {
    if (!isAuthenticated) {
      return <NavHome />;
    }

    if (isAuthenticated) {
      return <NavHomeAuth />;
    }
  }

  if (variant === "user") {
    return <NavUser />;
  }

  if (variant === "document") {
    return <NavDocument />;
  }
}
