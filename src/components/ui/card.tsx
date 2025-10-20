"use client";
import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type HProps = React.HTMLAttributes<HTMLHeadingElement>;

export function Card({ className = "", children, ...props }: DivProps) {
  return (
    <div className={`rounded-2xl border border-white/10 ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardHeader({ className = "", children, ...props }: DivProps) {
  return (
    <div className={`px-4 pt-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
export function CardTitle({ className = "", children, ...props }: HProps) {
  return (
    <h3 className={`text-base font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
}
export function CardContent({ className = "", children, ...props }: DivProps) {
  return (
    <div className={`px-4 pb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
