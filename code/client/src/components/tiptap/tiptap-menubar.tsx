import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  LoaderIcon,
  Strikethrough,
  TextQuote,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useEditorStore } from "@/store/editor-store";
import { useDocumentStore } from "@/store/document-store";
import { AccessRole } from "@prisma/client";

type TiptapMenubarProps = {
  handleUpdate: () => Promise<void>;
};

export default function TiptapMenubar({ handleUpdate }: TiptapMenubarProps) {
  const isUpdating = useDocumentStore((state) => state.isUpdating);
  const editor = useEditorStore((state) => state.editor);
  const userRole = useDocumentStore((state) => state.currentUserRole);

  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Heading4 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      pressed: editor.isActive("heading", { level: 4 }),
    },
    {
      icon: <Heading5 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      pressed: editor.isActive("heading", { level: 5 }),
    },
    {
      icon: <Heading6 />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      pressed: editor.isActive("heading", { level: 6 }),
    },
    {
      icon: <Bold />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <List />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <TextQuote />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: editor.isActive("blockquote"),
    },
    {
      icon: <Code2 />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("codeBlock"),
    },
  ];

  return (
    <div className="flex space-x-2 justify-between">
      <div className="flex overflow-x-scroll">
        {Options.map((option, index) => (
          <Toggle
            size="sm"
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            disabled={userRole === AccessRole.VIEWER}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>
      <Button
        size="sm"
        onClick={handleUpdate}
        disabled={userRole === AccessRole.VIEWER || isUpdating}
      >
        {isUpdating ? <LoaderIcon className="animate-spin" /> : "Save"}
      </Button>
    </div>
  );
}
