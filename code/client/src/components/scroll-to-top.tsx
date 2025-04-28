"use client";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  function handleScroll() {
    if (window.scrollY > window.innerHeight) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    isVisible && (
      <Button
        size="icon"
        onClick={scrollToTop}
        className="container mx-auto fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 rounded-full"
      >
        <ArrowUp />
      </Button>
    )
  );
}
