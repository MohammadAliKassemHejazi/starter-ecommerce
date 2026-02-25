
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { shopMiddleWare } from '../src/middlewares/shop.middleware';
import { Request, Response, NextFunction } from 'express';

// Mock global.__basedir
// @ts-ignore
global.__basedir = path.join(__dirname, '..'); // Points to server/

const UPLOADS_DIR = path.join(global.__basedir, 'uploads');
const COMPRESSED_DIR = path.join(global.__basedir, 'compressed');

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(COMPRESSED_DIR)) fs.mkdirSync(COMPRESSED_DIR, { recursive: true });

async function createDummyFiles(count: number, isImage: boolean = true) {
  const files: any[] = [];

  for (let i = 0; i < count; i++) {
    const fileName = `bench_test_${Date.now()}_${i}.${isImage ? 'jpg' : 'bin'}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    if (isImage) {
      // Create a large image using sharp (2000x2000)
      await sharp({
        create: {
          width: 2000,
          height: 2000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      })
      .jpeg()
      .toFile(filePath);
    } else {
      // Create a 50MB random file
      const size = 50 * 1024 * 1024; // 50MB
      const buffer = Buffer.alloc(size, 'a'); // distinct content not needed, just size
      fs.writeFileSync(filePath, buffer);
    }

    // Mock Multer file object
    files.push({
        fieldname: 'photos',
        originalname: fileName,
        encoding: '7bit',
        mimetype: isImage ? 'image/jpeg' : 'text/plain',
        destination: UPLOADS_DIR,
        filename: fileName,
        path: filePath,
        size: fs.statSync(filePath).size,
        stream: fs.createReadStream(filePath),
        buffer: Buffer.alloc(0)
    });
  }
  return files;
}

async function runBenchmark() {
  console.log('--- Starting Benchmark ---');

  const fileCount = 10;
  // Use non-image files to benchmark pure I/O performance
  const files = await createDummyFiles(fileCount, false);
  console.log(`Created ${fileCount} dummy files (50MB bin).`);

  const req = {
    files: files
  } as unknown as Request;

  const res = {} as Response;
  const next: NextFunction = (err?: any) => {
    if (err) console.error('Next called with error:', err);
  };

  const start = performance.now();

  await shopMiddleWare(req, res, next);

  const end = performance.now();
  console.log(`Benchmark run completed in ${(end - start).toFixed(2)}ms`);

  // Cleanup
  // Original files are deleted by middleware
  // Clean up compressed files
  for (const file of files) {
      const compressedPath = path.join(COMPRESSED_DIR, file.filename);
      try {
        if (fs.existsSync(compressedPath)) {
            fs.unlinkSync(compressedPath);
        }
      } catch (e) {}

      // Just in case middleware failed and didn't delete original
      try {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
      } catch (e) {}
  }
}

async function main() {
    const times: number[] = [];

    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        await runBenchmark();
        const end = performance.now();
        // Since runBenchmark measures internal time, we should capture it there or here.
        // But runBenchmark prints it.
        // Let's just rely on logs.
    }
}

main().catch(console.error);
