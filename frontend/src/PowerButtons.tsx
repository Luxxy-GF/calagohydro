/* Port of Hydrodactyl server/header/PowerButtons with Calagopus permissions/socket. */
import { PlayIcon, Rotate01FreeIcons, StopIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import Button from '@/elements/buttons/Button.tsx';
import { ServerCan } from '@/elements/Can.tsx';
import ExtensionSlot from '@/elements/ExtensionSlot.tsx';
import ConfirmationModal from '@/elements/modals/ConfirmationModal.tsx';
import { SocketRequest } from '@/plugins/websocket/useWebsocketEvent.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

export default function PowerButtons() {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const { state, server, socketInstance, socketConnected } = useServerStore();
  const blocked =
    !socketConnected || !!server.status || server.isSuspended || server.isTransferring || server.nodeMaintenanceEnabled;
  const killable = state === 'stopping';
  useEffect(() => {
    if (state === 'offline') setOpen(false);
  }, [state]);
  const action = (value: 'start' | 'restart' | 'stop' | 'kill') => {
    if (!blocked) socketInstance?.send(SocketRequest.SET_STATE, value);
  };
  const registry = window.extensionContext.extensionRegistry.pages.server.console.powerButtonComponents;
  return (
    <div className='hydro-power-buttons'>
      <ConfirmationModal
        opened={open}
        onClose={() => setOpen(false)}
        title={t('pages.server.console.power.modal.forceStop.title', {})}
        confirm={t('common.button.continue', {})}
        onConfirmed={() => {
          setOpen(false);
          action('kill');
        }}
      >
        {t('pages.server.console.power.modal.forceStop.content', {}).md()}
      </ConfirmationModal>
      <ExtensionSlot components={registry.prependedComponents} name='hydro-power-prepended' />
      <ServerCan action='control.start'>
        <Button
          className='hydro-power-start'
          variant='default'
          disabled={blocked || state !== 'offline'}
          loading={state === 'starting'}
          aria-label='Start server'
          onClick={() => action('start')}
        >
          <HugeiconsIcon icon={PlayIcon} size={16} /> {t('common.enum.serverPowerAction.start', {})}
        </Button>
      </ServerCan>
      <ServerCan action='control.restart'>
        <Button
          className='hydro-power-icon'
          variant='default'
          disabled={blocked || !state}
          aria-label='Restart server'
          onClick={() => action('restart')}
        >
          <HugeiconsIcon icon={Rotate01FreeIcons} size={16} />
        </Button>
      </ServerCan>
      <ServerCan action='control.stop'>
        <Button
          className='hydro-power-icon'
          variant='default'
          disabled={blocked || !state || state === 'offline'}
          aria-label={killable ? 'Kill server' : 'Stop server'}
          onClick={() => (killable ? setOpen(true) : action('stop'))}
        >
          <HugeiconsIcon icon={StopIcon} size={16} />
        </Button>
      </ServerCan>
      <ExtensionSlot components={registry.appendedComponents} name='hydro-power-appended' />
    </div>
  );
}
