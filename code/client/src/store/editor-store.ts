import { type Editor } from "@tiptap/react";
import { create } from "zustand";

type EditorStore = {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  editor: null,

  setEditor: (editor) => {
    set({ editor });
  },
}));
