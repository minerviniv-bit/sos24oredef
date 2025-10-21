"use client";
import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`h-10 w-full rounded-md border border-white/10 bg-transparent px-3 text-sm text-white placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-white/20 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

