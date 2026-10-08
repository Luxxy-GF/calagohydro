/* SettingsContainer's SFTP box, adapted to Calagopus's username/address format. */

import { ServerCan } from '@/elements/Can.tsx';
import CopyOnClick from '@/elements/CopyOnClick.tsx';
import TitleCard from '@/elements/data-display/TitleCard.tsx';
import RedactedText from '@/elements/typography/RedactedText.tsx';
import { useAuth } from '@/providers/AuthProvider.tsx';
import { useServerStore } from '@/stores/server.ts';

export default function SftpDetails() {
  const server = useServerStore((state) => state.server);
  const { user } = useAuth();
  const username = `${user?.username ?? ''}.${server.uuidShort}`;
  const address = `sftp://${server.sftpHost}:${server.sftpPort}`;
  return (
    <ServerCan action='files.sftp'>
      <TitleCard title='SFTP Details'>
        <div className='hydro-details-line'>
          <span>Server Address</span>
          <CopyOnClick content={address}>
            <code>
              <RedactedText value={address} />
            </code>
          </CopyOnClick>
        </div>
        <div className='hydro-details-line'>
          <span>Username</span>
          <CopyOnClick content={username}>
            <code>{username}</code>
          </CopyOnClick>
        </div>
        <div className='hydro-sftp-footer'>
          <p>Your SFTP password is the same as the password you use to access this panel.</p>
          <a
            className='hydro-sftp-launch'
            href={`sftp://${encodeURIComponent(username)}@${server.sftpHost}:${server.sftpPort}`}
          >
            Launch SFTP
          </a>
        </div>
      </TitleCard>
    </ServerCan>
  );
}
