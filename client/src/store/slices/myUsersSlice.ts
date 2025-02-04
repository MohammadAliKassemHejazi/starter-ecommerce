import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as userService from "@/services/myUsersService";

interface UserState {
  users: any[];
  error: string | null;
}

const initialState: UserState = {
  users: [],
  error: null,
};

export const fetchUsersByCreator = createAsyncThunk(
  "users/fetchUsersByCreator",
  async () => {
    return userService.fetchUsersByCreator();
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data: { name: string; email: string; password: string,createdById:string }) => {
    return userService.createUser(data);
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data: { id: string; name?: string; email?: string }) => {
    return userService.updateUser(data);
  }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id: string) => {
  return userService.deleteUser(id);
});

export const assignRoleToUser = createAsyncThunk(
  "users/assignRoleToUser",
  async (data: { userId: string; roleId: string }) => {
    return userService.assignRoleToUser(data);
  }
);

export const removeRoleFromUser = createAsyncThunk(
  "users/removeRoleFromUser",
  async (data: { userId: string; roleId: string }) => {
    return userService.removeRoleFromUser(data);
  }
);



const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsersByCreator.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((user: any) => user.id !== action.meta.arg);
    });
  },
});

export const usersSelector = (state: any) => state.users.users;

export default userSlice.reducer;