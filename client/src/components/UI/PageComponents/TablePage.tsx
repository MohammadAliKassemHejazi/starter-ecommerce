import React from 'react';
import { ModernTable, TableColumn, TableAction } from '@/components/UI/ModernTable';
import { PageLayout } from './PageLayout';
import { ActionGroup, createActionButtons } from './ActionButtons';
import { useTableActions } from '@/hooks/useTableActions';

interface TablePageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  headerActions?: React.ReactNode;
  // Action button configurations
  addButton?: {
    href: string;
    label?: string;
  };
  exportButton?: {
    onClick: () => void;
    label?: string;
  };
  filterButton?: {
    onClick: () => void;
    label?: string;
  };
  // Table action configurations
  editPath?: string;
  viewPath?: string;
  deleteAction?: (id: string) => Promise<void>;
  assignRolePath?: string;
  customActions?: TableAction[];
  protected?: boolean;
}

export const TablePage: React.FC<TablePageProps> = ({
  title,
  subtitle,
  breadcrumbs,
  data,
  columns,
  actions,
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  pagination = true,
  pageSize = 10,
  onRowClick,
  emptyMessage,
  headerActions,
  addButton,
  exportButton,
  filterButton,
  editPath,
  viewPath,
  deleteAction,
  assignRolePath,
  customActions,
  protected: isProtected = true
}) => {
  const { actions: tableActions } = useTableActions({
    editPath,
    viewPath,
    deleteAction,
    assignRolePath,
    customActions
  });

  const finalActions = actions || tableActions;

  const pageActions = [];
  
  if (addButton) {
    pageActions.push(createActionButtons.add(addButton.href, addButton.label));
  }
  
  if (exportButton) {
    pageActions.push(createActionButtons.export(exportButton.onClick, exportButton.label));
  }
  
  if (filterButton) {
    pageActions.push(createActionButtons.filter(filterButton.onClick, filterButton.label));
  }

  const headerActionsContent = headerActions || (pageActions.length > 0 ? (
    <ActionGroup actions={pageActions} />
  ) : undefined);

  return (
    <PageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      actions={headerActionsContent}
      protected={isProtected}
    >
      <div className="row">
        <div className="col-12">
          <ModernTable
            data={data}
            columns={columns}
            actions={finalActions}
            loading={loading}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            pagination={pagination}
            pageSize={pageSize}
            onRowClick={onRowClick}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default TablePage;
