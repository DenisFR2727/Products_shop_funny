import { motion } from "framer-motion";
import Link from "next/link";

export default function LinkItemMotionHover({
  path,
  children,
  className,
}: {
  path: string;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <Link href={path}>
      <motion.span
        className={className}
        whileHover={{
          y: -2,
          scale: 1.06,
          color: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0.18)",
          boxShadow: "0 6px 14px rgba(0, 0, 0, 0.18)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
