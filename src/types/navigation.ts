import type { LucideIcon } from 'lucide-react';

export type NavCategoryKey =
  | 'overview'
  | 'monsoon-climate'
  | 'precipitation'
  | 'agriculture'
  | 'operations'
  | 'data'
  | 'core'
  | 'hydrology'
  | 'decision-support'
  | 'intelligence';

export interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  category: NavCategoryKey;
  badge?: string;
}

export interface NavCategory {
  id: string;
  title: string;
  items: NavItem[];
}

