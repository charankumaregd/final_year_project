"use client";

import Cta from "@/components/home/cta";
import CtaAuth from "@/components/home/cta-auth";
import Faq from "@/components/home/faq";
import Features from "@/components/home/features";
import Hero from "@/components/home/hero";
import HeroAuth from "@/components/home/hero-auth";
import HowItWorks from "@/components/home/how-it-works";
import { useUserStore } from "@/store/user-store";

export default function Home() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <main>
      {isAuthenticated ? <HeroAuth /> : <Hero />}
      <Features />
      <HowItWorks />
      <Faq />
      {isAuthenticated ? <CtaAuth /> : <Cta />}
    </main>
  );
}
