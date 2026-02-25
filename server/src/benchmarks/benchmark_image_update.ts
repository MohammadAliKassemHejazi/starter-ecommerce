import { performance } from 'perf_hooks';

// Simulate DB Latency (e.g., 5ms network round trip + query time)
const DB_LATENCY_MS = 5;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Database
const mockDb = {
  ProductImage: {
    create: async (data: any) => {
      await delay(DB_LATENCY_MS);
      return { ...data, id: 'mock-id' };
    },
    bulkCreate: async (data: any[]) => {
      await delay(DB_LATENCY_MS); // Bulk insert is 1 round trip
      return data.map(d => ({ ...d, id: 'mock-id' }));
    },
    destroy: async () => {
        // No-op for mock
    }
  }
};

// Mock Files
const createMockFiles = (count: number): any[] => {
  return Array.from({ length: count }).map((_, i) => ({
    filename: `image-${i}.jpg`,
  }));
};

// --- LOGIC UNDER TEST ---

// 1. The "Optimized" Version (matches current shop.service.ts logic)
const fastUpdateImages = async (db: any, productId: string, files: any[]) => {
    if (files.length > 0) {
      const imageRecords = files.map((file) => ({
        productId,
        imageUrl: `${file.filename}`,
      }));
      await db.ProductImage.bulkCreate(imageRecords);
    }
};

// 2. The "Slow" Version (The N+1 Anti-Pattern)
const slowUpdateImages = async (db: any, productId: string, files: any[]) => {
    if (files.length > 0) {
      for (const file of files) {
       await db.ProductImage.create({
          productId,
          imageUrl: `${file.filename}`,
        });
      }
    }
};

// --- BENCHMARK ---

const runBenchmark = async () => {
  try {
    const NUM_FILES = 100;
    const files = createMockFiles(NUM_FILES);
    const productId = 'test-product-id';

    console.log(`\n🚀 Starting Benchmark (Simulated DB Latency: ${DB_LATENCY_MS}ms)`);
    console.log(`   Items to insert: ${NUM_FILES}`);

    // Measure Slow Version
    const startSlow = performance.now();
    await slowUpdateImages(mockDb, productId, files);
    const endSlow = performance.now();
    const durationSlow = endSlow - startSlow;
    console.log(`\n❌ Slow Loop Version: ${durationSlow.toFixed(2)} ms`);
    console.log(`   (Expected ~${NUM_FILES * DB_LATENCY_MS}ms)`);

    // Measure Fast Version
    const startFast = performance.now();
    await fastUpdateImages(mockDb, productId, files);
    const endFast = performance.now();
    const durationFast = endFast - startFast;
    console.log(`\n⚡ Fast Bulk Version: ${durationFast.toFixed(2)} ms`);
    console.log(`   (Expected ~${DB_LATENCY_MS}ms)`);

    // Calculate improvement
    const improvement = durationSlow / durationFast;
    console.log(`\n📊 Improvement Factor: ${improvement.toFixed(2)}x faster`);

    // Validation
    if (improvement < 10) {
        console.warn('⚠ Improvement factor seems low. Check logic.');
        process.exit(1);
    } else {
        console.log('✅ Optimization verified successfully.');
        process.exit(0);
    }

  } catch (error) {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  }
};

runBenchmark();
