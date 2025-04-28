import { LoaderIcon } from "lucide-react";

type LoaderProps = {
  text?: string;
};

export default function Loader({ text }: LoaderProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-muted-foreground text-xs space-y-2">
      <LoaderIcon className="animate-spin w-6 h-6" />
      <p className="font-medium">{text || "Loading"}...</p>
    </main>
  );
}
