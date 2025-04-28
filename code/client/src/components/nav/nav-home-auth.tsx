"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LoaderIcon, Menu, X } from "lucide-react";

import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store/user-store";

export default function NavHomeAuth() {
  const isLoggingOut = useUserStore((state) => state.isLoggingOut);
  const logout = useUserStore((state) => state.logout);

  const [isNavOpen, setisNavOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setIsLogoutModalOpen(false);
  }

  useEffect(() => {
    function handleResize() {
      if (isNavOpen && window.innerWidth < 768) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isNavOpen]);

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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-accent-foreground font-medium hover:underline hover:underline-offset-2"
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <ToggleTheme />
              <Button
                variant="outline"
                onClick={() => {
                  setIsLogoutModalOpen(true);
                }}
              >
                Logout
              </Button>
              <Button variant="default" asChild>
                <Link href="/user/document">My Documents</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center justify-center space-x-2">
            <ToggleTheme />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setisNavOpen(!isNavOpen)}
            >
              {isNavOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Sheet */}
      {isNavOpen && (
        <div className="md:hidden container mx-auto p-4 h-screen">
          <div className="space-y-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm text-accent-foreground font-medium hover:underline hover:underline-offset-2"
                onClick={() => setisNavOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex flex-col space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsLogoutModalOpen(true);
                  setisNavOpen(false);
                }}
              >
                Logout
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => setisNavOpen(false)}
                asChild
              >
                <Link href="/user/document">My Documents</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? This will end your current
              session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                "Logout"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "FAQ", href: "/#faq" },
];
