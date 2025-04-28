import RenderMarkdown from "@/components/render-markdown";

export default function TermsAndConditions() {
  return (
    <main>
      <div className="border rounded-md p-8">
        <RenderMarkdown fileName="terms-and-conditions.md" />
      </div>
    </main>
  );
}
