import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function Faq() {
  return (
    <section
      id="faq"
      className="flex flex-col items-center justify-center space-y-8 pt-20 md:pt-24"
    >
      <div className="text-center space-y-2 max-w-3xl">
        <Badge>FAQ</Badge>
        <h1 className="text-2xl md:text-3xl font-medium">
          Ferquently Asked Questions
        </h1>
        <p className="md:text-md text-accent-foreground leading-relaxed">
          Find answers to the most common questions about LiveDocs.
        </p>
      </div>
      <div className="max-w-3xl place-self-center w-full">
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={"index-" + index}
              className="py-2"
            >
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

const faqs = [
  {
    question: "What is LiveDocs?",
    answer:
      "LiveDocs is a decentralized, real-time collaborative document editor that allows teams to work together seamlessly without relying on central servers.",
  },
  {
    question: "How does LiveDocs ensure real-time collaboration?",
    answer:
      "LiveDocs uses peer-to-peer technology and CRDTs to enable instant updates, allowing multiple users to edit a document simultaneously without conflicts.",
  },
  {
    question: "Do I need an internet connection to use LiveDocs?",
    answer:
      "LiveDocs primarily works online, but since it's decentralized, direct peer-to-peer connections can allow limited functionality even with poor connectivity.",
  },
  {
    question: "Is my data secure on LiveDocs?",
    answer:
      "Yes. LiveDocs encrypts document data both in transit and at rest, ensuring only authorized users can access or edit your documents.",
  },
  {
    question: "Can I control who edits my documents?",
    answer:
      "Absolutely! LiveDocs provides role-based access controls, allowing you to manage who can view or edit each document.",
  },
  {
    question: "Where is my document data stored?",
    answer:
      "LiveDocs updates and stores document data on secure servers, ensuring consistency across devices while still enabling direct peer-to-peer collaboration where possible.",
  },
];
