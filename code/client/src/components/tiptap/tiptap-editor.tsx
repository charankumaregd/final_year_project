"use client";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

import { useEditorStore } from "@/store/editor-store";
import { useUserStore } from "@/store/user-store";
import { ActiveUser } from "@/types";
import { AccessRole } from "@prisma/client";
import { useDocumentStore } from "@/store/document-store";

type TiptapEditorProps = {
  documentId: string;
  content: string;
  setContent: (content: string) => void;
};

export default function TiptapEditor({
  documentId,
  content: initialContent,
  setContent: setInitialContent,
}: TiptapEditorProps) {
  const currentUser = useUserStore((state) => state.user);
  const setActiveUsers = useUserStore((state) => state.setActiveUsers);
  const editor = useEditorStore((state) => state.editor);
  const setEditor = useEditorStore((state) => state.setEditor);

  const userRole = useDocumentStore((state) => state.currentUserRole);

  const ydoc = useRef(new Y.Doc());
  const providerRef = useRef<WebrtcProvider | null>(null);

  useEffect(() => {
    if (!providerRef.current) {
      providerRef.current = new WebrtcProvider(documentId, ydoc.current, {
        signaling: [process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL as string],
      });
    }

    return () => {
      providerRef.current?.destroy();
      providerRef.current = null;
    };
  }, [documentId]);

  useEffect(() => {
    if (!providerRef.current || !currentUser) return;

    const newEditor = new Editor({
      editorProps: {
        attributes: {
          class:
            "focus:outline-none bg-card border rounded-md p-8 shadow min-h-screen",
        },
      },
      extensions: [
        StarterKit.configure({
          history: false,
        }),
        Collaboration.configure({
          document: ydoc.current,
        }),
        CollaborationCursor.configure({
          provider: providerRef.current,
          user: {
            name: currentUser.name,
            color: currentUser.color,
          },
        }),
      ],
      editable: false,
      onUpdate: ({ editor }) => {
        setInitialContent(editor.getHTML());
      },
    });

    setEditor(newEditor);

    providerRef.current.awareness.setLocalStateField("user", {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      color: currentUser.color,
    });

    function onAwarenessChange() {
      if (!providerRef.current) return;

      const awarenessStates = providerRef.current.awareness.getStates();

      const activeUsers: ActiveUser[] = Array.from(
        awarenessStates.values()
      ).map((state) => ({
        id: state.user?.id || "",
        name: state.user?.name || "Anonymous",
        email: state.user?.email || "",
        color: state.user?.color || "#F87171",
      }));

      setActiveUsers(activeUsers);
    }

    providerRef.current.awareness.on("change", onAwarenessChange);
    onAwarenessChange();

    return () => {
      providerRef.current?.awareness.off("change", onAwarenessChange);
      newEditor.destroy();
    };
  }, [currentUser, setActiveUsers, setEditor, setInitialContent]);

  useEffect(() => {
    setTimeout(() => {
      if (!providerRef.current || !editor) return;

      const isFirstPeer = providerRef.current.awareness.getStates().size === 1;

      if (isFirstPeer && initialContent !== editor.getHTML()) {
        editor.commands.setContent(initialContent);
      }

      if (userRole !== AccessRole.VIEWER) {
        editor.setEditable(true);
      }
    }, 5000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerRef, editor, userRole]);

  return <EditorContent editor={editor} />;
}
