// src/components/ui/KindleCard.tsx
import { ComponentProps, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface KindleCardProps extends ComponentProps<typeof motion.div> {
  isActive: boolean;
  children: ReactNode;
}

const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 25
};

export const KindleCard = ({ isActive, children, className = '', ...props }: KindleCardProps) => {
  return (
    <motion.div
      layout
      transition={springConfig}
      className={`relative flex flex-col p-5 bg-zinc-900 border border-zinc-800 rounded-none ${isActive ? 'animate-kindle-breathe' : 'opacity-50'} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};