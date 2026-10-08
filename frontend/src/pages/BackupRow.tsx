// Row layout ported from Hydrodactyl components/server/backups; Calagopus controller retained.

import {
  faFileArrowDown,
  faFileExport,
  faInfo,
  faPencil,
  faRotateLeft,
  faShare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Archive, Eye, Lock, TrashBin } from '@gravity-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useMemo, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import deleteBackup from '@/api/server/backups/deleteBackup.ts';
import downloadBackup from '@/api/server/backups/downloadBackup.ts';
import Button from '@/elements/buttons/Button.tsx';
import { ServerCan } from '@/elements/Can.tsx';
import BackupRetentionStatusBadge from '@/elements/data-display/BackupRetentionStatusBadge.tsx';
import BackupSourceLabel from '@/elements/data-display/BackupSourceLabel.tsx';
import Badge from '@/elements/data-display/Badge.tsx';
import { TableData, TableRow, TableSelectionCell } from '@/elements/data-display/Table.tsx';
import HljsCode from '@/elements/editors/HljsCode.tsx';
import Progress from '@/elements/feedback/Progress.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import { Modal, ModalFooter } from '@/elements/modals/Modal.tsx';
import ContextMenu, { ContextMenuToggle } from '@/elements/overlays/ContextMenu.tsx';
import FormattedTimestamp from '@/elements/time/FormattedTimestamp.tsx';
import { serverBackupKindLabelMapping, streamingArchiveFormatLabelMapping } from '@/lib/enums.ts';
import { bytesToString } from '@/lib/format/size.ts';
import { downloadUrl } from '@/lib/network/url.ts';
import { queryKeys } from '@/lib/queryKeys.ts';
import { streamingArchiveFormat } from '@/lib/schemas/generic.ts';
import { serverBackupSchema } from '@/lib/schemas/server/backups.ts';
import { BackupColumns } from '@/pages/server/backups/columns.ts';
import BackupEditModal from '@/pages/server/backups/modals/BackupEditModal.tsx';
import BackupExportModal from '@/pages/server/backups/modals/BackupExportModal.tsx';
import BackupRestoreModal from '@/pages/server/backups/modals/BackupRestoreModal.tsx';
import DatabaseInstanceBackupRestoreModal from '@/pages/server/databases/instances/modals/DatabaseInstanceBackupRestoreModal.tsx';
import { useServerCan } from '@/plugins/usePermissions.ts';
import { SocketEvent } from '@/plugins/websocket/useWebsocketEvent.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

const loadJsonLanguage = () => import('highlight.js/lib/languages/json').then((mod) => mod.default);

