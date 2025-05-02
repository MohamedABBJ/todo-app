"use client";

import { useTheme } from "next-themes";
import { ThreeDot } from "react-loading-indicators";

export function LoadingSpinner() {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#ffffff" : "#000000"; // Fix the color logic

  return (
    <>
      <ThreeDot
        color="#00d9ff"
        size="large"
        text="Cargando"
        textColor={textColor}
      />
    </>
  );
}
