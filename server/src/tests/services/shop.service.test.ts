import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";

// 1. Define mocks BEFORE importing the module under test
const mockTransaction = {
  commit: mock(() => Promise.resolve()),
  rollback: mock(() => Promise.resolve()),
};

const mockProduct = {
  id: "product-123",
  toJSON: () => ({ id: "product-123", name: "Test Product" }),
  update: mock(() => Promise.resolve()),
};

const mockSequelize = {
  transaction: mock(() => Promise.resolve(mockTransaction)),
  fn: mock(() => {}),
  col: mock(() => {}),
};

const mockDb = {
  sequelize: mockSequelize,
  Product: {
    create: mock(() => Promise.resolve(mockProduct)),
    findByPk: mock(() => Promise.resolve(mockProduct)),
    update: mock(() => Promise.resolve()),
  },
  ProductImage: {
    bulkCreate: mock(() => Promise.resolve([])),
  },
  SizeItem: {
    bulkCreate: mock(() => Promise.resolve([])),
    destroy: mock(() => Promise.resolve()),
  },
  Comment: {
    findAll: mock(() => Promise.resolve([])),
  }
};

// 2. Mock the module using bun:test's mock.module
mock.module("../../models/index", () => {
  return {
    default: mockDb,
  };
});

// 3. Import the service AFTER mocking
import { createProductWithImages, updateProductWithImages } from "../../services/shop.service";

describe("shopService", () => {
  const mockFiles = [
    { filename: "image1.jpg" },
    { filename: "image2.jpg" },
  ] as any;

  const productData = {
    name: "Test Product",
    price: 100,
    description: "A test product",
    sizes: [{ sizeId: "size-1", quantity: 10 }],
  } as any;

  beforeEach(() => {
    // Clear mock history before each test
    mockSequelize.transaction.mockClear();
    mockTransaction.commit.mockClear();
    mockTransaction.rollback.mockClear();
    mockDb.Product.create.mockClear();
    mockDb.Product.findByPk.mockClear();
    mockDb.ProductImage.bulkCreate.mockClear();
    mockDb.SizeItem.bulkCreate.mockClear();
    mockDb.SizeItem.destroy.mockClear();
  });

  describe("createProductWithImages", () => {
    it("should create a product and images within a transaction", async () => {
      await createProductWithImages(productData, mockFiles);

      // Verify transaction started
      expect(mockSequelize.transaction).toHaveBeenCalled();

      // Verify Product creation used transaction
      expect(mockDb.Product.create).toHaveBeenCalledWith(
        expect.objectContaining(productData),
        expect.objectContaining({ transaction: expect.anything() })
      );

      // Verify ProductImage bulkCreate used transaction
      expect(mockDb.ProductImage.bulkCreate).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ imageUrl: "image1.jpg", productId: "product-123" }),
          expect.objectContaining({ imageUrl: "image2.jpg", productId: "product-123" }),
        ]),
        expect.objectContaining({ transaction: expect.anything() })
      );

      // Verify SizeItem bulkCreate used transaction
      expect(mockDb.SizeItem.bulkCreate).toHaveBeenCalledWith(
          expect.arrayContaining([
              expect.objectContaining({ sizeId: "size-1", quantity: 10, productId: "product-123" })
          ]),
          expect.objectContaining({ transaction: expect.anything() })
      )

      // Verify commit was called
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });

    it("should rollback transaction if product creation fails", async () => {
      // Force Product.create to fail
      mockDb.Product.create.mockImplementationOnce(() => Promise.reject(new Error("Creation failed")));

      try {
        await createProductWithImages(productData, mockFiles);
      } catch (error) {
        expect(error).toBeDefined();
      }

      expect(mockTransaction.commit).not.toHaveBeenCalled();
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe("updateProductWithImages", () => {
    const productId = "product-123";

    it("should update product and images within a transaction", async () => {
      await updateProductWithImages(productId, productData, mockFiles);

      expect(mockSequelize.transaction).toHaveBeenCalled();

      // Verify findByPk used transaction
      expect(mockDb.Product.findByPk).toHaveBeenCalledWith(productId, expect.objectContaining({ transaction: expect.anything() }));

      // Verify update used transaction (called on the instance)
      expect(mockProduct.update).toHaveBeenCalledWith(productData, expect.objectContaining({ transaction: expect.anything() }));

      // Verify SizeItem destroy used transaction
      expect(mockDb.SizeItem.destroy).toHaveBeenCalledWith(expect.objectContaining({ where: { productId }, transaction: expect.anything() }));

      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it("should rollback if product not found", async () => {
      mockDb.Product.findByPk.mockResolvedValueOnce(null);

      try {
        await updateProductWithImages(productId, productData, mockFiles);
      } catch (e) {
        expect(e).toBeDefined();
      }

      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
