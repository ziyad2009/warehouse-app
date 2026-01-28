import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "w-full rounded-xl py-2.5 font-semibold transition active:scale-[0.99]";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-black/90"
      : "bg-transparent text-black border border-black/15 hover:bg-black/5";

  return <button {...props} className={[base, styles, className].join(" ")} />;
}
