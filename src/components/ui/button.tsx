"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonVariant = "default" | "secondary" | "destructive" | "outline";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", asChild, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<ButtonVariant, string> = {
      default: "bg-white text-black hover:bg-white/90",
      secondary: "bg-white/10 text-white hover:bg-white/20",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-white/20 text-white hover:bg-white/5",
    };
    const cls = `${base} ${variants[variant]} ${className}`;

    const Comp: React.ElementType = asChild ? Slot : "button";

    return (
      <Comp
        // il ref rimane tipizzato su HTMLButtonElement, senza any
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cls}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

