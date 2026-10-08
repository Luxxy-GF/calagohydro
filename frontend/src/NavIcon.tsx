/* Icons used by Hydrodactyl UnifiedRouter and its modern NavItem. */
import {
  Activity02Icon,
  ApiIcon,
  Cardiogram01Icon,
  ClockIcon,
  CloudUploadIcon,
  ComputerTerminal01Icon,
  ConnectIcon,
  Database02Icon,
  FolderIcon,
  Home01Icon,
  Key01Icon,
  ServerStack02Icon,
  Settings02Icon,
  Settings04Icon,
  Shield01Icon,
  UserMultiple02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export function navKey(to: string): string {
  const parts = to.split('/').filter(Boolean);
  if (parts[0] === 'admin') return `admin-${parts[1] ?? 'home'}`;
  return parts[0] === 'server'
    ? (parts[2] ?? 'console')
    : parts[0] === 'account'
      ? (parts[1] ?? 'account')
      : (parts[0] ?? 'home');
}

export default function NavIcon({ name }: { name: string }) {
  const icons = {
    console: Cardiogram01Icon,
    files: FolderIcon,
    databases: Database02Icon,
    backups: CloudUploadIcon,
    network: ConnectIcon,
    subusers: UserMultiple02Icon,
    schedules: ClockIcon,
    startup: Settings04Icon,
    settings: Settings02Icon,
    activity: Activity02Icon,
    home: Home01Icon,
    admin: ServerStack02Icon,
    account: UserMultiple02Icon,
    'api-keys': ApiIcon,
    'ssh-keys': Key01Icon,
    'security-keys': Shield01Icon,
    sessions: ComputerTerminal01Icon,
  };
  return <HugeiconsIcon icon={icons[name as keyof typeof icons] ?? Settings02Icon} size={20} strokeWidth={2} />;
}
