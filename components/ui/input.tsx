import { InputHTMLAttributes, forwardRef } from "react";

// Custom Input component with forwarded ref and styling
const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", type, ...props }, ref) => {
  // Combine base input styles with any additional classes
  const inputClasses = `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  // Render the input element
  return <input type={type} className={inputClasses} ref={ref} {...props} />;
});

Input.displayName = "Input";

export { Input };
