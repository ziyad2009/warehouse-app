import React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[
        "rounded-2xl bg-white text-black border border-black/10 shadow-sm",
        className,
      ].join(" ")}
    />
  );
}
