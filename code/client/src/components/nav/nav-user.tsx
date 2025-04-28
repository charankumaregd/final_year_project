"use client";

import Image from "next/image";

import { ToggleTheme } from "@/components/toggle-theme";
import UserProfile from "@/components/user-profile";

export default function NavUser() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/svgs/logo.svg"
              alt="LiveDocs Logo"
              width={24}
              height={24}
            />
            <span className="text-lg font-bold">LiveDocs</span>
          </div>

          {/* Desktop & Mobile Nav */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <ToggleTheme />
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
}
