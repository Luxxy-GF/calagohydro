/* Port of layout/header/UserDropdown; panel actions use the Calagopus providers. */
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from 'react-router';
import Avatar from '@/elements/data-display/Avatar.tsx';
import { useLogoutConfirmation } from '@/elements/useLogoutConfirmation.tsx';
import { isAdmin } from '@/lib/auth/permissions.ts';
import { isNamedRoutePathAccessible } from '@/lib/routes.ts';
import { useAuth } from '@/providers/AuthProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import { useQuickActionsStore } from '@/stores/quickActions.ts';

export default function UserDropdown({ extras }: { extras?: React.ReactNode }) {
  const { user } = useAuth();
  const { t } = useTranslations();
  const navigate = useNavigate();
  const { confirmLogout, logoutModal } = useLogoutConfirmation();
  const { setColorScheme } = useMantineColorScheme();
  const order = useGlobalStore((state) => state.settings.user?.routeOrder);
  const setQuickActionsOpen = useQuickActionsStore((state) => state.setOpen);
  if (!user) return null;
  return (
    <>
      {logoutModal}
      <Menu position='bottom-end' width={260}>
        <Menu.Target>
          <button type='button' className='hydro-user-button'>
            <Avatar src={user.avatar} name={user.username} size={20} />
            <span>{user.email}</span>
            <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => setQuickActionsOpen(true)}>Quick actions</Menu.Item>
          {extras && <div className='hydro-user-extras'>{extras}</div>}
          {!user.suspended && isNamedRoutePathAccessible(order, '/') && (
            <Menu.Item onClick={() => navigate('/account')}>{t('pages.account.account.title', {})}</Menu.Item>
          )}
          {!user.suspended && isAdmin(user) && (
            <Menu.Item onClick={() => navigate('/admin')}>{t('pages.account.admin.title', {})}</Menu.Item>
          )}
          <Menu.Divider />
          <Menu.Item onClick={() => setColorScheme('dark')}>Dark appearance</Menu.Item>
          <Menu.Item onClick={() => setColorScheme('light')}>Light appearance</Menu.Item>
          <Menu.Item onClick={() => setColorScheme('auto')}>System appearance</Menu.Item>
          <Menu.Divider />
          <Menu.Item color='red' onClick={confirmLogout}>
            {t('elements.sidebar.button.logout', {})}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
