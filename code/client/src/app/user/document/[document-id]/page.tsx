"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Loader from "@/components/loader";
import TiptapEditor from "@/components/tiptap/tiptap-editor";
import { useDocumentStore } from "@/store/document-store";
import TiptapMenubar from "@/components/tiptap/tiptap-menubar";

export default function UpdateDocument() {
  const params = useParams();
  const documentId = params["document-id"] as string;

  const document = useDocumentStore((state) => state.document);
  const isLoading = useDocumentStore((state) => state.isLoading);
  const fetchDocument = useDocumentStore((state) => state.fetchDocument);
  const updateDocument = useDocumentStore((state) => state.updateDocument);

  const [content, setContent] = useState<string>("");

  async function handleUpdate() {
    await updateDocument(documentId, undefined, content);
  }

  useEffect(() => {
    fetchDocument(documentId);
  }, [documentId, fetchDocument]);

  useEffect(() => {
    if (document) {
      setContent(document.content || "");
    }
  }, [document]);

  if (isLoading) {
    return <Loader />;
  }

  if (!document) {
    return (
      <main className="flex flex-col items-center justify-center space-y-4 h-96">
        <p className="text-lg font-medium">Document not found!</p>
        <Button variant="secondary" asChild>
          <Link href="/user/document"> Back to Documents</Link>
        </Button>
      </main>
    );
  }

  return (
    <>
      <Header variant="document" />
      <main className="space-y-4">
        <TiptapMenubar handleUpdate={handleUpdate} />
        <TiptapEditor
          documentId={documentId}
          content={content}
          setContent={setContent}
        />
      </main>
    </>
  );
}
