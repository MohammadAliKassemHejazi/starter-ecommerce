import React, { useState } from "react";
import Swal from "sweetalert2";
import { createUser, usersSelector } from "@/store/slices/myUsersSlice";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import router from "next/router";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const CreateUserModal = () => {
  const dispatch = useAppDispatch();
  const currentUser = useSelector(usersSelector);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        createUser({
          name,
          email,
          password,
          createdById: currentUser.id,
        })
      ).unwrap();
      Toast.fire({
        icon: "success",
        title: "User created successfully",
      });
      if (response.id) {
        void router.push(`/users`); // Redirect to the new user page
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to create user",
      });
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row justify-content-center py-5 vh-100">
          <div className="col-lg-9 col-md-12 mb-4">
            <form onSubmit={handleCreateUser} className="mt-5">
              <h1 className="mb-4">Create User</h1>

              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="InputUserName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={150}
                  className="form-control"
                  id="InputUserName"
                  placeholder="Enter user name"
                  required
                />
                <small id="userNameHelp" className="form-text text-muted">
                  Input the users name here.
                </small>
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="InputUserEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="InputUserEmail"
                  placeholder="Enter user email"
                  required
                />
                <small id="userEmailHelp" className="form-text text-muted">
                  Input the users email here.
                </small>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="InputUserPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  className="form-control"
                  id="InputUserPassword"
                  placeholder="Enter user password"
                  required
                />
                <small id="userPasswordHelp" className="form-text text-muted">
                  Input the user password here (minimum 6 characters).
                </small>
              </div>

              {/* Buttons */}
              <Link href="/users">
                <button type="button" className="btn btn-secondary mt-3 me-3">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="btn btn-primary mt-3">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default protectedRoute(CreateUserModal);