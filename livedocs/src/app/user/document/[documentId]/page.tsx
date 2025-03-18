"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import useDocument from "@/hooks/useDocument";
import { LoaderCircle } from "lucide-react";

export default function Document() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const { document, loading } = useDocument(documentId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col justify-center items-center space-y-8 h-96">
        <p>Document not found.</p>
        <Button onClick={() => router.push("/user/document")}>
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <main className="max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>{document.title || "Untitled Document"}</CardTitle>
          <CardDescription>
            Created at: {new Date(document.createdAt).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{document.content || "No content available."}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/user/document")}>
            Back to Documents
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
