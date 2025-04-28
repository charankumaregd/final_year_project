import { FileEdit, Users, ShieldCheck, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="flex flex-col items-center justify-center space-y-8 pt-20 md:pt-24"
    >
      <div className="text-center space-y-2 max-w-3xl">
        <Badge>How It Works</Badge>
        <h1 className="text-2xl md:text-3xl font-medium">
          Work Together, Effortlessly
        </h1>
        <p className="md:text-md text-accent-foreground leading-relaxed">
          Seamless document collaboration with real-time editing, secure access,
          and effortless sharing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <Card key={index}>
            <CardContent className="space-y-4">
              <step.icon className="text-accent-foreground" />
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

const steps = [
  {
    icon: FileEdit,
    title: "Create & Edit",
    description:
      "Start a new document or edit existing ones with real-time updates and seamless syncing.",
  },
  {
    icon: Users,
    title: "Collaborate Instantly",
    description:
      "Invite teammates, assign roles, and work together with smooth real-time collaboration.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Control who can view or edit your documents with robust role-based permissions.",
  },
  {
    icon: Send,
    title: "Share Effortlessly",
    description:
      "Share your documents with teammates and collaborate in real time without delays.",
  },
];
