/* Supported Calagopus build override for the dashboard's non-hookable row. */
import OriginalServerItem from '@/pages/dashboard/home/ServerItem.tsx';
import SourceServerItem from './pages/ServerItem.tsx';

function defineOverride<T>(original: T, replacement: NoInfer<T>) {
  return { original, replacement };
}
export const overrides = [defineOverride(OriginalServerItem, SourceServerItem)];
