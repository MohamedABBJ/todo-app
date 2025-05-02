"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex items-center justify-center rounded-md border border-input h-10 w-10 bg-background hover:bg-accent hover:text-accent-foreground"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-md border bg-background shadow-md z-10">
          <div className="p-1">
            <button
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
            >
              <Sun className="mr-2 h-4 w-4" />
              <span>Claro</span>
            </button>
            <button
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
            >
              <Moon className="mr-2 h-4 w-4" />
              <span>Oscuro</span>
            </button>
            <button
              className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
            >
              <Monitor className="mr-2 h-4 w-4" />
              <span>Sistema</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
