import Cta from "@/sections/Cta";
import Faq from "@/sections/Faq";
import Features from "@/sections/Features";
import Hero from "@/sections/Hero";
import HowItWorks from "@/sections/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Faq />
      <Cta />
    </main>
  );
}
