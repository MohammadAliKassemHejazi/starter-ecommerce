import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { promises as fsPromises } from 'fs';
import { logger } from '../config/logger';

// 1. Mock the logger
const mockLogger = {
  info: mock(() => {}),
  error: mock(() => {}),
  warn: mock(() => {}),
};
mock.module('../config/logger', () => ({ logger: mockLogger }));

// 2. Mock fs
const mockFs = {
  unlink: mock(() => Promise.resolve()),
};
mock.module('fs', () => ({ promises: mockFs }));

// 3. Mock database
const mockDb = {
  Store: {
    findByPk: mock(),
    findOne: mock(),
    update: mock(() => Promise.resolve()),
    destroy: mock(() => Promise.resolve()),
  },
};
mock.module('../models/index', () => ({ default: mockDb }));

// Import the service AFTER mocking dependencies
const { updateImages, deleteStoreImage, deleteStore } = await import('./store.service');

describe('store.service', () => {
  beforeEach(() => {
    mockDb.Store.findByPk.mockReset();
    mockDb.Store.findOne.mockReset();
    mockDb.Store.update.mockReset();
    mockDb.Store.destroy.mockReset();
    mockFs.unlink.mockReset();
    mockLogger.info.mockReset();
    mockLogger.error.mockReset();
    mockLogger.warn.mockReset();
  });

  describe('updateImages', () => {
    const storeId = 'store-123';
    const files = [{ filename: 'new-image.jpg' }] as Express.Multer.File[];
    const oldImage = 'old-image.jpg';

    it('should update image and log info when old image exists and is deleted', async () => {
      // Setup: Store exists with an old image
      mockDb.Store.findByPk.mockResolvedValue({
        dataValues: { imgUrl: oldImage },
        update: mock(() => Promise.resolve()),
      });

      // Execute
      await updateImages(storeId, files);

      // Verify
      expect(mockFs.unlink).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Deleted old image', expect.objectContaining({ oldImagePath: expect.stringContaining(oldImage) }));
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should log warning when old image file is not found (ENOENT)', async () => {
      // Setup: Store exists, but file deletion fails with ENOENT
      mockDb.Store.findByPk.mockResolvedValue({
        dataValues: { imgUrl: oldImage },
        update: mock(() => Promise.resolve()),
      });
      const error: any = new Error('File not found');
      error.code = 'ENOENT';
      mockFs.unlink.mockRejectedValue(error);

      // Execute
      await updateImages(storeId, files);

      // Verify
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Old image not found, skipping deletion',
        expect.objectContaining({ oldImagePath: expect.stringContaining(oldImage) }),
      );
      // Should still update the store with new image
      expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should log error and throw when file deletion fails with other error', async () => {
      // Setup
      mockDb.Store.findByPk.mockResolvedValue({
        dataValues: { imgUrl: oldImage },
        update: mock(() => Promise.resolve()),
      });
      const error = new Error('Permission denied');
      mockFs.unlink.mockRejectedValue(error);

      // Execute & Verify
      try {
        await updateImages(storeId, files);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to delete old image',
        expect.objectContaining({ oldImagePath: expect.stringContaining(oldImage), error }),
      );
    });

    it('should log error if update fails', async () => {
      mockDb.Store.findByPk.mockRejectedValue(new Error('DB Error'));

      try {
        await updateImages(storeId, files);
      } catch (e) {
        expect(mockLogger.error).toHaveBeenCalledWith('Error updating store image', expect.objectContaining({ error: expect.any(Error) }));
      }
    });
  });

  describe('deleteStoreImage', () => {
    const storeId = 'store-123';
    const userId = 'user-456';
    const oldImage = 'image-to-delete.jpg';

    it('should delete image and log info', async () => {
      mockDb.Store.findOne.mockResolvedValue({
        id: storeId,
        userId: userId,
        imgUrl: oldImage,
      });

      await deleteStoreImage(storeId, userId);

      expect(mockFs.unlink).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('Deleted file', expect.objectContaining({ filePath: expect.stringContaining(oldImage) }));
    });

    it('should log warn if file not found (ENOENT)', async () => {
      mockDb.Store.findOne.mockResolvedValue({
        id: storeId,
        userId: userId,
        imgUrl: oldImage,
      });
      const error: any = new Error('File not found');
      error.code = 'ENOENT';
      mockFs.unlink.mockRejectedValue(error);

      await deleteStoreImage(storeId, userId);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'File not found, skipping deletion',
        expect.objectContaining({ filePath: expect.stringContaining(oldImage) }),
      );
    });

    it('should log error if non-ENOENT error occurs during deletion', async () => {
      mockDb.Store.findOne.mockResolvedValue({
        id: storeId,
        userId: userId,
        imgUrl: oldImage,
      });
      const error = new Error('Disk error');
      mockFs.unlink.mockRejectedValue(error);

      try {
        await deleteStoreImage(storeId, userId);
      } catch (e) {
        expect(mockLogger.error).toHaveBeenCalledWith(
          'Failed to delete file',
          expect.objectContaining({ filePath: expect.stringContaining(oldImage), error }),
        );
      }
    });
  });

  describe('deleteStore', () => {
    const storeId = 'store-123';
    const userId = 'user-456';
    const oldImage = 'store-image.jpg';

    it('should delete store and images', async () => {
      mockDb.Store.findOne.mockResolvedValue({
        id: storeId,
        userId,
        imgUrl: oldImage,
      });

      await deleteStore(storeId, userId);

      expect(mockFs.unlink).toHaveBeenCalled();
      expect(mockDb.Store.destroy).toHaveBeenCalledWith({ where: { id: storeId, userId } });
    });

    it('should log error if image deletion fails', async () => {
      mockDb.Store.findOne.mockResolvedValue({
        id: storeId,
        userId,
        imgUrl: oldImage,
      });
      const error = new Error('Delete failed');
      mockFs.unlink.mockRejectedValue(error);

      await deleteStore(storeId, userId);
      // Logic catches error and logs it, but proceeds to delete store

      expect(mockLogger.error).toHaveBeenCalledWith('Failed to delete image', expect.objectContaining({ error }));
      expect(mockDb.Store.destroy).toHaveBeenCalled();
    });

    it('should throw and log error if store not found', async () => {
      mockDb.Store.findOne.mockResolvedValue(null);

      try {
        await deleteStore(storeId, userId);
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(mockLogger.error).toHaveBeenCalledWith('Error deleting product', expect.objectContaining({ error: expect.any(Error) }));
    });
  });
});
