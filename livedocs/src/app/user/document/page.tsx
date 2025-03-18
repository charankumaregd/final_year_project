"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardFooter,
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
import { LoaderCircle } from "lucide-react";
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
    <main className="max-w-2xl py-12">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl font-bold">My Documents</h1>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>Create</Button>
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
        <div className="flex justify-center items-center h-96">
          <p>No documents found.</p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle>{doc.title || "Untitled"}</CardTitle>
                <CardDescription>
                  Created at: {new Date(doc.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardFooter className="space-x-4">
                <Button onClick={() => router.push(`/user/document/${doc.id}`)}>
                  Open
                </Button>
                <Dialog
                  open={isDeleteModalOpen}
                  onOpenChange={setIsDeleteModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDocumentId(doc.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
