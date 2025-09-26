import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUsersByCreator, deleteUser, usersSelector } from "@/store/slices/myUsersSlice";
import { useAppDispatch } from "@/store/store";
import { UserManager } from "@/components/User/UserManager";
import { UserTablePreset } from "@/components/UI/ModernTable";
import { TablePage } from "@/components/UI/PageComponents";
import { usePageData } from "@/hooks/usePageData";

const UsersGrid = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(usersSelector);
  const { isSuperAdmin, loading } = usePageData({ loadUserPackage: true });

  useEffect(() => {
    dispatch(fetchUsersByCreator());
  }, [dispatch]);

  const handleDeleteUser = async (id: string) => {
    await dispatch(deleteUser(id));
  };

  // Transform users data to include avatar
  const transformedUsers = users?.map((user: any) => ({
    ...user,
    avatar: user.avatar || null
  })) || [];

  return (
    <>
      {/* Super Admin User Management */}
      {isSuperAdmin && (
        <div className="mb-4">
          <UserManager isSuperAdmin={isSuperAdmin} />
        </div>
      )}
      
      <TablePage
        title="Users"
        subtitle="Manage your users and their roles"
        data={transformedUsers}
        columns={UserTablePreset.columns}
        loading={loading}
        searchPlaceholder="Search users..."
        emptyMessage="No users found. Create your first user to get started!"
        addButton={{ href: '/users/create', label: 'New User' }}
        editPath="/users/edit"
        assignRolePath="/users/assign-role"
        deleteAction={handleDeleteUser}
        exportButton={{ onClick: () => console.log('Export users') }}
        filterButton={{ onClick: () => console.log('Filter users') }}
      />
    </>
  );
};

export default UsersGrid;