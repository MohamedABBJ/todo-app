import React from "react";

// Custom Textarea component with forwarded ref and styling
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => {
  // Combine base textarea styles with any additional classes
  const textareaClasses = `flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  // Render the textarea element
  return <textarea className={textareaClasses} ref={ref} {...props} />;
});

Textarea.displayName = "Textarea";

export { Textarea };
