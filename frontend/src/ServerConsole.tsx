/* Port of Hydrodactyl server/console/ServerConsoleContainer.
 * Same unframed, full-height terminal and independently scrolling stats column.
 */
import ServerContentContainer from '@/elements/containers/ServerContentContainer.tsx';
import { useNavbarPageHeader } from '@/elements/containers/useNavbarPageHeader.ts';
import Console from '@/pages/server/console/terminal/Console.tsx';
import { useVisualViewportBottomInset } from '@/plugins/viewport/useVisualViewport.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useServerStore } from '@/stores/server.ts';
import PowerButtons from './PowerButtons.tsx';
import StatGraphs from './StatGraphs.tsx';

export default function ServerConsole() {
  const { t } = useTranslations();
  const server = useServerStore((state) => state.server);
  const inset = useVisualViewportBottomInset();
  useNavbarPageHeader({ title: server.name });
  return (
    <ServerContentContainer
      title={t('pages.server.console.title', {})}
      hideTitleComponent
      registry={window.extensionContext.extensionRegistry.pages.server.console.container}
    >
      <div className='hydro-console-layout'>
        <div className='hydro-console-main'>
          <div className='hydro-mobile-power'>
            <PowerButtons />
          </div>
          <div
            className='hydro-console-terminal'
            style={inset > 0 ? { height: `max(8rem, calc(100dvh - ${inset}px - 10rem))` } : undefined}
          >
            <Console />
          </div>
        </div>
        <aside className='hydro-console-graphs' aria-label='Server statistics'>
          <StatGraphs />
        </aside>
      </div>
    </ServerContentContainer>
  );
}
