"use client";
import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`min-h-[80px] w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-white/20 ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
