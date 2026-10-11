// Responsive versions of CMS images in public/images/.
//
// Keystatic stores images as plain /images/… paths in public/, which Astro's
// image pipeline doesn't process. This helper reads real dimensions at build
// time and builds a srcset of resized copies at /_img/w<width>/images/….
// Those copies are made by src/integrations/resized-images.mjs: on the fly in
// dev, and written into the build output for every URL the pages reference.
import path from 'node:path';
import sharp from 'sharp';

export const WIDTHS = [640, 1080, 1600, 2200];

const VARIANT_RE = /^\/_img\/w(\d+)(\/images\/[^?#]+)$/;

export const variantUrl = (src, w) => `/_img/w${w}${src}`;

// '/_img/w1080/images/a/b.jpg' → { width: 1080, src: '/images/a/b.jpg' }, or null
export function parseVariantUrl(url) {
  const m = url.match(VARIANT_RE);
  if (!m) return null;
  const width = Number(m[1]);
  const src = decodeURI(m[2]);
  if (!WIDTHS.includes(width) || src.includes('..')) return null;
  return { width, src };
}

const sourcePath = (src) => path.join(process.cwd(), 'public', decodeURI(src));

// Real (EXIF-rotated) dimensions plus a srcset that tops out at the largest
// resized width, or at the original when it's smaller than that.
export async function imageInfo(src) {
  const meta = await sharp(sourcePath(src)).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const sizes = WIDTHS.filter((w) => w < width);
  const entries = sizes.map((w) => ({ url: variantUrl(src, w), w }));
  if (width <= WIDTHS.at(-1)) entries.push({ url: src, w: width });

  return {
    src,
    width,
    height,
    srcset: entries.map((e) => `${e.url} ${e.w}w`).join(', '),
    small: entries[0].url,
    large: entries.at(-1).url,
  };
}

export function resizeImage(src, width) {
  return sharp(sourcePath(src))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, force: false })
    .webp({ quality: 80, force: false })
    .png({ force: false })
    .toBuffer();
}

export function contentType(src) {
  const ext = path.extname(src).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}
