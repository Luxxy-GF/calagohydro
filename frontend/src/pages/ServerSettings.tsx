import { ServerCan } from '@/elements/Can.tsx';
import ServerContentContainer from '@/elements/containers/ServerContentContainer.tsx';
import ExtensionSlot from '@/elements/ExtensionSlot.tsx';
import AutokillContainer from '@/pages/server/settings/AutokillContainer.tsx';
import AutostartContainer from '@/pages/server/settings/AutostartContainer.tsx';
import DebugInformationContainer from '@/pages/server/settings/DebugInformationContainer.tsx';
import ReinstallContainer from '@/pages/server/settings/ReinstallContainer.tsx';
import RenameContainer from '@/pages/server/settings/RenameContainer.tsx';
import TimezoneContainer from '@/pages/server/settings/TimezoneContainer.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import SftpDetails from '../SftpDetails.tsx';

export default function ServerSettings() {
  const { t } = useTranslations();

  return (
    <ServerContentContainer
      title={t('pages.server.settings.title', {})}
      registry={window.extensionContext.extensionRegistry.pages.server.settings.container}
    >
      <div className='hydro-settings-stack'>
        <ExtensionSlot
          components={
            window.extensionContext.extensionRegistry.pages.server.settings.settingContainers.prependedComponents
          }
          name='settings-settingContainer-prepended'
        />

        <ServerCan action='settings.rename'>
          <RenameContainer />
        </ServerCan>
        <ServerCan action='settings.install'>
          <ReinstallContainer />
        </ServerCan>
        <DebugInformationContainer />
        <SftpDetails />
        <div className='hydro-settings-extra'>
          <ServerCan action='settings.auto-kill'>
            <AutokillContainer />
          </ServerCan>
          <ServerCan action='settings.auto-start'>
            <AutostartContainer />
          </ServerCan>
          <ServerCan action='settings.timezone'>
            <TimezoneContainer />
          </ServerCan>
        </div>

        <ExtensionSlot
          components={
            window.extensionContext.extensionRegistry.pages.server.settings.settingContainers.appendedComponents
          }
          name='settings-settingContainer-appended'
        />
      </div>
    </ServerContentContainer>
  );
}
