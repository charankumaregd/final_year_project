export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      {children}
    </main>
  );
}
