"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useDocument from "@/hooks/useDocument";
import { Button } from "@/components/ui/button";
import TiptapEditor from "@/components/TiptapEditor";
import { LoaderCircle } from "lucide-react";

export default function UpdateDocument() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const { document, loading, updating, updateDocument } =
    useDocument(documentId);
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
      <main className="flex flex-col items-center justify-center space-y-4 h-96">
        <p>Document not found.</p>
        <Button onClick={() => router.push("/user/document")}>
          Back to Documents
        </Button>
      </main>
    );
  }

  return (
    <main>
      <TiptapEditor
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        handleUpdate={handleUpdate}
        updating={updating}
      />
    </main>
  );
}
