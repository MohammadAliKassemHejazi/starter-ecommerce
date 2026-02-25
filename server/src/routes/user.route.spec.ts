
import { describe, it, expect, mock, beforeAll } from "bun:test";

// Mock the middleware module
const protectedRoutesMock = mock((router: any, routesToProtect: string[]) => {
  // We can store the routesToProtect to verify them later
  (router as any).__protectedRoutes = routesToProtect;
});

// We need to mock the module before importing the file that uses it.
mock.module("../middlewares", () => ({
  protectedRoutes: protectedRoutesMock,
  verifyToken: () => {}, // Mock other exports if needed
}));

// We also need to mock the controller because it is imported in user.route.ts
mock.module("../controllers/user.controller", () => ({
  handleFetchUsersByCreator: () => {},
  handleCreateUser: () => {},
  handleUpdateUser: () => {},
  handleDeleteUser: () => {},
  handleAssignRoleToUser: () => {},
  handleRemoveRoleFromUser: () => {},
}));

describe("User Routes Security", () => {
  it("should configure protected routes correctly", async () => {
    // Import the router after mocking
    const routerModule = await import("./user.route");
    const router = routerModule.default;

    // Check if protectedRoutes was called
    expect(protectedRoutesMock).toHaveBeenCalled();

    // Check the arguments passed to protectedRoutes
    const calls = protectedRoutesMock.mock.calls;
    const protectedRoutesList = calls[0][1];

    console.log("Protected Routes List:", protectedRoutesList);

    // Verify that the critical routes are protected
    // The previous vulnerability was missing "/:id" and having incorrect "/update/:id"

    // We expect the correct paths
    expect(protectedRoutesList).toContain("/:id");
    expect(protectedRoutesList).toContain("/");
    expect(protectedRoutesList).toContain("/:userId/roles");
    expect(protectedRoutesList).toContain("/:userId/roles/:roleId");

    // We expect the INCORRECT paths to NOT be present
    expect(protectedRoutesList).not.toContain("/update/:id");
    expect(protectedRoutesList).not.toContain("/delete/:id");
    expect(protectedRoutesList).not.toContain("/create");
  });
});
