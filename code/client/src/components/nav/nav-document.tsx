"use client";

import Image from "next/image";

import ActiveUsers from "@/components/active-users";
import DocumentTitle from "@/components/document-title";
import ShareButton from "@/components/share-button";
import { ToggleTheme } from "@/components/toggle-theme";
import UserProfile from "@/components/user-profile";
import { useDocumentStore } from "@/store/document-store";
import { AccessRole } from "@prisma/client";

export default function NavDocument() {
  const currentUserRole = useDocumentStore((state) => state.currentUserRole);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/svgs/logo.svg"
              alt="LiveDocs Logo"
              width={24}
              height={24}
            />
            <span className="hidden md:flex text-lg font-bold">LiveDocs</span>
          </div>

          {/* Document Title */}
          <DocumentTitle />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-4">
            <ActiveUsers />
            {currentUserRole === AccessRole.OWNER && <ShareButton />}
            <ToggleTheme />
            <UserProfile />
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center justify-center space-x-2">
            <ToggleTheme />
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
}
