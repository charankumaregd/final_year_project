import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Document {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
}

export default function useDocument(documentId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function fetchDocuments() {
    try {
      setLoading(true);

      const response = await api("/api/document");

      const data = await response.json();

      setDocuments(data.documents);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchDocument(documentId: string) {
    try {
      setLoading(true);

      const response = await api(`/api/document/${documentId}`);

      const data = await response.json();

      setDocument(data.document);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  async function createDocument(title?: string) {
    try {
      const response = await api("/api/document", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      toast.success("Document created successfully");

      setDocuments((prev) => [data.document, ...prev]);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  async function deleteDocument(documentId: string) {
    try {
      await api(`/api/document/${documentId}`, {
        method: "DELETE",
      });

      toast.success("Document deleted successfully");

      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  }

  useEffect(() => {
    if (documentId) {
      fetchDocument(documentId);
    } else {
      fetchDocuments();
    }
  }, [documentId]);

  return {
    documents,
    document,
    loading,
    createDocument,
    deleteDocument,
  };
}
