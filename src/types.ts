/**
 * Shared TypeScript types for the drop and pack opening examples.
 * 
 * These types help keep the examples consistent and easy to extend.
 */

export interface DropResult {
  id: string;
  item?: string;
  claimed?: boolean;
  [key: string]: any;
}

export interface ProbabilityItem {
  name: string;
  chance: number;
  color?: string;
}

export interface ClaimOptions {
  session: any; // In real usage, this would be WharfKit Session
  dropResult: DropResult;
  updateUI: (result: DropResult) => void;
  onError: (error: any) => void;
  onSuccess?: (result: any) => void;
}

export interface UseDropOpeningReturn {
  isRevealing: boolean;
  result: DropResult | null;
  isClaiming: boolean;
  error: string | null;
  startReveal: () => void;
  completeReveal: (result: DropResult) => void;
  claim: () => Promise<any>;
  reset: () => void;
}
