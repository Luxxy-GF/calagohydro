/* Layout proportions adapted from Hydrodactyl MainPageHeader and PageContentBlock. */
import { faList, faSearch, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SegmentedControl } from '@mantine/core';
import { Children, isValidElement, type ReactNode, useId, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';
import type { Props as PageProps } from '@/elements/containers/AccountContentContainer.tsx';
import { useNavbarPageHeader } from '@/elements/containers/useNavbarPageHeader.ts';
import TextInput from '@/elements/input/TextInput.tsx';
import Group from '@/elements/layout/Group.tsx';
import { useCurrentWindow } from '@/providers/CurrentWindowProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import { useHeaderSlots } from './headerSlots.ts';
import { type ServerView, useServerView } from './preferences.ts';

export type PageScope = 'account' | 'admin' | 'server';

export function PageFrame({
  scope,
  fullscreen,
  children,
}: {
  scope: PageScope;
  fullscreen?: boolean;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const { id } = useCurrentWindow();
  const [serverView] = useServerView();
  if (fullscreen || id) return children;

  const segments = pathname.split('/').filter(Boolean);
  const section =
    scope === 'server'
      ? (segments[2] ?? 'console')
      : scope === 'admin'
        ? (segments[1] ?? 'overview')
        : segments[0] === 'account'
          ? (segments[1] ?? 'profile')
          : 'servers';

  return (
    <section
      className='hydro-workspace'
      data-scope={scope}
      data-section={section}
      data-view={serverView}
      data-background={section !== 'console'}
      data-resource={
        (scope === 'server' &&
          ['databases', 'network', 'backups', 'subusers', 'schedules', 'files', 'activity'].includes(section)) ||
        (scope === 'account' && ['api-keys', 'ssh-keys', 'activity'].includes(section))
      }
    >
      {children}
    </section>
  );
}

export function PageBody({ props, scope }: { props: PageProps; scope: PageScope }) {
  const { title, subtitle, titleOrder = 1, hideTitleComponent, search, setSearch, contentRight, children } = props;
  const { t } = useTranslations();
  const { id } = useCurrentWindow();
  const { pathname } = useLocation();
  const [view, setView] = useServerView();
  const serverListing = scope === 'account' && ['/', '/all', '/grouped'].includes(pathname);
  const owner = useId();
  const setSlots = useHeaderSlots((state) => state.set);
  const clearSlots = useHeaderSlots((state) => state.clear);
  const items = Children.toArray(children);
  const filters = serverListing ? items.find((item) => isValidElement(item) && item.type === Group) : null;
  useLayoutEffect(() => {
    if (!serverListing || id || props.fullscreen) return;
    setSlots(
      owner,
      filters,
      <SegmentedControl
        aria-label='Server layout'
        value={view}
        onChange={(value) => setView(value as ServerView)}
        data={[
          { value: 'list', label: <FontAwesomeIcon icon={faList} /> },
          { value: 'grid', label: <FontAwesomeIcon icon={faTableCellsLarge} /> },
        ]}
      />,
    );
    return () => clearSlots(owner);
  }, [serverListing, id, props.fullscreen, owner, filters, view, setView, setSlots, clearSlots]);
  const hoisted = useNavbarPageHeader({ title, subtitle }, !id && !props.fullscreen && !hideTitleComponent);
  const Heading = `h${titleOrder}` as 'h1';

  return (
    <>
      {!hideTitleComponent && !serverListing && (
        <header className='hydro-page-heading'>
          <div className={hoisted ? 'hydro-page-title hydro-title-hoisted' : 'hydro-page-title'}>
            <Heading>{title}</Heading>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {(setSearch || contentRight || serverListing) && (
            <div className='hydro-page-actions'>
              {setSearch && (
                <TextInput
                  aria-label={t('common.input.search', {})}
                  placeholder={t('common.input.search', {})}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  leftSection={<FontAwesomeIcon icon={faSearch} />}
                  className='hydro-page-search'
                />
              )}
              {contentRight}
              {serverListing && (
                <SegmentedControl
                  aria-label='Server layout'
                  value={view}
                  onChange={(value) => setView(value as ServerView)}
                  data={[
                    {
                      value: 'list',
                      label: (
                        <span>
                          <FontAwesomeIcon icon={faList} /> List
                        </span>
                      ),
                    },
                    {
                      value: 'grid',
                      label: (
                        <span>
                          <FontAwesomeIcon icon={faTableCellsLarge} /> Grid
                        </span>
                      ),
                    },
                  ]}
                />
              )}
            </div>
          )}
        </header>
      )}
      <div className='hydro-page-body'>
        {serverListing ? (
          <>
            <div className='hydro-mobile-filters'>{filters}</div>
            {items.filter((item) => item !== filters)}
          </>
        ) : (
          children
        )}
      </div>
    </>
  );
}
