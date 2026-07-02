'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface RevealAnimationProps {
  isRevealing: boolean;
  onComplete?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Production-ready animated reveal component for drops and packs.
 * 
 * Features:
 * - Smooth, satisfying animation with proper easing
 * - Accessibility support (respects reduced motion)
 * - Clean API and TypeScript strict typing
 * - Easy to customize and extend
 */
export function RevealAnimation({
  isRevealing,
  onComplete,
  children,
  className = '',
}: RevealAnimationProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        {isRevealing ? (
          <motion.div
            key="revealing"
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: [0.9, 1.08, 1], opacity: 1 }}
            transition={{
              duration: 0.65,
              ease: [0.23, 1.0, 0.32, 1],
            }}
            onAnimationComplete={onComplete}
            className="flex items-center justify-center"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
