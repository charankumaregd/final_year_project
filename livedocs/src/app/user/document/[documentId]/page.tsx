"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import useDocument from "@/hooks/useDocument";
import { LoaderCircle } from "lucide-react";

export default function UpdateDocument() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const { document, loading, updateDocument } = useDocument(documentId);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  async function handleUpdate() {
    await updateDocument(documentId, title, content);
  }

  useEffect(() => {
    if (document) {
      setTitle(document.title || "");
      setContent(document.content || "");
    }
  }, [document]);

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
    <main>
      <Card>
        <CardHeader>
          <CardTitle>Document Editor</CardTitle>
          <CardDescription>
            Edit the title and content of your document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 border p-4 rounded-md"
          />
        </CardContent>
        <CardFooter className="flex items-center justify-end space-x-4">
          <Button onClick={handleUpdate}>Save</Button>
          <Button onClick={() => router.back()}>Back</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
