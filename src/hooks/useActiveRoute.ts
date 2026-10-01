import { useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../data/navigationItems';
import type { NavItem } from '../types/navigation';

export function useActiveRoute(): {
  currentPath: string;
  activeItem: NavItem | undefined;
  pageTitle: string;
  pageDescription: string;
} {
  const location = useLocation();
  const currentPath = location.pathname;

  const activeItem = NAVIGATION_ITEMS.find((item) => item.href === currentPath) || NAVIGATION_ITEMS[0];

  return {
    currentPath,
    activeItem,
    pageTitle: activeItem ? activeItem.name : 'MONSOON-X',
    pageDescription: activeItem ? activeItem.description : '',
  };
}
