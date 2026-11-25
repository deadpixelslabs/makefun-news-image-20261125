import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const image = await readFile(new URL('./artwork.jpg', import.meta.url));
const jpegStart = Buffer.from([0xff, 0xd8]);
const jpegEnd = Buffer.from([0xff, 0xd9]);

if (
  image.length < 4 ||
  image.length > 1024 * 1024 ||
  !image.subarray(0, 2).equals(jpegStart) ||
  !image.subarray(-2).equals(jpegEnd)
) {
  throw new Error('Artwork must be a complete JPEG of at most 1 MiB.');
}

const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
await mkdir(destination, { recursive: true });
await writeFile(join(destination, 'entry.png'), image);
