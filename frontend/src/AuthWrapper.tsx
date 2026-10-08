import { ReactNode, useMemo, useRef } from 'react';
import { ContainerRegistry } from 'shared';
import Copyright from '@/elements/Copyright.tsx';
import ContentContainer from '@/elements/containers/ContentContainer.tsx';
import ExtensionSlot from '@/elements/ExtensionSlot.tsx';
import { useContainerAutoHeight } from '@/plugins/viewport/useContainerAutoHeight.ts';
import { useCurrentWindow } from '@/providers/CurrentWindowProvider.tsx';
import { useGlobalStore } from '@/stores/global.ts';
import Logo from './Logo.tsx';

export interface Props {
  title?: string;
  registry?: ContainerRegistry<Props>;
  children: ReactNode;
}

function AuthWrapper(props: Props) {
  const modifiedProps = useMemo(() => {
    let currentProps = props;

    if (props.registry) {
      for (const interceptor of props.registry.propsInterceptors) {
        currentProps = interceptor(currentProps);
      }
    }

    return currentProps;
  }, [props]);

  const { title, registry, children } = modifiedProps;

  const settings = useGlobalStore((state) => state.settings);
  const authRegistry = window.extensionContext.extensionRegistry.pages.auth;
  const containerRef = useRef<HTMLDivElement>(null);
  const { getParent } = useCurrentWindow();

  useContainerAutoHeight({
    containerRef,
    loading: false,
    getParent,
    layout: () => undefined,
    cssVariable: '--auth-page-height',
    useVisualViewportInset: true,
    deps: [getParent],
  });

  return (
    <ContentContainer title={settings.app.name}>
      <div ref={containerRef} className='hydro-auth-layout'>
        <div className='hydro-auth-left'>
          <div className='hydro-auth-card'>
            <ExtensionSlot components={authRegistry.prependedComponents} name='auth-prepended' />
            <ExtensionSlot components={registry?.prependedComponents ?? []} name='prepended' props={modifiedProps} />

            {title && <h1 className='text-3xl font-bold mb-4'>{title}</h1>}

            <ExtensionSlot
              components={registry?.prependedContentComponents ?? []}
              name='prepended-content'
              props={modifiedProps}
            />

            {children}

            <ExtensionSlot
              components={registry?.appendedContentComponents ?? []}
              name='appended-content'
              props={modifiedProps}
            />

            <Copyright className='mt-4 text-sm' />

            <ExtensionSlot components={authRegistry.appendedComponents} name='auth-appended' />
          </div>
        </div>
        <aside className='hydro-auth-hero' aria-hidden='true'>
          <div>
            <Logo />
            <span>{settings.app.name}</span>
          </div>
        </aside>
      </div>
    </ContentContainer>
  );
}

export default AuthWrapper;
