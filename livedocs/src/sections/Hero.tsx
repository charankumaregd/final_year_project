import { ArrowRight, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
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
        <Link href="/register">
          <Button variant="default" size="lg">
            <span>Get Started</span>
            <ArrowRight />
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center pt-8">
        <div className="bg-secondary border p-2 w-4xl h-96 rounded-2xl"></div>
      </div>
    </section>
  );
}
