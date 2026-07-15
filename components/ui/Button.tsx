"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blush text-ink shadow-lg shadow-blush/40 hover:bg-blushdeep hover:text-white",
  secondary: "bg-skyblue text-skydeep shadow-lg shadow-skyblue/40 hover:bg-skydeep hover:text-white",
  ghost: "bg-white text-ink shadow-md hover:bg-blushsoft",
};

/** Big, bouncy button — child targets are min 44px tall and generously padded. */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "min-h-12 rounded-3xl px-8 py-4 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blush/60",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
