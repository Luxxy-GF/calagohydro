import getUserActivity from '@/api/me/getUserActivity.ts';
import AccountContentContainer from '@/elements/containers/AccountContentContainer.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { activityColumns } from '@/lib/tableColumns.ts';
import { useSearchablePaginatedTable } from '@/plugins/resource/useSearchablePaginatedTable.ts';
import { useAuth } from '@/providers/AuthProvider.tsx';
import { useTranslations } from '@/providers/TranslationProvider.tsx';
import Table from '../ActivityList.tsx';
import ActivityRow from './ActivityRow.tsx';

export default function DashboardActivity() {
  const { user } = useAuth();
  const { t } = useTranslations();

  const {
    data: activities,
    loading,
    error,
    search,
    setSearch,
    setPage,
  } = useSearchablePaginatedTable({
    queryKey: queryKeys.user.activity.all(),
    fetcher: getUserActivity,
  });

  return (
    <AccountContentContainer
      title={t('pages.account.activity.title', {})}
      search={search}
      setSearch={setSearch}
      registry={window.extensionContext.extensionRegistry.pages.dashboard.activity.container}
    >
      <Table columns={activityColumns()} loading={loading} pagination={activities} onPageSelect={setPage} error={error}>
        {activities?.data.map((activity, index) => (
          <ActivityRow
            key={`${activity.created.toISOString()}-${index}`}
            activity={activity}
            accountScoped
            showAvatar
            avatar={activity.impersonator ?? user}
          />
        ))}
      </Table>
    </AccountContentContainer>
  );
}
