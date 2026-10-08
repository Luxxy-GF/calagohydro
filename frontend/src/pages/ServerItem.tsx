import {
  faAdd,
  faCheckCircle,
  faCircleXmark,
  faEllipsisVertical,
  faMinus,
  faPlay,
  faRotateRight,
  faSkull,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ComponentProps } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { NavLink } from 'react-router';
import { z } from 'zod';
import ActionIcon from '@/elements/buttons/ActionIcon.tsx';
import Card from '@/elements/data-display/Card.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import ContextMenu, { ContextMenuItem } from '@/elements/overlays/ContextMenu.tsx';
import Tooltip from '@/elements/overlays/Tooltip.tsx';
import RedactedText from '@/elements/typography/RedactedText.tsx';
import { formatAllocation, serverStatusInfo } from '@/lib/domain/server.ts';
import { bytesToString, mbToBytes } from '@/lib/format/size.ts';
import { serverPowerAction, serverSchema } from '@/lib/schemas/server/server.ts';
import ServerAddGroupModal from '@/pages/dashboard/home/modals/ServerAddGroupModal.tsx';
import CoreServerItem from '@/pages/dashboard/home/ServerItem.tsx';
import { useBulkPowerActions } from '@/plugins/server/useBulkPowerActions.ts';
import { useServerListShowOthers } from '@/plugins/server/useServerListShowOthers.ts';
import { useServerStats } from '@/plugins/server/useServerStats.ts';
import { useAuth } from '@/providers/AuthProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useUserStore } from '@/stores/user.ts';

