import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  ShieldCheck,
  Users,
  FileEdit,
  Globe,
  Key,
} from "lucide-react";

export default function Feature() {
  return (
    <section
      id="features"
      className="flex flex-col items-center justify-center space-y-8"
    >
      <div className="text-center space-y-2 max-w-3xl">
        <Badge>Features</Badge>
        <h1 className="text-2xl md:text-3xl font-medium">
          Seamless Real-Time Collaboration
        </h1>
        <p className="md:text-md text-accent-foreground leading-relaxed">
          Empower your team with a decentralized, real-time document editor for
          efficient and secure collaboration.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardContent className="space-y-4">
              <feature.icon className="text-accent-foreground" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Edit documents with your team simultaneously, seeing changes live without delays.",
  },
  {
    icon: FileEdit,
    title: "Decentralized Editing",
    description:
      "Work directly with peers without relying on central servers, ensuring privacy and reliability.",
  },
  {
    icon: Globe,
    title: "Access Anywhere",
    description:
      "Collaborate from any device with a seamless, responsive interface built for productivity.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Your data remains yours, end-to-end encryption ensures secure collaboration with no third-party access.",
  },
  {
    icon: Key,
    title: "Role-Based Access",
    description:
      "Control who can view or edit documents with flexible, document-specific access permissions.",
  },
  {
    icon: Sparkles,
    title: "Conflict-Free Editing",
    description:
      "Experience smooth, auto-resolving edits with CRDT-based technology for a seamless workflow.",
  },
];
