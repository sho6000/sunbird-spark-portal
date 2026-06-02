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

interface BottomNavBarProps {
  activeNav: string;
}

const VISIBLE_COUNT = 4;

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeNav }) => {
  const { hasAnyRole, canAccessFeature } = usePermissions();
  const { t } = useAppI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = hasAnyRole(['ORG_ADMIN']);

  const [overflowOpen, setOverflowOpen] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  const items: NavItem[] = [
    { id: 'home',        label: t('sidebar.home'),       path: '/home',        icon: <HomeSidebarIcons.Home /> },
    { id: 'explore',     label: t('sidebar.explore'),    path: '/explore',     icon: <HomeSidebarIcons.Explore /> },
    { id: 'learning',    label: t('sidebar.myLearning'), path: '/my-learning', icon: <HomeSidebarIcons.Learning /> },
    ...(canAccessFeature('view_workspace')
      ? [{ id: 'workspace', label: t('sidebar.workspace'), path: '/workspace', icon: <HomeSidebarIcons.Workspace /> }]
      : []),
    { id: 'profile',     label: t('sidebar.profile'),    path: '/profile',     icon: <HomeSidebarIcons.Profile /> },
    { id: 'user-report', label: t('sidebar.userReport'), path: '/reports/user/me', icon: <FiPieChart /> },
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

  const itemClass = (id: string) =>
    `flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] font-medium min-w-[64px] transition-colors ${
      activeNav === id ? 'text-sunbird-theme-accent font-semibold' : 'text-muted-foreground'
    }`;

  // Material-style pill behind the active icon — gives a clear, lifted
  // highlight without overpowering the bar.
  const iconWrapClass = (id: string) =>
    `relative w-12 h-7 inline-flex items-center justify-center rounded-pill transition-all ${
      activeNav === id
        ? 'bg-sunbird-theme-accent/15 text-sunbird-theme-accent shadow-sunbird-sm'
        : 'text-current'
    }`;

  const overflowItemClass = (id: string) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors w-full ${
      activeNav === id
        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
        : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
    }`;

  const renderVisible = (item: NavItem) => (
    <Link
      key={item.id}
      to={item.path}
      className={itemClass(item.id)}
      data-edataid={`bottom-nav-${item.id}`}
      data-edatatype="CLICK"
      aria-current={activeNav === item.id ? 'page' : undefined}
    >
      <span className={iconWrapClass(item.id)}>
        <span className="w-[22px] h-[22px] inline-flex items-center justify-center">{item.icon}</span>
      </span>
      {item.label}
    </Link>
  );

  const renderOverflow = (item: NavItem) => {
    const icon = <span className="w-[18px] h-[18px] inline-flex items-center justify-center">{item.icon}</span>;
    if (item.isLogout) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => { setOverflowOpen(false); handleNavClick(item); }}
          className={overflowItemClass(item.id)}
          data-edataid={`bottom-nav-${item.id}`}
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
        onClick={() => setOverflowOpen(false)}
        className={overflowItemClass(item.id)}
        data-edataid={`bottom-nav-${item.id}`}
        data-edatatype="CLICK"
      >
        {icon}{item.label}
      </Link>
    );
  };

  return (
    <nav
      className="sticky bottom-0 z-30 bg-nav/85 backdrop-blur-md text-nav-foreground border-t border-border/40 px-4 py-2 flex justify-around gap-1 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      aria-label="Bottom navigation"
    >
      {visible.map(renderVisible)}

      {overflow.length > 0 && (
        <div className="relative" ref={overflowRef}>
          <button
            type="button"
            onClick={() => setOverflowOpen((o) => !o)}
            className={`${itemClass('__more__')} ${overflow.some((i) => i.id === activeNav) ? 'text-sunbird-theme-accent font-semibold' : ''}`}
            aria-haspopup="true"
            aria-expanded={overflowOpen}
            aria-label="More navigation"
          >
            <span className={`relative w-12 h-7 inline-flex items-center justify-center rounded-pill transition-all ${
              overflow.some((i) => i.id === activeNav) || overflowOpen
                ? 'bg-sunbird-theme-accent/15 text-sunbird-theme-accent shadow-sunbird-sm'
                : ''
            }`}>
              <FiMoreHorizontal className="w-[22px] h-[22px]" />
            </span>
            More
          </button>
          {overflowOpen && (
            <div className="absolute right-0 bottom-[calc(100%+6px)] min-w-[200px] bg-popover border border-border rounded-md shadow-lg p-1.5 z-50">
              {overflow.map(renderOverflow)}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default BottomNavBar;
