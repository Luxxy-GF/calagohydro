/* Port of Hydrodactyl server/console/StatGraphs, using its Chart.js hooks and layout. */
import { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import CopyOnClick from '@/elements/CopyOnClick.tsx';
import ExtensionSlot from '@/elements/ExtensionSlot.tsx';
import RedactedText from '@/elements/typography/RedactedText.tsx';
import { formatAllocation } from '@/lib/domain/server.ts';
import { bytesToString } from '@/lib/format/size.ts';
import { useServerStore } from '@/stores/server.ts';
import { useChart, useChartTickLabel } from './chart.ts';
import formatUptime from './UptimeDuration.ts';

export default function StatGraphs() {
  const { server, stats, state } = useServerStore();
  const previous = useRef<{ tx: number; rx: number; uptime: number; time: number } | null>(null);
  const cpu = useChartTickLabel('CPU', server.limits.cpu || 100, '%', 2);
  const memory = useChartTickLabel('Memory', server.limits.memory || 1024, 'MiB');
  const network = useChart('Network', {
    sets: 2,
    options: { scales: { y: { ticks: { callback: (value) => bytesToString(Number(value)) } } } },
    callback: (options, index) => ({
      ...options,
      label: index === 0 ? 'Inbound' : 'Outbound',
      borderColor: index === 0 ? '#facc15' : '#60a5fa',
      backgroundColor: index === 0 ? '#facc1517' : '#60a5fa17',
    }),
  });
  useEffect(() => {
    if (state !== 'offline') return;
    previous.current = null;
    cpu.clear();
    memory.clear();
    network.clear();
    // The source chart helpers return new callbacks on render; only state triggers clearing.
  }, [state]);
  useEffect(() => {
    if (!stats || state === 'offline') return;
    cpu.push(stats.cpuAbsolute);
    memory.push(Math.floor(stats.memoryBytes / 1024 / 1024));
    const now = performance.now();
    const last = previous.current;
    const seconds = last ? (now - last.time) / 1000 : 0;
    const valid = last && seconds > 0 && stats.uptime >= last.uptime;
    network.push(
      valid
        ? [
            Math.max(0, stats.network.rxBytes - last.rx) / seconds,
            Math.max(0, stats.network.txBytes - last.tx) / seconds,
          ]
        : [0, 0],
    );
    previous.current = { tx: stats.network.txBytes, rx: stats.network.rxBytes, uptime: stats.uptime, time: now };
  }, [stats, state]);
  const registry = window.extensionContext.extensionRegistry.pages.server.console;
  return (
    <div className='hydro-stat-graphs'>
      <div className='hydro-detail-card'>
        <h3>IP Address</h3>
        <CopyOnClick content={formatAllocation(server.allocation)}>
          <RedactedText value={formatAllocation(server.allocation)} />
        </CopyOnClick>
      </div>
      <div className='hydro-detail-card'>
        <h3>Uptime</h3>
        <span>{formatUptime(state === 'offline' ? 0 : (stats?.uptime ?? 0))}</span>
      </div>
      {server.description && (
        <div className='hydro-detail-card hydro-description-card'>
          <h3>Description</h3>
          <span>{server.description}</span>
        </div>
      )}
      <ChartBlock title='CPU'>
        <Line aria-label='CPU Usage' role='img' {...cpu.props} />
      </ChartBlock>
      <ChartBlock title='RAM'>
        <Line aria-label='Memory Usage' role='img' {...memory.props} />
      </ChartBlock>
      <ChartBlock title='Network Activity'>
        <Line aria-label='Network Activity' role='img' {...network.props} />
      </ChartBlock>
      <ExtensionSlot components={registry.statCards} name='hydro-stat-card' />
      <ExtensionSlot components={registry.statBlocks} name='hydro-stat-block' />
    </div>
  );
}

function ChartBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='hydro-source-chart'>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
