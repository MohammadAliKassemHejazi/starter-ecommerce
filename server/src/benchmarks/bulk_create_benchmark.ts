import { Sequelize, DataTypes, Model } from 'sequelize';

// Define Interface
interface IProductImageAttributes {
  id?: string;
  productId: string;
  imageUrl: string;
}

// Setup Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
});

class ProductImage extends Model<IProductImageAttributes> implements IProductImageAttributes {
  public id!: string;
  public productId!: string;
  public imageUrl!: string;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ProductImage',
  },
);

async function runBenchmark() {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite established successfully.');

    await sequelize.sync({ force: true });
    console.log('Database synced.');

    const numImages = 1000;
    const productId = 'test-product-id';
    const images = Array.from({ length: numImages }, (_, i) => ({
      productId,
      imageUrl: `image_${i}.jpg`,
    }));

    // Warmup (optional)
    await ProductImage.create({ productId, imageUrl: 'warmup.jpg' });
    await ProductImage.destroy({ where: {} });

    // Benchmark Loop (Unoptimized)
    console.log(`\nStarting Loop Benchmark (Unoptimized) with ${numImages} records...`);
    const startLoop = performance.now();
    for (const img of images) {
      await ProductImage.create(img);
    }
    const endLoop = performance.now();
    const durationLoop = endLoop - startLoop;
    console.log(`Loop Duration: ${durationLoop.toFixed(2)} ms`);

    // Clean up
    await ProductImage.destroy({ where: {}, truncate: true });

    // Benchmark BulkCreate (Optimized)
    console.log(`\nStarting BulkCreate Benchmark (Optimized) with ${numImages} records...`);
    const startBulk = performance.now();
    await ProductImage.bulkCreate(images);
    const endBulk = performance.now();
    const durationBulk = endBulk - startBulk;
    console.log(`BulkCreate Duration: ${durationBulk.toFixed(2)} ms`);

    // Comparison
    const improvement = durationLoop / durationBulk;
    console.log(`\nResults:`);
    console.log(`Loop: ${durationLoop.toFixed(2)} ms`);
    console.log(`BulkCreate: ${durationBulk.toFixed(2)} ms`);
    console.log(`Improvement: ${improvement.toFixed(2)}x faster`);
  } catch (error) {
    console.error('Benchmark failed:', error);
  } finally {
    await sequelize.close();
  }
}

runBenchmark();
