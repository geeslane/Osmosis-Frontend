'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedProps } from '../types';

export default function Animated({
  activeKey = '',
  children,
  className = '',
}: AnimatedProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
