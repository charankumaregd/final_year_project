"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";

export default function NavHome() {
  const [isNavOpen, setisNavOpen] = useState(false);

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
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/register">Register</Link>
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
                onClick={() => setisNavOpen(false)}
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => setisNavOpen(false)}
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "FAQ", href: "/#faq" },
];
