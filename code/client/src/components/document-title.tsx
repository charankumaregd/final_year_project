"use client";

import { useState } from "react";
import { Edit } from "lucide-react";

import { useDocumentStore } from "@/store/document-store";
import { AccessRole } from "@prisma/client";

export default function DocumentTitle() {
  const doc = useDocumentStore((state) => state.document);
  const isUpdating = useDocumentStore((state) => state.isUpdating);
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const currentUserRole = useDocumentStore((state) => state.currentUserRole);

  const [isDocTitleEditing, setIsDocTitleEditing] = useState<boolean>(false);

  async function handleUpdate(updatedTitle: string) {
    if (doc && updatedTitle) {
      await updateDocument(doc.id, updatedTitle);
    }
  }

  return (
    <div
      className="flex items-center justify-center space-x-1"
      onClick={() => {
        if (!isDocTitleEditing && currentUserRole !== AccessRole.VIEWER) {
          setIsDocTitleEditing(true);
        }
      }}
    >
      <span
        contentEditable={isDocTitleEditing && !isUpdating}
        suppressContentEditableWarning
        ref={(el) => {
          if (isDocTitleEditing && el) {
            el.focus();
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }}
        onBlur={(e) => {
          const updated = e.currentTarget.textContent?.trim();
          if (updated && updated !== doc?.title) {
            handleUpdate(updated);
          }
          setIsDocTitleEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
        }}
        spellCheck={false}
        className="focus:outline-none text-base font-semibold text-center px-1"
      >
        {doc?.title || "Untitled"}
      </span>

      {!isDocTitleEditing && currentUserRole !== AccessRole.VIEWER && (
        <Edit className="w-3 h-3 text-muted-foreground" />
      )}
    </div>
  );
}
