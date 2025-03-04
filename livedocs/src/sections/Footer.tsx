import { Button } from "@/components/ui/button";
import Logo from "@/assets/svgs/logo.svg";
import { Github, Linkedin, MailIcon, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image src={Logo} alt="LiveDocs Logo" className="h-6 w-6" />
              <span className="text-lg font-bold">LiveDocs</span>
            </Link>
            <p className="text-accent-foreground">
              Seamless, real-time, decentralized collaboration.
            </p>
          </div>

          <div className="flex space-x-4">
            {contact.map((item) => (
              <Button variant="outline" size="icon" key={item.name}>
                <a href={item.href} target="_blank" aria-label={item.name}>
                  <item.icon />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex md:justify-between gap-8">
          {navigation.map((section) => (
            <div key={section.label} className="space-y-4 space-x-8">
              <h3 className="text-sm font-medium text-accent-foreground">
                {section.label}
              </h3>
              <ul className="space-y-2">
                {section.content.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm hover:underline hover:underline-offset-2"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto pt-6 mt-12 border-t text-center text-sm text-accent-foreground">
        &copy; {new Date().getFullYear()} LiveDocs. All rights reserved.
      </div>
    </footer>
  );
}

const navigation = [
  {
    label: "Quick Links",
    content: [
      { name: "Features", href: "/#features" },
      { name: "How it works", href: "/#how-it-works" },
      { name: "FAQ", href: "/#faq" },
    ],
  },
  {
    label: "Legal",
    content: [
      { name: "Terms & Conditions", href: "/terms-and-conditions" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

const contact = [
  { name: "Mail", icon: MailIcon, href: "mailto:support@example.com" },
  {
    name: "Github",
    icon: Github,
    href: "https://github.com",
  },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://linkedin.com",
  },
];
