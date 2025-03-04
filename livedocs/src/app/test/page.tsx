import TestClient from "./TestClient";

// Fetch data on the server
async function getTests() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/test`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch test entries");
  return res.json();
}

export default async function TestPage() {
  const tests = await getTests();

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Prisma Test Page</h1>
      <TestClient initialTests={tests} />
    </div>
  );
}
