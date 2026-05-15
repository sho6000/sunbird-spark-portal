import React from 'react';
import { Link } from 'react-router-dom';
import HomeSidebarIcons from '@/components/home/HomeSidebarIcons';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'home',     label: 'Home',     path: '/home',        icon: <HomeSidebarIcons.Home /> },
  { id: 'explore',  label: 'Explore',  path: '/explore',     icon: <HomeSidebarIcons.Explore /> },
  { id: 'learning', label: 'Learning', path: '/my-learning', icon: <HomeSidebarIcons.Learning /> },
  { id: 'profile',  label: 'Profile',  path: '/profile',     icon: <HomeSidebarIcons.Profile /> },
];

interface BottomNavBarProps {
  activeNav: string;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeNav }) => {
  return (
    <nav
      className="sticky bottom-0 z-30 bg-background border-t border-border px-4 py-2 flex justify-around gap-1 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      aria-label="Bottom navigation"
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const active = activeNav === item.id;
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-md text-[11px] font-medium min-w-[64px] transition-colors ${
              active ? 'text-sunbird-theme-accent' : 'text-muted-foreground'
            }`}
            data-edataid={`bottom-nav-${item.id}`}
            data-edatatype="CLICK"
          >
            <span className="w-[22px] h-[22px] inline-flex items-center justify-center">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
