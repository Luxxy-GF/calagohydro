/* Port of Hydrodactyl layout/header/AppHeader and layout/sidebar/Sidebar.
 * Calagopus supplies the route/permission tree; its link context menus remain intact.
 */
import { Menu01Icon, Search01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { ActionIcon, Drawer } from '@mantine/core';
import {
  Children,
  type ComponentProps,
  cloneElement,
  isValidElement,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { NavLink, useLocation } from 'react-router';
import CoreSidebar from '@/elements/navigation/Sidebar.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import { useQuickActionsStore } from '@/stores/quickActions.ts';
import { useRelativePageStore } from '@/stores/relativePage.ts';
import { useHeaderSlots } from './headerSlots.ts';
import Logo from './Logo.tsx';
import PowerButtons from './PowerButtons.tsx';
import { useSidebarPreference } from './preferences.ts';
import ServerHeader from './ServerHeader.tsx';
import UserDropdown from './UserDropdown.tsx';

function routes(node: ReactNode, utility: boolean, adminPage: boolean): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement<{ to?: string; children?: ReactNode }>(child)) return null;
    if (child.type === CoreSidebar.Link) {
      const to = child.props.to ?? '';
      const isUtility = to === '/' || (!adminPage && to.startsWith('/admin'));
      return isUtility === utility ? child : null;
    }
    if (child.props.children && typeof child.props.children !== 'function') {
      return cloneElement(child, { children: routes(child.props.children, utility, adminPage) });
    }
    return null;
  });
}

export default function Sidebar({ header, children, footer }: ComponentProps<typeof CoreSidebar>) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useSidebarPreference();
  const [mobileOpen, setMobileOpen] = useState(false);
  const quickActionsOpen = useQuickActionsStore((state) => state.open);
  const setQuickActionsOpen = useQuickActionsStore((state) => state.setOpen);
  const pageHeader = useRelativePageStore((state) => state.pageHeader);
  const setHasMobileNavbar = useRelativePageStore((state) => state.setHasMobileNavbar);
  const appName = useGlobalStore((state) => state.settings.app.name);
  const slots = useHeaderSlots();
  const serverPage = pathname.startsWith('/server/');
  const consolePage = serverPage && pathname.split('/').filter(Boolean).length === 2;
  const adminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const primary = routes(children, false, adminPage);
  const utility = (
    <>
      {routes(header, true, adminPage)}
      {routes(children, true, adminPage)}
    </>
  );

  useEffect(() => {
    document.body.dataset.sidebarMinimized = String(collapsed);
  }, [collapsed]);
  useEffect(() => {
    setHasMobileNavbar(true);
    return () => setHasMobileNavbar(false);
  }, [setHasMobileNavbar]);
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (quickActionsOpen) setMobileOpen(false);
  }, [quickActionsOpen]);

  const navigation = (
    <>
      <nav
        className='hydro-sidebar-navigation'
        aria-label='Panel navigation'
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('a[href]')) setMobileOpen(false);
        }}
      >
        {primary}
      </nav>
      <nav className='hydro-sidebar-utility' aria-label='Panel shortcuts'>
        {utility}
      </nav>
    </>
  );

  return (
    <>
      <header className='hydro-app-header' data-collapsed={collapsed}>
        <div className='hydro-header-brand'>
          <NavLink to='/' className='hydro-logo-link' aria-label={`${appName} home page`}>
            <Logo />
            <span>{appName}</span>
          </NavLink>
          <button
            type='button'
            className='hydro-sidebar-toggle'
            aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
              <rect x='2' y='3' width='12' height='10' rx='2' stroke='currentColor' />
              <path d='M6 3v10' stroke='currentColor' />
            </svg>
          </button>
        </div>
        <ActionIcon
          className='hydro-mobile-toggle'
          aria-label='Open navigation'
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          variant='subtle'
        >
          <HugeiconsIcon icon={Menu01Icon} size={20} />
        </ActionIcon>
        {serverPage ? (
          <ServerHeader />
        ) : slots.center ? (
          <div className='hydro-header-center'>{slots.center}</div>
        ) : (
          <div className='hydro-header-page'>{pageHeader?.title}</div>
        )}
        <div className='hydro-header-actions'>
          {!serverPage && slots.right}
          {consolePage && (
            <div className='hydro-desktop-power'>
              <PowerButtons />
            </div>
          )}
          <button
            type='button'
            className='hydro-search-button'
            aria-label='Quick actions'
            onClick={() => setQuickActionsOpen(true)}
          >
            <HugeiconsIcon icon={Search01Icon} size={18} />
          </button>
          <UserDropdown extras={footer} />
        </div>
      </header>
      <aside className='hydro-sidebar hydro-sidebar-desktop' data-collapsed={collapsed} data-admin={adminPage}>
        {navigation}
      </aside>
      <Drawer opened={mobileOpen} onClose={() => setMobileOpen(false)} title='Navigation' size={300} padding={0}>
        <div className='hydro-sidebar hydro-sidebar-mobile' data-collapsed='false'>
          {navigation}
        </div>
      </Drawer>
      {!adminPage && (
        <nav className='hydro-bottom-nav' aria-label='Primary navigation'>
          {primary}
        </nav>
      )}
    </>
  );
}
