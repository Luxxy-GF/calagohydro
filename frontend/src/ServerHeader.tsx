/* Port of server/header/ServerHeader and ServerDetailsHeader. */
import { bytesToString } from '@/lib/format/size.ts';
import { useServerStore } from '@/stores/server.ts';

export default function ServerHeader() {
  const { server, stats, state } = useServerStore();
  return (
    <div className='hydro-server-header'>
      <div className='hydro-header-name'>
        <span className='hydro-state-dot' data-state={state ?? 'offline'} />
        <span>{server.name}</span>
      </div>
      <div className='hydro-header-stats'>
        <div>
          <span>CPU</span>
          <strong>{(stats?.cpuAbsolute ?? 0).toFixed(2)}%</strong>
        </div>
        <div>
          <span>RAM</span>
          <strong>{bytesToString(stats?.memoryBytes ?? 0)}</strong>
        </div>
        <div>
          <span>Disk</span>
          <strong>{bytesToString(stats?.diskBytes ?? 0)}</strong>
        </div>
      </div>
    </div>
  );
}
