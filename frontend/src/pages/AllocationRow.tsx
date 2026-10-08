import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
// Row layout ported from Hydrodactyl components/server/network; Calagopus controller retained.
import { AntennaSignal, CrownDiamond, TrashBin } from '@gravity-ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import debounce from 'debounce';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { httpErrorToHuman } from '@/api/axios.ts';
import deleteAllocation from '@/api/server/allocations/deleteAllocation.ts';
import updateAllocation from '@/api/server/allocations/updateAllocation.ts';
import Button from '@/elements/buttons/Button.tsx';
import { ServerCan } from '@/elements/Can.tsx';
import { TableData, TableRow, TableSelectionCell } from '@/elements/data-display/Table.tsx';
import TextArea from '@/elements/input/TextArea.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import ContextMenu, { ContextMenuToggle } from '@/elements/overlays/ContextMenu.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { serverAllocationSchema } from '@/lib/schemas/server/allocations.ts';
import { useRedactedAddress } from '@/plugins/privacy/useRedactAddresses.ts';
import { useServerCan } from '@/plugins/usePermissions.ts';
import { useToast } from '@/providers/ToastProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

interface AllocationRowProps {
  allocation: z.infer<typeof serverAllocationSchema>;
  isSelected?: boolean;
  onSelectionChange?: (selected: boolean) => void;
}

const AllocationRow = forwardRef<HTMLTableRowElement, AllocationRowProps>(function AllocationRow(
  { allocation, isSelected = false, onSelectionChange },
  ref,
) {
  const { t } = useTranslations();
  const { addToast } = useToast();
  const { server, updateServer } = useServerStore();
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState<'remove' | null>(null);
  const displayAllocation = useRedactedAddress(`${allocation.ipAlias ?? allocation.ip}:${allocation.port}`);
  const [notes, setNotes] = useState(allocation.notes ?? '');
  const canUpdate = useServerCan('allocations.update');
  const canUnsetPrimary = !server.eggConfiguration?.allocationSelfAssignRequirePrimary;

  const setDebouncedNotes = useMemo(
    () =>
      debounce((notes: string) => {
        updateAllocation(server.uuid, allocation.uuid, { notes: notes || null })
          .then(() => {
            addToast(t('pages.server.network.toast.updated', {}), 'success');
            queryClient.invalidateQueries({ queryKey: queryKeys.server(server.uuid).network.all() });
          })
          .catch((msg) => {
            addToast(httpErrorToHuman(msg), 'error');
          });
      }, 500),
    [server.uuid, allocation.uuid, t, addToast, queryClient],
  );

  useEffect(() => {
    if (notes !== (allocation.notes ?? '')) {
      setDebouncedNotes(notes);
    }
  }, [notes]);

  const doSetPrimary = () => {
    updateAllocation(server.uuid, allocation.uuid, { primary: true })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.server(server.uuid).network.all() });
        updateServer({ allocation });
        addToast(t('pages.server.network.toast.setPrimary', {}), 'success');
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  const doUnsetPrimary = () => {
    if (!canUnsetPrimary) {
      return;
    }

    updateAllocation(server.uuid, allocation.uuid, { primary: false })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.server(server.uuid).network.all() });
        updateServer({ allocation: null });
        addToast(t('pages.server.network.toast.unsetPrimary', {}), 'success');
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  const doRemove = async () => {
    await deleteAllocation(server.uuid, allocation.uuid)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.server(server.uuid).network.all() });
        addToast(t('pages.server.network.toast.removed', {}), 'success');
        setOpenModal(null);
      })
      .catch((msg) => {
        addToast(httpErrorToHuman(msg), 'error');
      });
  };

  return (
    <>
      <ConfirmationModal
        opened={openModal === 'remove'}
        onClose={() => setOpenModal(null)}
        title={t('pages.server.network.modal.removeAllocation.title', {})}
        confirm={t('common.button.remove', {})}
        onConfirmed={doRemove}
      >
        {t('pages.server.network.modal.removeAllocation.content', {
          allocation: displayAllocation,
        }).md()}
      </ConfirmationModal>

      <ContextMenu
        items={[
          {
            type: 'action',
            icon: faStar,
            label: t('common.button.setPrimary', {}),
            hidden: allocation.isPrimary,
            onClick: doSetPrimary,
            color: 'gray',
            canAccess: canUpdate,
          },
          {
            type: 'action',
            icon: faStar,
            label: t('common.button.unsetPrimary', {}),
            hidden: !allocation.isPrimary,
            disabled: !canUnsetPrimary,
            onClick: doUnsetPrimary,
            color: 'red',
            canAccess: canUpdate,
          },
          {
            type: 'action',
            icon: faTrash,
            label: t('common.button.remove', {}),
            onClick: () => setOpenModal('remove'),
            color: 'red',
            canAccess: useServerCan('allocations.delete'),
          },
        ]}
        registry={window.extensionContext.extensionRegistry.pages.server.network.allocationContextMenu}
        registryProps={{ allocation }}
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
              <TableSelectionCell id={allocation.uuid} checked={isSelected} onChange={onSelectionChange} />
            )}
            <TableData colSpan={100}>
              <div className='hydro-item'>
                <div className='hydro-item-icon'>
                  <AntennaSignal width={22} height={22} />
                </div>
                <div className='hydro-item-copy'>
                  <div className='hydro-item-title'>
                    <h3>{displayAllocation}</h3>
                    {server.allocation?.uuid === allocation.uuid && (
                      <span className='hydro-primary-badge'>
                        <CrownDiamond width={14} height={14} />
                        Primary
                      </span>
                    )}
                  </div>
                  <TextArea
                    aria-label={t('common.table.columns.notes', {})}
                    placeholder={t('common.table.columns.notes', {})}
                    value={notes}
                    onChange={(e) => setNotes(e.currentTarget.value)}
                    disabled={!canUpdate}
                    autosize
                    minRows={1}
                    className='hydro-allocation-notes'
                  />
                </div>
                <div className='hydro-item-actions'>
                  <ServerCan action='allocations.update'>
                    <Button
                      variant='default'
                      aria-label='Make primary allocation'
                      disabled={server.allocation?.uuid === allocation.uuid}
                      onClick={doSetPrimary}
                    >
                      <CrownDiamond width={22} height={22} />
                    </Button>
                  </ServerCan>
                  <ServerCan action='allocations.delete'>
                    <Button
                      color='red'
                      aria-label={t('common.button.delete', {})}
                      disabled={server.allocation?.uuid === allocation.uuid}
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

export default AllocationRow;
