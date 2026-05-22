import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMoreHorizontal, FiPieChart, FiLogOut } from 'react-icons/fi';
import HomeSidebarIcons from '@/components/home/HomeSidebarIcons';
import { usePermissions } from '@/hooks/usePermission';
import { useAppI18n } from '@/hooks/useAppI18n';
import { clearForceSyncUsed } from '@/services/forceSyncStorage';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  isLogout?: boolean;
}

interface TopNavBarProps {
  activeNav: string;
}

const VISIBLE_COUNT = 5;

const TopNavBar: React.FC<TopNavBarProps> = ({ activeNav }) => {
  const { hasAnyRole, canAccessFeature } = usePermissions();
  const { t } = useAppI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = hasAnyRole(['ORG_ADMIN']);

  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  const items: NavItem[] = [
    { id: 'home',        label: t('sidebar.home'),           path: '/home',            icon: <HomeSidebarIcons.Home /> },
    { id: 'learning',    label: t('sidebar.myLearning'),     path: '/my-learning',     icon: <HomeSidebarIcons.Learning /> },
    { id: 'explore',     label: t('sidebar.explore'),        path: '/explore',         icon: <HomeSidebarIcons.Explore /> },
    ...(canAccessFeature('view_workspace')
      ? [{ id: 'workspace', label: t('sidebar.workspace'), path: '/workspace', icon: <HomeSidebarIcons.Workspace /> }]
      : []),
    { id: 'profile',     label: t('sidebar.profile'),        path: '/profile',         icon: <HomeSidebarIcons.Profile /> },
    { id: 'user-report', label: t('sidebar.userReport'),     path: '/reports/user/me', icon: <FiPieChart /> },
    ...(isAdmin
      ? [
          { id: 'user-management', label: t('sidebar.userManagement'), path: '/user-management', icon: <HomeSidebarIcons.Users /> },
          { id: 'admin-reports',   label: t('sidebar.adminReports'),   path: '/reports/platform', icon: <HomeSidebarIcons.Reports /> },
        ]
      : []),
    { id: 'help',   label: t('sidebar.helpAndSupport'), path: '/help-support',  icon: <HomeSidebarIcons.Help /> },
    { id: 'logout', label: t('sidebar.logout'),         path: '/portal/logout', icon: <FiLogOut />, isLogout: true },
  ];

  const visible = items.slice(0, VISIBLE_COUNT);
  const overflow = items.slice(VISIBLE_COUNT);

  useEffect(() => {
    if (!overflowOpen) return;
    const onDown = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [overflowOpen]);

  const handleNavClick = (item: NavItem) => {
    if (item.isLogout) {
      clearForceSyncUsed();
      window.location.href = item.path;
      return;
    }
    if (location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  const itemClass = (id: string, extra = '') =>
    `flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${extra} ${
      activeNav === id
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
    }`;

  const renderItem = (item: NavItem, inOverflow = false) => {
    const cls = itemClass(item.id, inOverflow ? 'w-full' : '');
    const icon = <span className="w-[18px] h-[18px] inline-flex items-center justify-center">{item.icon}</span>;

    if (item.isLogout) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => handleNavClick(item)}
          className={cls}
          data-edataid={`top-nav-${item.id}`}
          data-edatatype="CLICK"
        >
          {icon}{item.label}
        </button>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        onClick={inOverflow ? () => setOverflowOpen(false) : undefined}
        className={cls}
        data-edataid={`top-nav-${item.id}`}
        data-edatatype="CLICK"
      >
        {icon}{item.label}
      </Link>
    );
  };

  return (
    <nav
      className="sticky top-[4.5rem] z-30 bg-nav/85 backdrop-blur-md text-nav-foreground border-b border-border/40 px-7 py-2 flex items-center gap-1"
      aria-label="Primary navigation"
    >
      {visible.map((item) => renderItem(item))}

      {overflow.length > 0 && (
        <div className="relative" ref={overflowRef}>
          <button
            type="button"
            onClick={() => setOverflowOpen((o) => !o)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              overflow.some((i) => i.id === activeNav)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
            aria-haspopup="true"
            aria-expanded={overflowOpen}
            aria-label="More navigation"
          >
            <FiMoreHorizontal className="w-[18px] h-[18px]" />
            More
          </button>
          {overflowOpen && (
            <div className="absolute right-0 top-[calc(100%+6px)] min-w-[180px] bg-popover border border-border rounded-md shadow-lg p-1.5 z-50">
              {overflow.map((item) => renderItem(item, true))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
