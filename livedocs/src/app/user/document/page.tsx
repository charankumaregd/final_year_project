"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileEdit, LoaderCircle, Plus, Trash2 } from "lucide-react";
import useDocument from "@/hooks/useDocument";

export default function Documents() {
  const { documents, loading, createDocument, deleteDocument } = useDocument();
  const [newTitle, setNewTitle] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const router = useRouter();

  return (
    <main>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Documents</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus />
              New
            </Button>
          </DialogTrigger>
          <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
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
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  createDocument(newTitle || undefined);
                  setNewTitle("");
                  setIsCreateModalOpen(false);
                }}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <LoaderCircle className="animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-muted-foreground">No documents found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.id} className="relative">
              <div className="absolute right-3 top-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/user/document/${document.id}`)}
                >
                  <FileEdit />
                </Button>
                <Dialog
                  open={isDeleteModalOpen}
                  onOpenChange={setIsDeleteModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocumentId(document.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="text-destructive-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Delete Document</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this document? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="secondary"
                        onClick={() => setIsDeleteModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (selectedDocumentId)
                            deleteDocument(selectedDocumentId);
                          setIsDeleteModalOpen(false);
                        }}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                  Last Modified: {""}
                  {new Date(document.updatedAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
