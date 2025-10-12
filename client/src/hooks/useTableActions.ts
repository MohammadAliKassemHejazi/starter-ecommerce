import { useRouter } from 'next/router';
import { TableAction } from '@/components/UI/ModernTable';
import { showConfirm, showToast } from '@/components/UI/PageComponents/ToastConfig';

interface UseTableActionsOptions {
  editPath?: string;
  viewPath?: string;
  deleteAction?: (id: string) => Promise<void>;
  assignRolePath?: string;
  customActions?: TableAction[];
}

export const useTableActions = (options: UseTableActionsOptions = {}) => {
  const router = useRouter();
  const {
    editPath,
    viewPath,
    deleteAction,
    assignRolePath,
    customActions = []
  } = options;

  const handleEdit = (item: any) => {
    if (editPath) {
      router.push(`${editPath}?id=${item.id}`);
    }
  };

  const handleView = (item: any) => {
    if (viewPath) {
      router.push(`${viewPath}/${item.id}`);
    }
  };

  const handleDelete = async (item: any) => {
    if (!deleteAction) {return;}

    const result = await showConfirm({
      title: 'Are you sure?',
      text: `You won't be able to revert this action!`,
      confirmText: 'Yes, delete it!',
      cancelText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteAction(item.id);
        showToast.success('Item deleted successfully');
      } catch (error) {
        showToast.error('Failed to delete item');
      }
    }
  };

  const handleAssignRole = (item: any) => {
    if (assignRolePath) {
      router.push(`${assignRolePath}?id=${item.id}`);
    }
  };

  const defaultActions: TableAction[] = [
    ...(viewPath ? [{
      key: 'view',
      label: 'View',
      icon: 'bi bi-eye',
      variant: 'info' as const,
      onClick: handleView
    }] : []),
    ...(editPath ? [{
      key: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      variant: 'primary' as const,
      onClick: handleEdit
    }] : []),
    ...(deleteAction ? [{
      key: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      variant: 'danger' as const,
      onClick: handleDelete
    }] : []),
    ...(assignRolePath ? [{
      key: 'assign-role',
      label: 'Assign Role',
      icon: 'bi bi-person-gear',
      variant: 'success' as const,
      onClick: handleAssignRole
    }] : []),
    ...customActions
  ];

  return {
    actions: defaultActions,
    handleEdit,
    handleView,
    handleDelete,
    handleAssignRole
  };
};

export default useTableActions;
