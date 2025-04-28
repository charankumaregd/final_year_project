type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex items-center justify-center min-h-screen">
      {children}
    </main>
  );
}
