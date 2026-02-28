// @/store/slices/permissionSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as permissionService from "@/services/permissionService";
import { RootState } from "../store";

export interface PermissionModel {
  id: string;
  name: string;
}

interface PermissionState {
  permissions: PermissionModel[];
  error: string | null;
}

const initialState: PermissionState = {
  permissions: [],
  error: null,
};

// Thunks
export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async () => {
    return permissionService.fetchPermissions();
  }
);

export const createPermission = createAsyncThunk(
  "permissions/createPermission",
  async (data: { name: string }) => {
    return permissionService.createPermission(data);
  }
);

export const updatePermission = createAsyncThunk(
  "permissions/updatePermission",
  async (data: { id: string; name: string }) => {
    return permissionService.updatePermission(data.id, { name: data.name });
  }
);

export const deletePermission = createAsyncThunk(
  "permissions/deletePermission",
  async (id: string) => {
    return permissionService.deletePermission(id);
  }
);



export const addPermissionToRole = createAsyncThunk(
  "permissions/addPermissionToRole",
  async (data: { roleId: string; permissionId: string }) => {
    return permissionService.addPermissionToRole(data.roleId, data.permissionId);
  }
);

export const removePermissionFromRole = createAsyncThunk(
  "permissions/removePermissionFromRole",
  async (data: { roleId: string; permissionId: string }) => {
    return permissionService.removePermissionFromRole(data.roleId, data.permissionId);
  }
);

// Slice
const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
    extraReducers: (builder) => {
      


    // Handle adding a permission to a role
    builder.addCase(addPermissionToRole.fulfilled, (state, action) => {
      const { roleId, permission } = action.payload;
      const roleIndex = state.permissions.findIndex((perm: PermissionModel & {permissions?: PermissionModel[]}) => perm.id === roleId);
      if (roleIndex !== -1) {
        (state.permissions[roleIndex] as any).permissions.push(permission);
      }
    });

    // Handle removing a permission from a role
    builder.addCase(removePermissionFromRole.fulfilled, (state, action) => {
      const { roleId, permissionId } = action.meta.arg;
      const roleIndex = state.permissions.findIndex((perm: PermissionModel & {permissions?: PermissionModel[]}) => perm.id === roleId);
      if (roleIndex !== -1) {
        (state.permissions[roleIndex] as any).permissions = (state.permissions[
          roleIndex
        ] as any).permissions.filter((perm: PermissionModel) => perm.id !== permissionId);
      }
    });
    builder.addCase(fetchPermissions.fulfilled, (state, action) => {
      state.permissions = action.payload;
    });
    builder.addCase(createPermission.fulfilled, (state, action) => {
      state.permissions.push(action.payload);
    });
    builder.addCase(updatePermission.fulfilled, (state, action) => {
      const index = state.permissions.findIndex(
        (perm: PermissionModel) => perm.id === action.meta.arg.id
      );
      if (index !== -1) {
        state.permissions[index] = action.payload;
      }
    });
    builder.addCase(deletePermission.fulfilled, (state, action) => {
      state.permissions = state.permissions.filter(
        (perm: PermissionModel) => perm.id !== action.meta.arg
      );
    });
  },
});

export const permissionsSelector = (state: RootState): PermissionModel[] | undefined => state.permission.permissions;

export default permissionSlice.reducer;