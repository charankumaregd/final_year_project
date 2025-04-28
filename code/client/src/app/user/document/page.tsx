"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderIcon, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Loader from "@/components/loader";
import Header from "@/components/header";
import { useDocumentStore } from "@/store/document-store";

export default function Documents() {
  const router = useRouter();

  const documents = useDocumentStore((state) => state.documents);
  const sharedDocuments = useDocumentStore((state) => state.sharedDocuments);
  const isLoading = useDocumentStore((state) => state.isLoading);
  const isCreating = useDocumentStore((state) => state.isCreating);
  const isDeleting = useDocumentStore((state) => state.isDeleting);
  const fetchDocuments = useDocumentStore((state) => state.fetchDocuments);
  const createDocument = useDocumentStore((state) => state.createDocument);
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);

  const [newTitle, setNewTitle] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );

  function handleOpenDocument(documentId: string) {
    router.push(`/user/document/${documentId}`);
  }

  async function handleCreateDocument() {
    await createDocument(newTitle || undefined);
    setNewTitle("");
    setIsCreateModalOpen(false);
  }

  async function handleDeleteDocument() {
    if (selectedDocumentId) {
      await deleteDocument(selectedDocumentId);
    }
    setIsDeleteModalOpen(false);
  }

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header variant="user" />
      <main>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Documents</h1>
          <Button
            size="sm"
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
          >
            <Plus />
            Create
          </Button>
        </div>

        <Tabs defaultValue="own" className="space-y-4">
          <TabsList>
            <TabsTrigger value="own" className="text-muted-foreground">
              Own
            </TabsTrigger>
            <TabsTrigger value="shared" className="text-muted-foreground">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="own">
            {documents.length === 0 ? (
              <p className="text-muted-foreground">
                No documents found. Create One!
              </p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((document) => (
                  <Card
                    key={document.id}
                    onClick={() => {
                      handleOpenDocument(document.id);
                    }}
                    className="relative hover:ring hover:ring-ring/50"
                  >
                    <div className="absolute right-3 top-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocumentId(document.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {document.title?.length > 25
                            ? `${document.title.slice(0, 25).trim()}...`
                            : document.title || "Untitled"}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Last Modified:{" "}
                        {new Date(document.updatedAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared">
            {sharedDocuments.length === 0 ? (
              <p className="text-muted-foreground">
                No shared documents found.
              </p>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {sharedDocuments.map((document) => (
                  <Card
                    key={document.id}
                    onClick={() => {
                      handleOpenDocument(document.id);
                    }}
                    className="relative hover:ring hover:ring-ring/50"
                  >
                    <div className="absolute right-3 top-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDocumentId(document.id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {document.title?.length > 25
                            ? `${document.title.slice(0, 25).trim()}...`
                            : document.title || "Untitled"}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        Last Modified:{" "}
                        {new Date(document.updatedAt).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog
          open={isCreateModalOpen}
          onOpenChange={() => {
            setIsCreateModalOpen(false);
            setNewTitle("");
          }}
        >
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Create a New Document</DialogTitle>
              <DialogDescription>
                Enter an optional title for your document.
              </DialogDescription>
            </DialogHeader>
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Untitled"
              disabled={isCreating}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isCreating}
                onClick={handleCreateDocument}
              >
                {isCreating ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this document? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="secondary"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={handleDeleteDocument}
              >
                {isDeleting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
