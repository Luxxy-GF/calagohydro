import { ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import ActivityInfoButton from '@/elements/activity/ActivityInfoButton.tsx';
import Avatar from '@/elements/data-display/Avatar.tsx';
import { TableData, TableRow } from '@/elements/data-display/Table.tsx';
import TableLink from '@/elements/data-display/TableLink.tsx';
import Group from '@/elements/layout/Group.tsx';
import FormattedTimestamp from '@/elements/time/FormattedTimestamp.tsx';
import RedactedText from '@/elements/typography/RedactedText.tsx';
import { activitySchema } from '@/lib/schemas/activity.ts';
import { serverActivitySchema } from '@/lib/schemas/server/activity.ts';
import { userActivitySchema } from '@/lib/schemas/user/activity.ts';
import { buildUserFilterSearch } from '@/plugins/useUserFilter.ts';
import { useTranslations } from '@/providers/TranslationProvider.tsx';

type Activity =
  | z.infer<typeof activitySchema>
  | z.infer<typeof userActivitySchema>
  | z.infer<typeof serverActivitySchema>;

interface ActivityRowProps {
  activity: Activity;
  showAvatar?: boolean;
  avatar?: { avatar?: string | null; username?: string | null } | null;
  accountScoped?: boolean;
  linkActor?: boolean;
  actions?: ReactNode;
}

export default function ActivityRow({
  activity,
  showAvatar = false,
  avatar = null,
  accountScoped = false,
  linkActor = false,
  actions,
}: ActivityRowProps) {
  const { t } = useTranslations();
  const [searchParams] = useSearchParams();

  const method = activity.isApi ? t('common.api', {}) : t('common.web', {});
  const impersonatedBy = activity.impersonator
    ? t('common.impersonatedBy', { username: activity.impersonator.username })
    : null;

  let actor: ReactNode;
  if (accountScoped) {
    actor = impersonatedBy ? `${impersonatedBy} (${method})` : method;
  } else {
    const activityUser = (activity as z.infer<typeof activitySchema>).user;
    const impersonatorSuffix = impersonatedBy ? ` (${impersonatedBy})` : '';

    if (activityUser) {
      actor = (
        <>
          {linkActor ? (
            <TableLink to={{ search: buildUserFilterSearch(searchParams, activityUser.uuid) }}>
              {activityUser.username}
            </TableLink>
          ) : (
            activityUser.username
          )}{' '}
          ({method}){impersonatorSuffix}
        </>
      );
    } else {
      const isSchedule = 'isSchedule' in activity && activity.isSchedule;
      actor = (
        <>
          {isSchedule ? t('common.schedule', {}) : t('common.system', {})}
          {impersonatorSuffix}
        </>
      );
    }
  }

  return (
    <TableRow className='hydro-activity-row'>
      <TableData colSpan={100}>
        <div className='hydro-activity-entry'>
          {showAvatar && <Avatar size={32} src={avatar?.avatar} name={avatar?.username ?? undefined} />}
          <div className='hydro-activity-copy'>
            <div>
              <span className='hydro-activity-event'>{activity.event}</span>
              <FormattedTimestamp timestamp={activity.created} />
            </div>
            <p>
              {actor} · {activity.ip ? <RedactedText value={activity.ip} /> : t('common.na', {})}
            </p>
          </div>
          <Group gap={4} justify='right' wrap='nowrap'>
            {actions}
            {Object.keys(activity.data ?? {}).length > 0 && <ActivityInfoButton activity={activity} />}
          </Group>
        </div>
      </TableData>
    </TableRow>
  );
}
