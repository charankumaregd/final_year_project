import { toast } from "sonner";
import { create } from "zustand";

import { api } from "@/lib/api";
import { Document, SharedUsers } from "@/types";
import { AccessRole } from "@prisma/client";

type DocumentStore = {
  documents: Document[];
  sharedDocuments: Document[];
  document: Document | null;
  sharedUsers: SharedUsers[];
  currentUserRole: AccessRole | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  fetchDocuments: () => Promise<void>;
  fetchDocument: (documentId: string) => Promise<void>;
  fetchSharedUsers: (documentId: string) => Promise<void>;
  createDocument: (title?: string) => Promise<void>;
  updateDocument: (
    documentId: string,
    title?: string,
    content?: string
  ) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  sharedDocuments: [],
  document: null,
  sharedUsers: [],
  currentUserRole: null,
  isLoading: true,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  fetchDocuments: async () => {
    try {
      set({ isLoading: true });

      const res1 = await api("/api/document");
      const res2 = await api("/api/document-access");

      const data1 = await res1.json();
      const data2 = await res2.json();

      set({ documents: data1.documents });
      set({ sharedDocuments: data2.sharedDocuments });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDocument: async (documentId) => {
    try {
      set({ isLoading: true });

      const res1 = await api(`/api/document/${documentId}`);
      const res2 = await api(`/api/document-access/${documentId}`);

      const data1 = await res1.json();
      const data2 = await res2.json();

      set({ document: data1.document });
      set({ sharedUsers: data2.sharedUsers });
      set({ currentUserRole: data2.currentUserRole });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSharedUsers: async (documentId) => {
    try {
      const res = await api(`/api/document-access/${documentId}`);

      const data = await res.json();

      set({ sharedUsers: data.sharedUsers });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  },

  createDocument: async (title) => {
    try {
      set({ isCreating: true });

      const res = await api("/api/document", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      const data = await res.json();

      toast.success("Document created successfully");

      set((state) => ({
        documents: [data.document, ...state.documents],
      }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isCreating: false });
    }
  },

  updateDocument: async (documentId, title, content) => {
    try {
      set({ isUpdating: true });

      const res = await api(`/api/document/${documentId}`, {
        method: "PATCH",
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      toast.success("Document updated successfully");

      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === documentId ? data.updatedDocument : doc
        ),
        document: data.updatedDocument,
      }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteDocument: async (documentId) => {
    try {
      set({ isDeleting: true });

      await api(`/api/document/${documentId}`, {
        method: "DELETE",
      });

      toast.success("Document deleted successfully");

      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== documentId),
      }));
      set((state) => ({
        sharedDocuments: state.sharedDocuments.filter(
          (doc) => doc.id !== documentId
        ),
      }));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isDeleting: false });
    }
  },
}));
