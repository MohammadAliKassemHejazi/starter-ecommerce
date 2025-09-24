import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUsersByCreator, deleteUser, usersSelector } from "@/store/slices/myUsersSlice";
import Swal from "sweetalert2";
import { useAppDispatch } from "@/store/store";
import Layout from "@/components/Layouts/Layout";
import { UserManager } from "@/components/User/UserManager";
import { getUserActivePackage } from "@/services/packageService";

const UsersGrid = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(usersSelector);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  React.useEffect(() => {
    dispatch(fetchUsersByCreator());
    loadUserPackage();
  }, [dispatch]);

  const loadUserPackage = async () => {
    try {
      const packageData = await getUserActivePackage();
      setIsSuperAdmin(packageData?.Package?.isSuperAdminPackage || false);
    } catch (error) {
      console.error('Error loading user package:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteUser(id));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  return (
    <Layout>
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="mb-4 text-center fw-bold">Users</h1>
          
          {/* Super Admin User Management */}
          {isSuperAdmin && (
            <div className="mb-4">
              <UserManager isSuperAdmin={isSuperAdmin} />
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted">
              Total Users: {users?.length || 0}
            </span>
            <button className="btn btn-primary">New User</button>
          </div>
          <div className="table-responsive shadow-sm bg-white">
            <table className="table table-hover table-bordered border-secondary">
              <thead className="bg-dark text-light text-center">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any, idx: number) => (
                  <tr key={user.id} className="align-middle text-center">
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role?.name || "None"}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-primary btn-sm me-2">Edit</button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                        <button className="btn btn-success btn-sm">Assign Role</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
      </Layout>
  );
};

export default UsersGrid;