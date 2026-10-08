/* Hydrodactyl ScreenBlock and the shared empty state used by its resource pages. */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ComponentProps } from 'react';
import EmptyState from '@/elements/feedback/EmptyState.tsx';
import ScreenBlock from '@/elements/feedback/ScreenBlock.tsx';

export function HydroScreenBlock({ title, content }: ComponentProps<typeof ScreenBlock>) {
  return (
    <div className='hydro-screen-block'>
      <div>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    </div>
  );
}

export function HydroEmptyState({ icon, title, description, children }: ComponentProps<typeof EmptyState>) {
  return (
    <div className='hydro-empty-state'>
      <div className='hydro-empty-icon'>
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children && <div className='hydro-empty-actions'>{children}</div>}
    </div>
  );
}
