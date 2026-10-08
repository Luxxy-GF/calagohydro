import { useComputedColorScheme } from '@mantine/core';
import { useGlobalStore } from '@/stores/global.ts';

export default function Logo() {
  const app = useGlobalStore((state) => state.settings.app);
  const isLight = useComputedColorScheme('dark') === 'light';
  const banner = app.banner ? (isLight ? (app.bannerLight ?? app.banner) : app.banner) : null;
  const icon = isLight ? (app.iconLight ?? app.icon) : app.icon;

  return <img className='hydro-brand-logo' src={banner ?? icon} data-banner={!!banner} alt={app.name} />;
}
