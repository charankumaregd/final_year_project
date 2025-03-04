import ScrollToTop from "@/components/ScrollToTop";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
