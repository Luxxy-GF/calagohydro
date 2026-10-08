/* Source ScheduleCronRow, with Calagopus's multiple trigger types. */
import type { ServerSchedule } from '@/lib/schemas/server/schedules.ts';

export default function ScheduleCronRow({ triggers }: { triggers: ServerSchedule['triggers'] }) {
  return (
    <div className='hydro-cron-triggers'>
      {triggers.map((trigger, index) => {
        if (trigger.type !== 'cron')
          return (
            <span className='hydro-trigger-badge' key={index}>
              {trigger.type.replaceAll('_', ' ')}
            </span>
          );
        const fields = trigger.schedule.trim().split(/\s+/);
        const labels =
          fields.length === 5
            ? ['Minute', 'Hour', 'Day (Month)', 'Month', 'Day (Week)']
            : ['Second', 'Minute', 'Hour', 'Day (Month)', 'Month', 'Day (Week)', 'Year'].slice(0, fields.length);
        return (
          <div className='hydro-cron-row' key={index}>
            {fields.map((field, fieldIndex) => (
              <div key={labels[fieldIndex]}>
                <p>{field}</p>
                <span>{labels[fieldIndex]}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
