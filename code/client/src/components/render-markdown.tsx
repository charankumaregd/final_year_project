"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type RenderMarkdownProps = {
  fileName?: string;
  content?: string;
};

export default function RenderMarkdown({
  fileName,
  content,
}: RenderMarkdownProps) {
  const [markdownContent, setMarkdownContent] = useState(content || "");

  useEffect(() => {
    if (fileName && !content) {
      fetch(`/markdowns/${fileName}`)
        .then((res) => res.text())
        .then(setMarkdownContent)
        .catch((err) => {
          console.error("Error loading markdown file:", err);
          setMarkdownContent("Error loading content.");
        });
    }
  }, [fileName, content]);

  return (
    <div className="markdown">
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
}
