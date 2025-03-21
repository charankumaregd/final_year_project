import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export interface Document {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export default function useDocument(documentId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const router = useRouter();

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
      setCreating(true);

      const response = await api("/api/document", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      toast.success("Document created successfully");

      router.push(`/user/document/${data.document.id}`);

      setDocuments((prev) => [data.document, ...prev]);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setCreating(false);
    }
  }

  async function updateDocument(
    documentId: string,
    title?: string,
    content?: string
  ) {
    try {
      setUpdating(true);

      const response = await api(`/api/document/${documentId}`, {
        method: "PATCH",
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      toast.success("Document updated successfully");

      setDocuments((prev) =>
        prev.map((document) =>
          document.id === documentId ? data.updatedDocument : document
        )
      );

      setDocument(data.updatedDocument);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setUpdating(false);
    }
  }

  async function deleteDocument(documentId: string) {
    try {
      setDeleting(true);

      await api(`/api/document/${documentId}`, {
        method: "DELETE",
      });

      toast.success("Document deleted successfully");

      setDocuments((prev) =>
        prev.filter((document) => document.id !== documentId)
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setDeleting(false);
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
    createDocument,
    updateDocument,
    deleteDocument,
    loading,
    creating,
    updating,
    deleting,
  };
}
