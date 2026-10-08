import { faBan, faCheck, faClone, faCopy, faPencil, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Key, Pencil, TrashBin } from '@gravity-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import deleteApiKey from '@/api/me/api-keys/deleteApiKey.ts';
import recreateApiKey from '@/api/me/api-keys/recreateApiKey.ts';
import updateApiKey from '@/api/me/api-keys/updateApiKey.ts';
import Button from '@/elements/buttons/Button.tsx';
import CopyOnClick from '@/elements/CopyOnClick.tsx';
import Badge from '@/elements/data-display/Badge.tsx';
import { TableData, TableRow, TableSelectionCell } from '@/elements/data-display/Table.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import ContextMenu, { ContextMenuToggle } from '@/elements/overlays/ContextMenu.tsx';
import FormattedTimestamp from '@/elements/time/FormattedTimestamp.tsx';
import { handleRawCopyToClipboard } from '@/lib/clipboard/copy.ts';
import { queryKeys } from '@/lib/queryKeys.ts';
import { userApiKeySchema } from '@/lib/schemas/user/apiKeys.ts';
import ApiKeyCreateOrUpdateModal from '@/pages/dashboard/api-keys/modals/ApiKeyCreateOrUpdateModal.tsx';
import ApiKeyDuplicateModal from '@/pages/dashboard/api-keys/modals/ApiKeyDuplicateModal.tsx';
import ApiKeyTokenModal from '@/pages/dashboard/api-keys/modals/ApiKeyTokenModal.tsx';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