interface BackupRowProps {
  backup: z.infer<typeof serverBackupSchema>;
  backupGroupName?: string;
  columns: BackupColumns;
  readOnly?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

const BackupRow = forwardRef<HTMLTableRowElement, BackupRowProps>(function BackupRow(
  { backup, backupGroupName, columns, readOnly, isSelected = false, onSelectionChange },
  ref,
) {
  const { t } = useTranslations();
  const { addToast } = useToast();

  const server = useServerStore((state) => state.server);
  const socketInstance = useServerStore((state) => state.socketInstance);
  const updateBackup = useServerStore((state) => state.updateBackup);
  const progress = useServerStore((state) => state.backupProgress.get(backup.uuid));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const _canReadDatabaseInstances = useServerCan('database-instances.read');

  const [openModal, setOpenModal] = useState<
    'edit' | 'restore' | 'restoreDatabase' | 'export' | 'delete' | 'metadata' | null
  >(null);
  const metadataJson = useMemo(() => JSON.stringify(backup.metadata, null, 2), [backup.metadata]);

  const doDownload = (archiveFormat: z.infer<typeof streamingArchiveFormat>) => {
    downloadBackup(server.uuid, backup.uuid, archiveFormat)
      .then(({ url }) => {
        addToast(t('pages.server.backups.toast.downloadStarted', {}), 'success');
        downloadUrl(url);
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  const waitForBackupDeleted = (uuid: string) =>
    new Promise<boolean>((resolve) => {
      if (!socketInstance) {
        resolve(false);
        return;
      }

      let timeout: ReturnType<typeof setTimeout>;
      const listener = (eventUuid: string) => {
        if (eventUuid !== uuid) return;

        clearTimeout(timeout);
        socketInstance.removeListener(SocketEvent.BACKUP_DELETED, listener);
        resolve(true);
      };

      timeout = setTimeout(() => {
        socketInstance.removeListener(SocketEvent.BACKUP_DELETED, listener);
        resolve(false);
      }, 1000);

      socketInstance.addListener(SocketEvent.BACKUP_DELETED, listener);
    });

  const doDelete = async () => {
    try {
      await deleteBackup(server.uuid, backup.uuid);
    } catch (msg) {
      addToast(httpErrorToHuman(msg), 'error');
      return;
    }

    setOpenModal(null);

    const deleted = await waitForBackupDeleted(backup.uuid);
    if (deleted) {
      addToast(t('pages.server.backups.modal.deleteBackup.toast.deleted', {}), 'success');
    } else {
      addToast(t('pages.server.backups.modal.deleteBackup.toast.started', {}), 'success');
      updateBackup(backup.uuid, { deletionStatus: 'deleting' });
    }

    queryClient.invalidateQueries({ queryKey: queryKeys.server(server.uuid).backups.all() });
  };

  const isFailed = !backup.isSuccessful && !!backup.completed;
  const isDeleting = backup.deletionStatus === 'deleting';
  const isDeleteFailed = backup.deletionStatus === 'failed';
  const streamingDownload = backup.kind === 'server' && backup.isStreaming;

  return (
    <>
      <BackupEditModal backup={backup} opened={openModal === 'edit'} onClose={() => setOpenModal(null)} />
      <BackupRestoreModal backup={backup} opened={openModal === 'restore'} onClose={() => setOpenModal(null)} />
      <DatabaseInstanceBackupRestoreModal
        backup={backup}
        opened={openModal === 'restoreDatabase'}
        onClose={() => setOpenModal(null)}
      />
      <BackupExportModal backup={backup} opened={openModal === 'export'} onClose={() => setOpenModal(null)} />

      <Modal
        title={t('pages.server.backups.modal.viewMetadata.title', {})}
        onClose={() => setOpenModal(null)}
        opened={openModal === 'metadata'}
        size='lg'
      >
        <HljsCode languageName='json' language={loadJsonLanguage}>
          {metadataJson}
        </HljsCode>

        <ModalFooter>
          <Button variant='default' onClick={() => setOpenModal(null)}>
            {t('common.button.close', {})}
          </Button>
        </ModalFooter>
      </Modal>

      <ConfirmationModal
        opened={openModal === 'delete'}
        onClose={() => setOpenModal(null)}
        title={t('pages.server.backups.modal.deleteBackup.title', {})}
        confirm={t('common.button.delete', {})}
        onConfirmed={doDelete}
      >
        {t('pages.server.backups.modal.deleteBackup.content', {
          name: backup.name,
        }).md()}
      </ConfirmationModal>

      <ContextMenu
        items={[
          {
            type: 'action',
            icon: faPencil,
            label: t('common.button.edit', {}),
            hidden: readOnly || isDeleting || isDeleteFailed,
            onClick: () => setOpenModal('edit'),
            color: 'gray',
            canAccess: useServerCan('backups.update'),
          },
          {
            type: 'action',
            icon: faShare,
            label: t('pages.server.backups.button.browse', {}),
            hidden:
              backup.kind !== 'server' ||
              !backup.completed ||
              !backup.isBrowsable ||
              isFailed ||
              isDeleting ||
              isDeleteFailed,
            onClick: () =>
              navigate(
                `/server/${server?.uuidShort}/files?${createSearchParams({
                  directory: `/.backups/${backup.uuid}`,
                })}`,
              ),
            color: 'gray',
            canAccess: useServerCan('files.read'),
          },
          {
            type: 'action',
            icon: faFileArrowDown,
            label: t('common.button.download', {}),
            hidden: !backup.completed || isFailed || isDeleting || isDeleteFailed,
            onClick: !streamingDownload ? () => doDownload('tar_gz') : undefined,
            color: 'gray',
            items: streamingDownload
              ? Object.entries(streamingArchiveFormatLabelMapping).map(([mime, label]) => ({
                  type: 'action',
                  icon: faFileArrowDown,
                  label: t('common.button.downloadAs', { format: label }),
                  onClick: () => doDownload(mime as z.infer<typeof streamingArchiveFormat>),
                  color: 'gray',
                }))
              : [],
            canAccess: useServerCan('backups.download'),
          },
          {
            type: 'action',
            icon: faRotateLeft,
            label: t('common.button.restore', {}),
            hidden: !backup.completed || isFailed || isDeleting || isDeleteFailed,
            onClick: () => setOpenModal(backup.kind === 'server' ? 'restore' : 'restoreDatabase'),
            color: 'gray',
            canAccess: useServerCan('backups.restore'),
          },
          {
            type: 'action',
            icon: faFileExport,
            label: t('pages.server.backups.button.exportToFiles', {}),
            hidden: backup.kind !== 'server' || !backup.completed || isFailed || isDeleting || isDeleteFailed,
            onClick: () => setOpenModal('export'),
            color: 'gray',
            canAccess: useServerCan(['backups.download', 'files.create'], false),
          },
          {
            type: 'action',
            icon: faInfo,
            label: t('pages.server.backups.modal.viewMetadata.title', {}),
            hidden: backup.kind !== 'server' || Object.keys(backup.metadata).length === 0,
            onClick: () => setOpenModal('metadata'),
            color: 'gray',
          },
          {
            type: 'action',
            icon: faTrash,
            label: t('common.button.delete', {}),
            hidden: readOnly || !backup.completed || isDeleting,
            disabled: backup.isLocked,
            onClick: () => setOpenModal('delete'),
            color: 'red',
            canAccess: useServerCan('backups.delete'),
          },
        ]}
        registry={window.extensionContext.extensionRegistry.pages.server.backups.backupContextMenu}
        registryProps={{ backup }}
      >
        {({ items, openMenu }) => (
          <TableRow
            ref={ref}
            className={`hydro-resource-row ${isDeleting ? 'opacity-50' : ''}`}
            bg={isSelected ? 'var(--mantine-color-blue-light)' : undefined}
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(e.clientX, e.clientY);
            }}
          >
            {onSelectionChange !== undefined && (
              <TableSelectionCell id={backup.uuid} checked={isSelected} onChange={onSelectionChange} />
            )}
            <TableData colSpan={100}>
              <div className='hydro-item'>
                <div className='hydro-item-icon'>
                  <Archive width={22} height={22} />
                </div>
                <div className='hydro-item-copy'>
                  <div className='hydro-item-title'>
                    <h3>{backup.name}</h3>
                    {backup.isLocked && <Lock width={14} height={14} />}
                    {isFailed && <Badge color='red'>{t('common.badge.failed', {})}</Badge>}
                    {isDeleting && <Badge color='red'>Deleting</Badge>}
                    {isDeleteFailed && <Badge color='red'>Deletion failed</Badge>}
                  </div>
                  {backup.checksum && <p className='hydro-checksum'>{backup.checksum}</p>}
                  <p>
                    <FormattedTimestamp timestamp={backup.created} /> · {bytesToString(backup.bytes)}
                    {columns.kind && <> · {serverBackupKindLabelMapping[backup.kind]}</>}
                    {columns.source && (
                      <>
                        {' '}
                        · <BackupSourceLabel backup={backup} />
                      </>
                    )}
                    {columns.files && backup.completed && <> · {backup.files} files</>}
                  </p>
                  {columns.retention && <BackupRetentionStatusBadge status={backup.retentionStatus} />}
                  {!backup.completed && !isDeleting && (
                    <Progress
                      indeterminate={!progress?.total}
                      value={progress?.total ? (progress.progress / progress.total) * 100 : 0}
                    />
                  )}
                </div>
                <div className='hydro-item-actions'>
                  <ServerCan action='backups.read'>
                    <Button
                      variant='default'
                      aria-label={t('common.button.details', {})}
                      onClick={() => setOpenModal('metadata')}
                    >
                      <Eye width={22} height={22} />
                    </Button>
                  </ServerCan>
                  <ServerCan action='backups.delete'>
                    <Button
                      color='red'
                      aria-label={t('common.button.delete', {})}
                      disabled={backup.isLocked || readOnly || isDeleting}
                      onClick={() => setOpenModal('delete')}
                    >
                      <TrashBin width={22} height={22} />
                    </Button>
                  </ServerCan>
                </div>
              </div>
            </TableData>
            <ContextMenuToggle items={items} openMenu={openMenu} />
          </TableRow>
        )}
      </ContextMenu>
    </>
  );
});

export default BackupRow;
