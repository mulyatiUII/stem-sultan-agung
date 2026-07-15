"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global client providers. MotionConfig honors the OS "reduce motion"
 * setting for every Framer Motion animation — the CSS media query alone
 * can't stop JS-driven transforms.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
