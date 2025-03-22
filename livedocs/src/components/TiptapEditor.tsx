"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import TiptapMenubar from "@/components/TiptapMenubar";

interface TiptapEditorProps {
  title: string;
  content: string;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  handleUpdate: () => void;
  updating: boolean;
}

export default function TiptapEditor({
  title,
  content,
  setTitle,
  setContent,
  handleUpdate,
  updating,
}: TiptapEditorProps) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none border rounded-md p-8 min-h-96 mx-auto",
      },
    },
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="space-y-2">
      <TiptapMenubar
        editor={editor}
        title={title}
        setTitle={setTitle}
        handleUpdate={handleUpdate}
        updating={updating}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
