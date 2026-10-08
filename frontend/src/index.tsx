import type { CSSVariablesResolver, MantineThemeOverride } from '@mantine/core';
import { Children, isValidElement, lazy } from 'react';
import { Extension, type ExtensionContext, type HookableComponent } from 'shared';
import Button from '@/elements/buttons/Button.tsx';
import AccountContentContainer from '@/elements/containers/AccountContentContainer.tsx';
import AdminContentContainer from '@/elements/containers/AdminContentContainer.tsx';
import ServerContentContainer, {
  type Props as ServerPageProps,
} from '@/elements/containers/ServerContentContainer.tsx';
import Card from '@/elements/data-display/Card.tsx';
import TitleCard from '@/elements/data-display/TitleCard.tsx';
import EmptyState from '@/elements/feedback/EmptyState.tsx';
import ScreenBlock from '@/elements/feedback/ScreenBlock.tsx';
import Sidebar from '@/elements/navigation/Sidebar.tsx';
import AuthWrapper from '@/pages/auth/AuthWrapper.tsx';
import HydroAuthWrapper from './AuthWrapper.tsx';
import Configuration from './Configuration.tsx';
import { installEditorThemes } from './editors.ts';
import { HydroEmptyState, HydroScreenBlock } from './Feedback.tsx';
import NavIcon, { navKey } from './NavIcon.tsx';
import { PageBody, PageFrame } from './PageLayout.tsx';
import HydroSidebar from './Sidebar.tsx';
import { adaptServerRow } from './serverRows.tsx';
import TitledGreyBox from './TitledGreyBox.tsx';
import { cssResolver, theme } from './theme.ts';

const HydroConsole = lazy(() => import('./ServerConsole.tsx'));
const resourcePages = {
  '/databases': lazy(() => import('./pages/ServerDatabases.tsx')),
  '/network': lazy(() => import('./pages/ServerNetwork.tsx')),
  '/backups': lazy(() => import('./pages/ServerBackups.tsx')),
  '/subusers': lazy(() => import('./pages/ServerSubusers.tsx')),
  '/activity': lazy(() => import('./pages/ServerActivity.tsx')),
  '/files': lazy(() => import('./pages/ServerFiles.tsx')),
  '/startup': lazy(() => import('./pages/ServerStartup.tsx')),
  '/settings': lazy(() => import('./pages/ServerSettings.tsx')),
  '/schedules': lazy(() => import('./pages/ServerSchedules.tsx')),
};

class HydrodactylTheme extends Extension {
  public cardConfigurationPage = Configuration;

  public initialize(ctx: ExtensionContext): void {
    document.documentElement.dataset.hydrodactylTheme = 'true';
    installEditorThemes(ctx);
    Sidebar.replaceBaseComponent(HydroSidebar);
    TitleCard.replaceBaseComponent(TitledGreyBox);
    EmptyState.replaceBaseComponent(HydroEmptyState);
    ScreenBlock.replaceBaseComponent(HydroScreenBlock);
    Sidebar.Link.addPropsInterceptor((props) => ({
      ...props,
      name: props.to.startsWith('/server/')
        ? ({ databases: 'Database', subusers: 'Users' }[navKey(props.to)] ?? props.name)
        : props.name,
      className: `hydro-nav-link hydro-route-${navKey(props.to)} ${props.className ?? ''}`,
    }));
    Card.addPropsInterceptor((props) => adaptServerRow({ ...props, className: `hydro-card ${props.className ?? ''}` }));
    TitleCard.addPropsInterceptor((props) => ({
      ...props,
      titleClassName: `hydro-card-heading ${props.titleClassName ?? ''}`,
    }));
    Button.addPropsInterceptor((props) => {
      const route = props.className?.match(/hydro-route-([\w-]+)/)?.[1];
      return {
        ...props,
        className: `hydro-button ${!route && (props.color === undefined || props.color === 'blue' || props.color === 'cream') && (props.variant === undefined || props.variant === 'filled') ? 'hydro-primary-button' : ''} ${props.className ?? ''}`,
        color: props.color === undefined || props.color === 'blue' ? 'cream' : props.color,
        children: route ? (
          <>
            {route.startsWith('admin-') ? (
              (Children.toArray(props.children).find(isValidElement) ?? <NavIcon name='admin' />)
            ) : (
              <NavIcon name={route} />
            )}
            <span className='hydro-nav-text'>
              {Children.toArray(props.children).filter((child) => typeof child === 'string')}
            </span>
          </>
        ) : (
          props.children
        ),
      };
    });
    AuthWrapper.replaceBaseComponent(HydroAuthWrapper);

    AccountContentContainer.addPropsInterceptor((props) => ({
      ...props,
      hideTitleComponent: true,
      children: <PageBody props={props} scope='account' />,
    }));
    AccountContentContainer.addRenderInterceptor((element, props) => (
      <PageFrame scope='account' fullscreen={props.fullscreen}>
        {element}
      </PageFrame>
    ));
    AdminContentContainer.addPropsInterceptor((props) => ({
      ...props,
      hideTitleComponent: true,
      children: <PageBody props={props} scope='admin' />,
    }));
    AdminContentContainer.addRenderInterceptor((element, props) => (
      <PageFrame scope='admin' fullscreen={props.fullscreen}>
        {element}
      </PageFrame>
    ));
    const serverContainer = ServerContentContainer as HookableComponent<ServerPageProps>;
    serverContainer.addPropsInterceptor((props) => ({
      ...props,
      hideTitleComponent: true,
      children: <PageBody props={props} scope='server' />,
    }));
    serverContainer.addRenderInterceptor((element, props) => (
      <PageFrame scope='server' fullscreen={props.fullscreen}>
        {element}
      </PageFrame>
    ));

    ctx.extensionRegistry.routes.addAccountRouteInterceptor((routes) => {
      const account = routes.find((route) => route.path === '/');
      if (account) account.element = lazy(() => import('./pages/DashboardAccount.tsx'));
      const pages = {
        '/api-keys': lazy(() => import('./pages/DashboardApiKeys.tsx')),
        '/ssh-keys': lazy(() => import('./pages/DashboardSshKeys.tsx')),
        '/activity': lazy(() => import('./pages/DashboardActivity.tsx')),
      };
      for (const route of routes) {
        const component = pages[route.path as keyof typeof pages];
        if (component) route.element = component;
      }
    });
    ctx.extensionRegistry.routes.addServerRouteInterceptor((routes) => {
      const order = [
        '/',
        '/files',
        '/databases',
        '/backups',
        '/network',
        '/subusers',
        '/startup',
        '/schedules',
        '/settings',
        '/activity',
      ];
      routes.sort((a, b) => {
        const ai = order.indexOf(a.path);
        const bi = order.indexOf(b.path);
        return (ai < 0 ? order.length : ai) - (bi < 0 ? order.length : bi);
      });
      const consoleRoute = routes.find((route) => route.path === '/');
      if (consoleRoute) consoleRoute.element = HydroConsole;
      for (const route of routes) {
        const component = resourcePages[route.path as keyof typeof resourcePages];
        if (component) route.element = component;
      }
    });
  }

  public initializeMantineTheme(): MantineThemeOverride {
    return theme;
  }

  public initializeMantineCssResolver(): CSSVariablesResolver {
    return cssResolver;
  }
}

export default new HydrodactylTheme();
