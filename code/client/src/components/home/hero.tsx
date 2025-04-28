"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, FileEdit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const { theme } = useTheme();

  const heroImage =
    theme === "light" ? "/images/hero-light.png" : "/images/hero-dark.png";

  return (
    <section id="#" className="space-y-8 pt-8 md:pt-12">
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <div className="space-y-4 max-w-4xl">
          <Badge variant="outline" className="space-x-1 rounded-full px-4 py-2">
            <FileEdit />
            <span>Collaborate in Real-Time</span>
          </Badge>
          <h1 className="text-4xl md:text-6xl font-medium">
            <span>Edit Faster, Collaborate Smarter</span>
          </h1>
          <p className="text-lg md:text-xl text-accent-foreground leading-relaxed">
            Collaborate on documents in real time without central servers. Edit,
            share, and manage files seamlessly with secure, peer-to-peer
            collaboration.
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <Button variant="default" size="lg" asChild>
          <Link href="/register">
            <span>Get Started</span>
            <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="flex items-center justify-center pt-8">
        <div className="border w-4xl rounded-xl overflow-hidden">
          <Image
            src={heroImage}
            alt="Hero Image"
            width={1600}
            height={900}
            priority
          />
        </div>
      </div>
    </section>
  );
}
