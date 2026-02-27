import { expect, test, describe } from "bun:test";
import {
  isUserManagementPermission,
  isProductManagementPermission,
  isReadOnlyPermission,
  isWritePermission,
  getPermissionCategory,
  getPermissionAction,
  isAdminRole,
  isVendorRole,
  isCustomerRole,
  getRoleLevel,
  hasHigherPrivileges,
  getResourcePermissions,
  getResourceReadPermissions,
  getResourceWritePermissions,
  isPermissionRequiredForAction,
  getRequiredPermission
} from "./permissionUtils";
import { PERMISSIONS, ROLES } from "@/constants/permissions";

describe("permissionUtils", () => {
  describe("isUserManagementPermission", () => {
    test("should return true for user management permissions", () => {
      expect(isUserManagementPermission("read_users")).toBe(true);
      expect(isUserManagementPermission("create_users")).toBe(true);
      expect(isUserManagementPermission("update_users")).toBe(true);
      expect(isUserManagementPermission("delete_users")).toBe(true);
      expect(isUserManagementPermission("view_users")).toBe(true);
      expect(isUserManagementPermission("edit_users")).toBe(true);
    });

    test("should return false for other permissions", () => {
      expect(isUserManagementPermission("read_products")).toBe(false);
      expect(isUserManagementPermission("random_permission")).toBe(false);
    });
  });

  describe("isProductManagementPermission", () => {
    test("should return true for product management permissions", () => {
      expect(isProductManagementPermission("read_products")).toBe(true);
      expect(isProductManagementPermission("create_products")).toBe(true);
      expect(isProductManagementPermission("update_products")).toBe(true);
      expect(isProductManagementPermission("delete_products")).toBe(true);
      expect(isProductManagementPermission("view_products")).toBe(true);
      expect(isProductManagementPermission("edit_products")).toBe(true);
    });

    test("should return false for other permissions", () => {
      expect(isProductManagementPermission("read_users")).toBe(false);
      expect(isProductManagementPermission("random_permission")).toBe(false);
    });
  });

  describe("isReadOnlyPermission", () => {
    test("should return true for read/view permissions", () => {
      expect(isReadOnlyPermission("read_users")).toBe(true);
      expect(isReadOnlyPermission("view_products")).toBe(true);
    });

    test("should return false for write permissions", () => {
      expect(isReadOnlyPermission("create_users")).toBe(false);
      expect(isReadOnlyPermission("update_products")).toBe(false);
    });
  });

  describe("isWritePermission", () => {
    test("should return true for create/update/delete/edit permissions", () => {
      expect(isWritePermission("create_users")).toBe(true);
      expect(isWritePermission("update_products")).toBe(true);
      expect(isWritePermission("delete_roles")).toBe(true);
      expect(isWritePermission("edit_categories")).toBe(true);
    });

    test("should return false for read permissions", () => {
      expect(isWritePermission("read_users")).toBe(false);
      expect(isWritePermission("view_products")).toBe(false);
    });
  });

  describe("getPermissionCategory", () => {
    test("should return correct category for various permissions", () => {
      expect(getPermissionCategory("read_users")).toBe("users");
      expect(getPermissionCategory("create_products")).toBe("products");
      expect(getPermissionCategory("view_orders")).toBe("orders");
      expect(getPermissionCategory("manage_packages")).toBe("packages");
      expect(getPermissionCategory("random")).toBe("other");
    });
  });

  describe("getPermissionAction", () => {
    test("should return correct action for various permissions", () => {
      expect(getPermissionAction("read_users")).toBe("read");
      expect(getPermissionAction("create_products")).toBe("create");
      expect(getPermissionAction("update_orders")).toBe("update");
      expect(getPermissionAction("delete_roles")).toBe("delete");
      expect(getPermissionAction("view_analytics")).toBe("view");
      expect(getPermissionAction("edit_users")).toBe("edit");
      expect(getPermissionAction("manage_shipping")).toBe("manage");
      expect(getPermissionAction("unknown_action")).toBe("unknown");
    });
  });

  describe("role functions", () => {
    test("isAdminRole", () => {
      expect(isAdminRole(ROLES.ADMIN)).toBe(true);
      expect(isAdminRole(ROLES.SUPER_ADMIN)).toBe(true);
      expect(isAdminRole(ROLES.VENDOR)).toBe(false);
    });

    test("isVendorRole", () => {
      expect(isVendorRole(ROLES.VENDOR)).toBe(true);
      expect(isVendorRole(ROLES.STORE_OWNER)).toBe(true);
      expect(isVendorRole(ROLES.ADMIN)).toBe(false);
    });

    test("isCustomerRole", () => {
      expect(isCustomerRole(ROLES.CUSTOMER)).toBe(true);
      expect(isCustomerRole(ROLES.USER)).toBe(true);
      expect(isCustomerRole(ROLES.VENDOR)).toBe(false);
    });

    test("getRoleLevel", () => {
      expect(getRoleLevel(ROLES.SUPER_ADMIN)).toBe(100);
      expect(getRoleLevel(ROLES.ADMIN)).toBe(80);
      expect(getRoleLevel(ROLES.VENDOR)).toBe(60);
      expect(getRoleLevel(ROLES.STORE_OWNER)).toBe(50);
      expect(getRoleLevel(ROLES.CUSTOMER)).toBe(20);
      expect(getRoleLevel(ROLES.USER)).toBe(10);
      expect(getRoleLevel("guest")).toBe(0);
    });

    test("hasHigherPrivileges", () => {
      expect(hasHigherPrivileges(ROLES.SUPER_ADMIN, ROLES.ADMIN)).toBe(true);
      expect(hasHigherPrivileges(ROLES.ADMIN, ROLES.VENDOR)).toBe(true);
      expect(hasHigherPrivileges(ROLES.CUSTOMER, ROLES.SUPER_ADMIN)).toBe(false);
    });
  });

  describe("resource permissions", () => {
    test("getResourcePermissions", () => {
      const perms = getResourcePermissions("users");
      expect(perms).toContain(PERMISSIONS.READ_USERS);
      expect(perms).toContain(PERMISSIONS.CREATE_USERS);
      expect(perms).not.toContain(PERMISSIONS.READ_PRODUCTS);
    });

    test("getResourceReadPermissions", () => {
      const perms = getResourceReadPermissions("users");
      expect(perms).toContain(PERMISSIONS.READ_USERS);
      expect(perms).toContain(PERMISSIONS.VIEW_USERS);
      expect(perms).not.toContain(PERMISSIONS.CREATE_USERS);
    });

    test("getResourceWritePermissions", () => {
      const perms = getResourceWritePermissions("users");
      expect(perms).toContain(PERMISSIONS.CREATE_USERS);
      expect(perms).toContain(PERMISSIONS.UPDATE_USERS);
      expect(perms).toContain(PERMISSIONS.DELETE_USERS);
      expect(perms).toContain(PERMISSIONS.EDIT_USERS);
      expect(perms).not.toContain(PERMISSIONS.READ_USERS);
    });
  });

  describe("action required permissions", () => {
    test("isPermissionRequiredForAction", () => {
      expect(isPermissionRequiredForAction("read", "users")).toBe(true);
      expect(isPermissionRequiredForAction("manage", "packages")).toBe(true);
      expect(isPermissionRequiredForAction("invalid", "users")).toBe(false);
      expect(isPermissionRequiredForAction("read", "invalid_resource")).toBe(false);
    });

    test("getRequiredPermission", () => {
      expect(getRequiredPermission("read", "users")).toBe(PERMISSIONS.READ_USERS);
      expect(getRequiredPermission("manage", "packages")).toBe(PERMISSIONS.MANAGE_PACKAGES);
      expect(getRequiredPermission("invalid", "users")).toBeNull();
    });
  });
});
