import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Key, Pencil, TrashBin } from '@gravity-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import deleteSshKey from '@/api/me/ssh-keys/deleteSshKey.ts';
import Button from '@/elements/buttons/Button.tsx';
import CopyOnClick from '@/elements/CopyOnClick.tsx';
import { TableData, TableRow, TableSelectionCell } from '@/elements/data-display/Table.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import ContextMenu, { ContextMenuToggle } from '@/elements/overlays/ContextMenu.tsx';
import FormattedTimestamp from '@/elements/time/FormattedTimestamp.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { userSshKeySchema } from '@/lib/schemas/user/sshKeys.ts';
import SshKeyEditModal from '@/pages/dashboard/ssh-keys/modals/SshKeyEditModal.tsx';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

interface SshKeyRowProps {
  sshKey: z.infer<typeof userSshKeySchema>;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

const SshKeyRow = forwardRef<HTMLTableRowElement, SshKeyRowProps>(function SshKeyRow(
  { sshKey, isSelected = false, onSelectionChange },
  ref,
) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState<'edit' | 'delete' | null>(null);

  const doDelete = async () => {
    await deleteSshKey(sshKey.uuid)
      .then(() => {
        setOpenModal(null);
        queryClient.invalidateQueries({ queryKey: queryKeys.user.sshKeys.all() });
        addToast(t('pages.account.sshKeys.modal.deleteSshKey.toast.removed', {}), 'success');
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  return (
    <>
      <SshKeyEditModal sshKey={sshKey} opened={openModal === 'edit'} onClose={() => setOpenModal(null)} />

      <ConfirmationModal
        opened={openModal === 'delete'}
        onClose={() => setOpenModal(null)}
        title={t('pages.account.sshKeys.modal.deleteSshKey.title', {})}
        confirm={t('common.button.delete', {})}
        onConfirmed={doDelete}
      >
        {t('pages.account.sshKeys.modal.deleteSshKey.content', {
          name: sshKey.name,
        }).md()}
      </ConfirmationModal>

      <ContextMenu
        items={[
          {
            type: 'action',
            icon: faPencil,
            label: t('common.button.edit', {}),
            onClick: () => setOpenModal('edit'),
            color: 'gray',
          },
          {
            type: 'action',
            icon: faTrash,
            label: t('common.button.delete', {}),
            onClick: () => setOpenModal('delete'),
            color: 'red',
          },
        ]}
        registry={window.extensionContext.extensionRegistry.pages.dashboard.sshKeys.sshKeyContextMenu}
        registryProps={{ sshKey }}
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
              <TableSelectionCell id={sshKey.uuid} checked={isSelected} onChange={onSelectionChange} />
            )}
            <TableData colSpan={100}>
              <div className='hydro-item'>
                <div className='hydro-item-icon'>
                  <Key width={22} height={22} />
                </div>
                <div className='hydro-item-copy'>
                  <h3>{sshKey.name}</h3>
                  <CopyOnClick content={sshKey.fingerprint}>
                    <p className='hydro-checksum'>{sshKey.fingerprint}</p>
                  </CopyOnClick>
                  <p>
                    <FormattedTimestamp timestamp={sshKey.created} />
                  </p>
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

export default SshKeyRow;
