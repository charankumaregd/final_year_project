"use client";

import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function Cta() {
  const { isAuthenticated } = useAuth();

  return (
    <section id="faq" className="pb-20 md:pb-24">
      <div className="flex flex-col items-center justify-center text-center bg-secondary rounded-md px-4 py-20 space-y-4">
        <div className="text-center space-y-2 max-w-3xl">
          <Badge>Get Started</Badge>
          <h1 className="text-2xl md:text-3xl font-medium">
            Collaborate Seamlessly in Real Time
          </h1>
          <p className="md:text-md text-accent-foreground leading-relaxed">
            Start editing documents with your team instantly. Experience
            real-time collaboration with LiveDocs.
          </p>
        </div>

        {!isAuthenticated && (
          <Link href="/register">
            <Button variant="default" size="lg">
              <span>Get Started</span>
              <ArrowRight />
            </Button>
          </Link>
        )}
        {isAuthenticated && (
          <Link href="/user/document">
            <Button variant="default" size="lg">
              <span>Go to My Documents</span>
              <ArrowRight />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}
