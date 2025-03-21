"use client";

import { useState, useEffect } from "react";
import Logo from "@/assets/svgs/logo.svg";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "@/components/ToggleTheme";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Menu, X } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import UserProfile from "@/components/UserProfile";

export default function Navbar() {
  const [isNavOpen, setisNavOpen] = useState(false);
  const { isAuthenticated, logout, isLoggingOut } = useAuth();
  const pathname = usePathname();
  const isUserPage = pathname.startsWith("/user");

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
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Logo} alt="LiveDocs Logo" className="h-6 w-6" />
            <span className="text-lg font-bold">LiveDocs</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {!isUserPage &&
              navigation.map((item) => (
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
              {isUserPage && (
                <>
                  <UserProfile />
                </>
              )}
              {!isUserPage && !isAuthenticated && (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
              {!isUserPage && isAuthenticated && (
                <>
                  <Button
                    variant="outline"
                    onClick={logout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Logout"
                    )}
                  </Button>
                  <Link href="/user/document">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      My Documents
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center justify-center space-x-2">
            <ToggleTheme />
            {isUserPage && <UserProfile />}
            {!isUserPage && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setisNavOpen(!isNavOpen)}
              >
                {isNavOpen ? <X /> : <Menu />}
              </Button>
            )}
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
              {!isAuthenticated && (
                <>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      Register
                    </Button>
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      Logout
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => setisNavOpen(false)}
                    >
                      My Documents
                    </Button>
                  </Link>
                </>
              )}
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