function HydroServerItem({
  server,
  to,
  showGroupAddButton = false,
  showForeignServerBadge = false,
  showContextMenu = false,
  onGroupRemove,
  isSelected = false,
  onSelectionChange,
  onClick,
  showSelection = true,
  sKeyPressedRef,
}: {
  server: z.infer<typeof serverSchema>;
  to?: string;
  showGroupAddButton?: boolean;
  showForeignServerBadge?: boolean;
  showContextMenu?: boolean;
  onGroupRemove?: () => void;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
  showSelection?: boolean;
  sKeyPressedRef?: React.RefObject<boolean>;
}) {
  const { t } = useTranslations();
  const { user } = useAuth();
  const serverGroups = useUserStore((state) => state.serverGroups);
  const [_serverListShowOthers] = useServerListShowOthers();

  const [openModal, setOpenModal] = useState<'add-group' | 'kill' | null>(null);
  const stats = useServerStats(server);

  const availableServerGroups = useMemo(
    () => serverGroups.filter((g) => !g.serverOrder.includes(server.uuid)),
    [serverGroups, server.uuid],
  );

  const { handleBulkPowerAction, bulkActionLoading } = useBulkPowerActions();

  const state = stats?.state;
  const powerBlocked = !!server.status || server.isSuspended || server.isTransferring || server.nodeMaintenanceEnabled;

  const permissionSet = useMemo(
    () => new Set([...server.permissions, ...(user?.role?.serverPermissions ?? [])]),
    [server.permissions, user?.role?.serverPermissions],
  );
  const canPower = useCallback(
    (action: string) => permissionSet.has('*') || permissionSet.has(action),
    [permissionSet],
  );

  const doPowerAction = useCallback(
    (action: z.infer<typeof serverPowerAction>) => handleBulkPowerAction([server.uuid], action),
    [handleBulkPowerAction, server.uuid],
  );

  const _diskLimit =
    server.limits.disk !== 0 ? bytesToString(mbToBytes(server.limits.disk)) : t('common.unlimited', {});
  const _memoryLimit =
    server.limits.memory !== 0 ? bytesToString(mbToBytes(server.limits.memory)) : t('common.unlimited', {});
  const _cpuLimit = server.limits.cpu !== 0 ? `${server.limits.cpu}%` : t('common.unlimited', {});

  const contextMenuItems: ContextMenuItem[] = useMemo(
    () => [
      {
        type: 'action' as const,
        icon: faPlay,
        label: t('common.enum.serverPowerAction.start', {}),
        color: 'gray',
        canAccess: canPower('control.start'),
        disabled: powerBlocked || bulkActionLoading !== null || state !== 'offline',
        onClick: () => doPowerAction('start'),
      },
      {
        type: 'action' as const,
        icon: faRotateRight,
        label: t('common.enum.serverPowerAction.restart', {}),
        canAccess: canPower('control.restart'),
        disabled: powerBlocked || bulkActionLoading !== null || !state,
        onClick: () => doPowerAction('restart'),
      },
      {
        type: 'action' as const,
        icon: faStop,
        label: t('common.enum.serverPowerAction.stop', {}),
        color: 'red',
        canAccess: canPower('control.stop'),
        disabled: powerBlocked || bulkActionLoading !== null || !state || state === 'offline',
        onClick: () => doPowerAction('stop'),
      },
      {
        type: 'action' as const,
        icon: faSkull,
        label: t('common.enum.serverPowerAction.kill', {}),
        color: 'red',
        hidden: state !== 'stopping',
        canAccess: canPower('control.stop'),
        disabled: powerBlocked || bulkActionLoading !== null,
        onClick: () => setOpenModal('kill'),
      },
    ],
    [t, doPowerAction, canPower, powerBlocked, bulkActionLoading, state],
  );

  return (
    <>
      <ServerAddGroupModal server={server} opened={openModal === 'add-group'} onClose={() => setOpenModal(null)} />

      <ConfirmationModal
        opened={openModal === 'kill'}
        onClose={() => setOpenModal(null)}
        title={t('pages.server.console.power.modal.forceStop.title', {})}
        confirm={t('common.button.continue', {})}
        onConfirmed={() => doPowerAction('kill')}
      >
        {t('pages.server.console.power.modal.forceStop.content', {}).md()}
      </ConfirmationModal>

      <ContextMenu enabled={showContextMenu} items={contextMenuItems}>
        {({ items, openMenu }) => (
          <div className='min-w-0'>
            <div
              onClick={onClick}
              onContextMenu={(e) => {
                e.preventDefault();
                openMenu(e.clientX, e.clientY);
              }}
              className='min-w-0'
            >
              <NavLink
                to={to ?? `/server/${server.uuidShort}`}
                className='block min-w-0'
                onClick={(e) => {
                  if (sKeyPressedRef?.current) {
                    e.preventDefault();
                  }
                }}
              >
                <Card className='hydro-source-server-row' data-state={stats?.state ?? 'offline'}>
                  <div className='hydro-source-server-identity'>
                    <div>
                      <h3>{server.name}</h3>
                      <span className='hydro-server-glow' />
                    </div>
                    <p>
                      {server.allocation ? (
                        <RedactedText value={formatAllocation(server.allocation)} />
                      ) : (
                        t('common.server.noAllocation', {})
                      )}
                    </p>
                    {showForeignServerBadge && !server.isOwner && (
                      <span className='hydro-server-owner-badge'>{t('pages.account.home.tooltip.foreign', {})}</span>
                    )}
                  </div>
                  <div className='hydro-source-server-stats'>
                    {server.isSuspended ? (
                      <span>{t('common.server.state.suspended', {})}</span>
                    ) : server.isTransferring ? (
                      <span>{t('common.server.state.transferring', {})}</span>
                    ) : server.nodeMaintenanceEnabled ? (
                      <span>{t('common.server.state.nodeMaintenance', {})}</span>
                    ) : server.status ? (
                      <span>{serverStatusInfo[server.status].label()}</span>
                    ) : !stats ? (
                      <span className='hydro-server-wait'>Sit tight!</span>
                    ) : (
                      <>
                        <div>
                          <span>CPU:</span>
                          <strong>{stats.cpuAbsolute.toFixed(2)}%</strong>
                        </div>
                        <div>
                          <span>RAM:</span>
                          <strong>{bytesToString(stats.memoryBytes)}</strong>
                        </div>
                        <div>
                          <span>Storage:</span>
                          <strong>{bytesToString(stats.diskBytes)}</strong>
                        </div>
                      </>
                    )}
                  </div>
                  <div className='hydro-server-tools'>
                    {' '}
                    {showSelection && (
                      <Tooltip
                        label={
                          isSelected
                            ? t('pages.account.home.bulkActions.deselect', {})
                            : t('pages.account.home.bulkActions.select', {})
                        }
                      >
                        <ActionIcon
                          size='input-sm'
                          variant={isSelected ? undefined : 'light'}
                          color={isSelected ? 'green' : 'gray'}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectionChange?.(!isSelected);
                          }}
                        >
                          <FontAwesomeIcon icon={isSelected ? faCheckCircle : faCircleXmark} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {showGroupAddButton && (
                      <Tooltip
                        label={
                          availableServerGroups.length === 0
                            ? t('pages.account.home.tooltip.noGroups', {})
                            : t('pages.account.home.tooltip.addToGroup', {})
                        }
                        className='ml-2'
                      >
                        <ActionIcon
                          size='input-sm'
                          variant='light'
                          disabled={availableServerGroups.length === 0}
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenModal('add-group');
                          }}
                        >
                          <FontAwesomeIcon icon={faAdd} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {onGroupRemove && (
                      <Tooltip label={t('pages.account.home.tooltip.removeFromGroup', {})} className='ml-2'>
                        <ActionIcon
                          size='input-sm'
                          color='red'
                          variant='light'
                          onClick={(e) => {
                            e.preventDefault();
                            onGroupRemove();
                          }}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    {showContextMenu && items.some((item) => !item.hidden && item.canAccess !== false) && (
                      <Tooltip label={t('common.form.powerAction', {})} className='ml-2'>
                        <ActionIcon
                          size='input-sm'
                          variant='light'
                          color='gray'
                          loading={bulkActionLoading !== null}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            openMenu(rect.left, rect.bottom);
                          }}
                        >
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </div>
                </Card>
              </NavLink>
            </div>
          </div>
        )}
      </ContextMenu>
    </>
  );
}

// Vite overrides are installed at build time; disabling the theme restores the core row.
export default function ServerItem(props: ComponentProps<typeof CoreServerItem>) {
  if (!window.extensionContext.extensions.some((extension) => extension.packageName === 'com.luxxy.hydrodactyl'))
    return <CoreServerItem {...props} />;
  return <HydroServerItem {...props} />;
}
