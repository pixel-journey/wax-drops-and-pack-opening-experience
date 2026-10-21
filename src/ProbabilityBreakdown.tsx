'use client';

import React from 'react';

interface ProbabilityItem {
  name: string;
  chance: number;
  color?: string;
}

interface ProbabilityBreakdownProps {
  items: ProbabilityItem[];
  className?: string;
  showExpectedValue?: boolean;
}

/**
 * Clean, accessible probability visualization component.
 * 
 * Best practices implemented:
 * - Visual + textual representation
 * - Progressive disclosure friendly
 * - Accessible color contrast
 * - Easy to extend with more data
 */
export function ProbabilityBreakdown({
  items,
  className = '',
  showExpectedValue = false,
}: ProbabilityBreakdownProps) {
  const totalChance = items.reduce((sum, item) => sum + item.chance, 0);

  return (
    <div className={`space-y-2.5 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-3">
            <div
              className="h-2.5 w-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color || '#22c55e' }}
            />
            <span className="text-foreground">{item.name}</span>
          </div>
          <span className="font-mono tabular-nums text-muted-foreground">
            {(item.chance * 100).toFixed(1)}%
          </span>
        </div>
      ))}

      {showExpectedValue && totalChance > 0 && (
        <div className="pt-2 mt-2 border-t text-xs text-muted-foreground">
          Total probability shown: {(totalChance * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
