"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionProps } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
} & MotionProps;

export function Reveal({ children, className, delay = 0, y = 20, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className, ...props }: { children: ReactNode; className?: string } & MotionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: { children: ReactNode; className?: string } & MotionProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FloatingOrb({
  className,
  duration = 12,
  style,
}: {
  className?: string;
  duration?: number;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn("absolute rounded-full blur-3xl", className)}
      animate={{
        x: [0, 18, -10, 0],
        y: [0, -16, 12, 0],
        scale: [1, 1.05, 0.98, 1],
      }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity }}
      style={style}
    />
  );
}
