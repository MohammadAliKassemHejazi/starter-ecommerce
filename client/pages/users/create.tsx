import React, { useState } from "react";
import Swal from "sweetalert2";
import { createUser, usersSelector } from "@/store/slices/myusersSlice";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";

const CreateUserModal = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const currentUser = useSelector(usersSelector);
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(
        createUser({
          name,
          email,
          password,
          createdById: currentUser.id,
        })
      );
      Swal.fire("Success", "User created successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to create user", "error");
    }
  };

  return (
    <div>
      <h3>Create User</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateUserModal;