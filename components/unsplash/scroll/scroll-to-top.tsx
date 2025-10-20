"use client";
import { useEffect, useState } from "react";

import "./scroll-up.scss";

export function ScrollToTopButton() {
  const [showButton, setShowButton] = useState<Boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showButton && (
        <button onClick={scrollToTop} className="scroll_up">
          <img src="/scroll/scrollUp.png" alt="scrollUp" />
        </button>
      )}
    </>
  );
}
