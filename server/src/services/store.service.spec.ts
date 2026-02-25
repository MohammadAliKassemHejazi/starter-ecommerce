import { describe, expect, test, mock, beforeAll } from "bun:test";

// Mock the database module
const mockStore = {
  findOne: mock(),
  destroy: mock(),
};

// Mock '../models/index'
mock.module("../models/index", () => {
  return {
    default: {
      Store: mockStore,
    },
  };
});

// Mock fs
const mockUnlink = mock(() => Promise.resolve());
mock.module("fs", () => {
  return {
    promises: {
      unlink: mockUnlink,
    },
  };
});

describe("store.service", () => {
  test("deleteStore should remove images and delete store", async () => {
    // Import the service dynamically to ensure mocks are active
    const { deleteStore } = await import("./store.service");

    const storeId = "store123";
    const userId = "user456";
    const imageFilename = "test-image.jpg";

    // Setup mock return values
    mockStore.findOne.mockResolvedValue({
      id: storeId,
      userId: userId,
      imgUrl: imageFilename,
    });
    mockStore.destroy.mockResolvedValue(1);
    mockUnlink.mockClear();

    // Execute
    const result = await deleteStore(storeId, userId);

    // Verify
    expect(result).toEqual({ message: 'store and associated images deleted successfully' });

    expect(mockStore.findOne).toHaveBeenCalledWith({
      where: { id: storeId, userId },
      raw: true
    });

    // Check if unlink was called
    expect(mockUnlink).toHaveBeenCalled();
    const calledPath = mockUnlink.mock.calls[0][0] as string;
    expect(calledPath).toContain("compressed");
    expect(calledPath).toContain(imageFilename);

    expect(mockStore.destroy).toHaveBeenCalledWith({ where: { id: storeId, userId } });
  });
});
