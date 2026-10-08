import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
// Row layout ported from Hydrodactyl components/server/subusers; Calagopus controller retained.
import { Pencil, TrashBin } from '@gravity-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import deleteSubuser from '@/api/server/subusers/deleteSubuser.ts';
import Button from '@/elements/buttons/Button.tsx';
import { ServerCan } from '@/elements/Can.tsx';
import Avatar from '@/elements/data-display/Avatar.tsx';
import { TableData, TableRow, TableSelectionCell } from '@/elements/data-display/Table.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import ContextMenu, { ContextMenuToggle } from '@/elements/overlays/ContextMenu.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { serverSubuserSchema } from '@/lib/schemas/server/subusers.ts';
import SubuserUpdateModal from '@/pages/server/subusers/modals/SubuserUpdateModal.tsx';
import { useServerCan } from '@/plugins/usePermissions.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

interface SubuserRowProps {
  subuser: z.infer<typeof serverSubuserSchema>;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

const SubuserRow = forwardRef<HTMLTableRowElement, SubuserRowProps>(function SubuserRow(
  { subuser, isSelected = false, onSelectionChange },
  ref,
) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const { server } = useServerStore();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState<'update' | 'remove' | null>(null);

  const doRemove = async () => {
    await deleteSubuser(server.uuid, subuser.user.uuid)
      .then(() => {
        setOpenModal(null);
        addToast(t('pages.server.subusers.modal.removeSubuser.toast.removed', {}), 'success');
        queryClient.invalidateQueries({ queryKey: queryKeys.server(server.uuid).subusers.all() });
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  return (
    <>
      <SubuserUpdateModal subuser={subuser} opened={openModal === 'update'} onClose={() => setOpenModal(null)} />

      <ConfirmationModal
        opened={openModal === 'remove'}
        onClose={() => setOpenModal(null)}
        title={t('pages.server.subusers.modal.removeSubuser.title', {})}
        confirm={t('common.button.remove', {})}
        onConfirmed={doRemove}
      >
        {t('pages.server.subusers.modal.removeSubuser.content', {
          username: subuser.user.username,
        }).md()}
      </ConfirmationModal>

      <ContextMenu
        items={[
          {
            type: 'action',
            icon: faPencil,
            label: t('common.button.edit', {}),
            onClick: () => setOpenModal('update'),
            color: 'gray',
            canAccess: useServerCan('subusers.update'),
          },
          {
            type: 'action',
            icon: faTrash,
            label: t('common.button.remove', {}),
            onClick: () => setOpenModal('remove'),
            color: 'red',
            canAccess: useServerCan('subusers.delete'),
          },
        ]}
        registry={window.extensionContext.extensionRegistry.pages.server.subusers.subuserContextMenu}
        registryProps={{ subuser }}
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
              <TableSelectionCell id={subuser.user.uuid} checked={isSelected} onChange={onSelectionChange} />
            )}
            <TableData colSpan={100}>
              <div className='hydro-item'>
                <div className='hydro-item-icon'>
                  <Avatar size={36} src={subuser.user.avatar} name={subuser.user.username} />
                </div>
                <div className='hydro-item-copy'>
                  <div className='hydro-item-title'>
                    <h3>{subuser.user.username}</h3>
                    <span className={`hydro-mfa-badge ${subuser.user.totpEnabled ? 'enabled' : ''}`}>
                      {subuser.user.totpEnabled ? 'MFA Enabled' : 'MFA Disabled'}
                    </span>
                  </div>
                  <p>
                    {subuser.permissions.length} permissions assigned · {subuser.ignoredFiles.length} ignored files
                  </p>
                </div>
                <div className='hydro-item-actions'>
                  <ServerCan action='subusers.update'>
                    <Button
                      variant='default'
                      aria-label={t('common.button.edit', {})}
                      onClick={() => setOpenModal('update')}
                    >
                      <Pencil width={22} height={22} />
                    </Button>
                  </ServerCan>
                  <ServerCan action='subusers.delete'>
                    <Button
                      color='red'
                      aria-label={t('common.button.remove', {})}
                      onClick={() => setOpenModal('remove')}
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

export default SubuserRow;
