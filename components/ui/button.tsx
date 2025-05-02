import { ButtonProps } from "@/lib/interfaces";
import React from "react";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "rounded-xl inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    let variantClasses = "";
    switch (variant) {
      case "default":
        variantClasses =
          "bg-primary text-primary-foreground hover:bg-primary/90";
        break;
      case "destructive":
        variantClasses =
          "bg-destructive text-destructive-foreground hover:bg-destructive/90";
        break;
      case "outline":
        variantClasses =
          "border border-input hover:bg-accent hover:text-accent-foreground";
        break;
    }

    let sizeClasses = "";
    switch (size) {
      case "default":
        sizeClasses = "h-10 py-2 px-4";
        break;
      case "sm":
        sizeClasses = "h-9 px-3 rounded-md text-sm";
        break;
      case "lg":
        sizeClasses = "h-11 px-8 rounded-md";
        break;
      case "icon":
        sizeClasses = "h-10 w-10";
        break;
    }

    const allClasses = `${baseStyles} ${variantClasses} ${sizeClasses} ${className}`;

    return (
      <button className={allClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
