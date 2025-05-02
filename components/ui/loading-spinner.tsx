"use client";

import { useTheme } from "next-themes";
import { ThreeDot } from "react-loading-indicators";

// Loading spinner component with theme-based text color
export function LoadingSpinner() {
  const { theme } = useTheme();
  const textColor = theme == "dark" ? "#ffffff" : "#000000";

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
