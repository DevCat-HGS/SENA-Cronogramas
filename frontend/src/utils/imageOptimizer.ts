import sharp from 'sharp';

export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options = { quality: 80, width: 800 }
) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || metadata.width > options.width) {
      image.resize(options.width);
    }

    await image
      .webp({ quality: options.quality })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return false;
  }
} 