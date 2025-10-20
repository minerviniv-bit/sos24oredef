// src/components/ui/select.tsx
"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

/** mini helper per unire classi senza dipendenze */
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// Root
export const Select = SelectPrimitive.Root;

// Trigger (bottone che apre il menu)
export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cx(
      "inline-flex h-10 w-full items-center justify-between rounded-md",
      "border border-white/10 bg-[#0b1020] px-3 py-2 text-sm text-white shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-indigo-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    {/* caret semplice, no icone esterne */}
    <SelectPrimitive.Icon>
      <span className="ml-2 text-xs opacity-60">▾</span>
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

// Content (menu a tendina)
export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cx(
        "z-50 min-w-[8rem] overflow-hidden rounded-md",
        "border border-white/10 bg-[#0b1020] text-white shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1",
        className
      )}
      sideOffset={6}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

// Item (singola voce)
export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cx(
      "relative flex w-full select-none items-center rounded-sm px-2 py-1.5",
      "cursor-pointer text-sm text-white outline-none",
      "focus:bg-indigo-600 focus:text-white",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator className="absolute right-2">
      {/* spunta semplice, no icone esterne */}
      <span>✓</span>
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

// Value (testo selezionato nel trigger)
export const SelectValue = SelectPrimitive.Value;
