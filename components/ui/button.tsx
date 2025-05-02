import { ButtonProps } from "@/lib/interfaces";
import React from "react";

// Custom Button component with support for variants and sizes
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
    // Base styles for all buttons
    const baseStyles =
      "rounded-xl inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    // Styles based on the variant prop
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

    // Styles based on the size prop
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

    // Combine all classes to create the final button styles
    const allClasses = `${baseStyles} ${variantClasses} ${sizeClasses} ${className}`;

    // Render the button element
    return (
      <button className={allClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
