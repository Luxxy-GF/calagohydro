/* The Events card in account/activity and ServerActivityLogContainer. */
import { ClockArrowRotateLeft } from '@gravity-ui/icons';
import type { ComponentProps } from 'react';
import Table from '@/elements/data-display/Table.tsx';
import ResourceList from './ResourceList.tsx';

export default function ActivityList(props: ComponentProps<typeof Table>) {
  return (
    <section className='hydro-activity-list'>
      <header>
        <ClockArrowRotateLeft width={20} height={20} />
        <h3>Events</h3>
        <span>({props.pagination?.total ?? 0})</span>
      </header>
      <ResourceList {...props} />
    </section>
  );
}
