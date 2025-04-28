"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Loader from "@/components/loader";
import ScrollToTop from "@/components/scroll-to-top";
import { useUserStore } from "@/store/user-store";

type HomeLayoutProps = {
  children: React.ReactNode;
};

export default function HomeLayout({ children }: HomeLayoutProps) {
  const pathname = usePathname();

  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser(pathname);
  }, [fetchUser, pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header variant="home" />
      {children}
      <ScrollToTop />
      <Footer />
    </>
  );
}
