import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  category: 'core' | 'hydrology' | 'decision-support' | 'intelligence';
  badge?: string;
}

export interface NavCategory {
  id: string;
  title: string;
  items: NavItem[];
}