interface ApiKeyRowProps {
  apiKey: z.infer<typeof userApiKeySchema>;
  atLimit?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

const ApiKeyRow = forwardRef<HTMLTableRowElement, ApiKeyRowProps>(function ApiKeyRow(
  { apiKey, atLimit = false, isSelected = false, onSelectionChange },
  ref,
) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState<'edit' | 'duplicate' | 'recreate' | 'delete' | null>(null);
  const [recreatedToken, setRecreatedToken] = useState<string | null>(null);
  const [duplicatedToken, setDuplicatedToken] = useState<string | null>(null);

  const doToggleEnabled = async () => {
    await updateApiKey(apiKey.uuid, { enabled: !apiKey.enabled })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.apiKeys.all() });
        addToast(
          apiKey.enabled ? t('pages.account.apiKeys.toast.disabled', {}) : t('pages.account.apiKeys.toast.enabled', {}),
          'success',
        );
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  const doRecreate = async () => {
    await recreateApiKey(apiKey.uuid)
      .then((newKey) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.apiKeys.all() });
        addToast(t('pages.account.apiKeys.modal.recreateApiKey.toast.recreated', {}), 'success');
        setOpenModal(null);
        setRecreatedToken(newKey);
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  const doDelete = async () => {
    await deleteApiKey(apiKey.uuid)
      .then(() => {
        setOpenModal(null);
        queryClient.invalidateQueries({ queryKey: queryKeys.user.apiKeys.all() });
        addToast(t('pages.account.apiKeys.modal.deleteApiKey.toast.removed', {}), 'success');
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  return (
    <>
      <ApiKeyCreateOrUpdateModal
        contextApiKey={apiKey}
        opened={openModal === 'edit'}
        onClose={() => setOpenModal(null)}
      />
      <ApiKeyDuplicateModal
        apiKey={apiKey}
        opened={openModal === 'duplicate'}
        onClose={() => setOpenModal(null)}
        onDuplicated={setDuplicatedToken}
      />
      <ApiKeyTokenModal recreated token={recreatedToken} onClose={() => setRecreatedToken(null)} />
      <ApiKeyTokenModal token={duplicatedToken} onClose={() => setDuplicatedToken(null)} />
      <ConfirmationModal
        opened={openModal === 'recreate'}
        onClose={() => setOpenModal(null)}
        title={t('pages.account.apiKeys.modal.recreateApiKey.title', {})}
        confirm={t('common.button.recreate', {})}
        onConfirmed={doRecreate}
      >
        {t('pages.account.apiKeys.modal.recreateApiKey.content', {
          name: apiKey.name,
        }).md()}
      </ConfirmationModal>
      <ConfirmationModal
        opened={openModal === 'delete'}
        onClose={() => setOpenModal(null)}
        title={t('pages.account.apiKeys.modal.deleteApiKey.title', {})}
        confirm={t('common.button.delete', {})}
        onConfirmed={doDelete}
      >
        {t('pages.account.apiKeys.modal.deleteApiKey.content', {
          name: apiKey.name,
        }).md()}
      </ConfirmationModal>

      <ContextMenu
        items={[
          {
            type: 'action',
            icon: faCopy,
            label: t('pages.account.apiKeys.button.copyUuid', {}),
            onClick: () => handleRawCopyToClipboard(apiKey.uuid, addToast),
            color: 'gray',
          },
          {
            type: 'action',
            icon: faPencil,
            label: t('common.button.edit', {}),
            onClick: () => setOpenModal('edit'),
            color: 'gray',
          },
          {
            type: 'action',
            icon: faClone,
            label: t('common.button.duplicate', {}),
            onClick: () => setOpenModal('duplicate'),
            disabled: atLimit,
            color: 'gray',
          },
          {
            type: 'action',
            icon: apiKey.enabled ? faBan : faCheck,
            label: apiKey.enabled ? t('common.button.disable', {}) : t('common.button.enable', {}),
            onClick: doToggleEnabled,
            color: apiKey.enabled ? 'red' : 'gray',
          },
          {
            type: 'action',
            icon: faRefresh,
            label: t('common.button.recreate', {}),
            onClick: () => setOpenModal('recreate'),
            color: 'red',
          },
          {
            type: 'action',
            icon: faTrash,
            label: t('common.button.remove', {}),
            onClick: () => setOpenModal('delete'),
            color: 'red',
          },
        ]}
        registry={window.extensionContext.extensionRegistry.pages.dashboard.apiKeys.apiKeyContextMenu}
        registryProps={{ apiKey }}
      >
        {({ items, openMenu }) => (
          <TableRow
            className='hydro-resource-row'
            ref={ref}
            bg={isSelected ? 'var(--mantine-color-blue-light)' : undefined}
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(e.clientX, e.clientY);
            }}
          >
            {onSelectionChange !== undefined && (
              <TableSelectionCell id={apiKey.uuid} checked={isSelected} onChange={onSelectionChange} />
            )}
            <TableData colSpan={100}>
              <div className='hydro-item'>
                <div className='hydro-item-icon'>
                  <Key width={22} height={22} />
                </div>
                <div className='hydro-item-copy'>
                  <div className='hydro-item-title'>
                    <h3>{apiKey.name}</h3>
                    <Badge color={apiKey.enabled ? 'green' : 'gray'}>
                      {apiKey.enabled ? t('common.badge.enabled', {}) : t('common.badge.disabled', {})}
                    </Badge>
                  </div>
                  <CopyOnClick content={apiKey.keyStart}>
                    <p className='hydro-checksum'>{apiKey.keyStart}…</p>
                  </CopyOnClick>
                  <div className='hydro-item-meta'>
                    <span>
                      {apiKey.userPermissions.length} / {apiKey.serverPermissions.length} /{' '}
                      {apiKey.adminPermissions.length} permissions
                    </span>
                    <span>
                      Last used <FormattedTimestamp timestamp={apiKey.lastUsed} showNA />
                    </span>
                  </div>
                </div>
                <div className='hydro-item-actions'>
                  <Button
                    variant='default'
                    aria-label={t('common.button.edit', {})}
                    onClick={() => setOpenModal('edit')}
                  >
                    <Pencil width={22} height={22} />
                  </Button>
                  <Button color='red' aria-label={t('common.button.delete', {})} onClick={() => setOpenModal('delete')}>
                    <TrashBin width={22} height={22} />
                  </Button>
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

export default ApiKeyRow;
