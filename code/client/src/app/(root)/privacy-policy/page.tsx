import RenderMarkdown from "@/components/render-markdown";

export default function PrivacyPolicy() {
  return (
    <main>
      <div className="border rounded-md p-8">
        <RenderMarkdown fileName="privacy-policy.md" />
      </div>
    </main>
  );
}
