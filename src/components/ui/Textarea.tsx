import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: Props) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-xl px-3 py-2 min-h-[110px]",
        "bg-white text-black",
        "border border-black/15",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50",
        className,
      ].join(" ")}
    />
  );
}
