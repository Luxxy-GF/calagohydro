/* Hydrodactyl VirtualizedList presentation, with Calagopus pagination and selection. */
import { Table as MantineTable } from '@mantine/core';
import { Children, type ComponentProps } from 'react';
import Table, { ErrorItems, NoItems, Pagination } from '@/elements/data-display/Table.tsx';
import Spinner from '@/elements/feedback/Spinner.tsx';

export default function ResourceList({
  columns,
  loading,
  error,
  pagination,
  onPageSelect,
  empty,
  children,
}: ComponentProps<typeof Table>) {
  const selection = columns.find((column) => typeof column === 'object' && column.content !== undefined);
  const hasRows = (pagination?.data.length ?? Children.count(children)) > 0;
  return (
    <div className='hydro-resource-list' aria-busy={loading}>
      {!error && hasRows && selection && typeof selection === 'object' && (
        <div className='hydro-resource-select-all'>{selection.content}</div>
      )}
      {loading && <Spinner.Centered />}
      {error ? (
        <ErrorItems error={error} />
      ) : pagination?.total === 0 && !loading ? (
        <div className='hydro-resource-empty'>{empty ?? <NoItems />}</div>
      ) : (
        <MantineTable className={`hydro-resource-table ${loading ? 'hydro-loading' : ''}`}>
          <MantineTable.Tbody>{children}</MantineTable.Tbody>
        </MantineTable>
      )}
      {!error && pagination && onPageSelect && <Pagination data={pagination} onPageSelect={onPageSelect} mt='md' />}
    </div>
  );
}
