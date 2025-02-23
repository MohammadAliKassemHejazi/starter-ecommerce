import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as roleService from "@/services/roleService";
import { RootState } from "../store";

interface RoleState {
  roles: any[];
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  error: null,
};

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  return roleService.fetchRoles();
});

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (data: { name: string }) => {
    return roleService.createRole(data);
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id: string) => {
    return roleService.deleteRole(id);
  }
);


export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (data: { id: string; name: string }) => {
    return roleService.updateRole(data);
  }
);
const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
    extraReducers: (builder) => {
        builder.addCase(updateRole.fulfilled, (state, action) => {
      const { id, name } = action.payload;
      const roleIndex = state.roles.findIndex((role: any) => role.id === id);
      if (roleIndex !== -1) {
        state.roles[roleIndex].name = name;
      }
    });
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
    });
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      state.roles = state.roles.filter((role: any) => role.id !== action.meta.arg);
    });
  },
});

export const rolesSelector = (state: RootState): any | undefined => state.roles.roles;

export default roleSlice.reducer;