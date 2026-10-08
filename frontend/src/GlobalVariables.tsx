/* StartupContainer's global variables; values come from the Calagopus server. */

import CopyOnClick from '@/elements/CopyOnClick.tsx';
import RedactedText from '@/elements/typography/RedactedText.tsx';
import { useServerStore } from '@/stores/server.ts';

export default function GlobalVariables() {
  const server = useServerStore((state) => state.server);
  const values = {
    SERVER_MEMORY: String(server.limits.memory),
    SERVER_IP: server.allocation?.ipAlias ?? server.allocation?.ip ?? 'n/a',
    SERVER_PORT: String(server.allocation?.port ?? 'n/a'),
    SERVER_UUID: server.uuid,
    SERVER_NAME: server.name,
    SERVER_CPU: String(server.limits.cpu),
  };
  return (
    <section className='hydro-global-variables' aria-label='Global server variables'>
      <h4>Global Server Variables</h4>
      <div>
        {Object.entries(values).map(([name, value]) => (
          <div key={name}>
            <code>{name}</code>
            <CopyOnClick content={value}>
              <code>{name === 'SERVER_IP' ? <RedactedText value={value} /> : value}</code>
            </CopyOnClick>
          </div>
        ))}
      </div>
    </section>
  );
}
