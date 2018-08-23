const { decode } = require("decode-tiff");
const { PNG } = require("pngjs");
const fs = require("fs");

/**
 * Powerpoint converts images into Tiffs, we need to convert them back to PNGs when writing our content to support HTML
 */

export default function convertToPNG(inputPath, outputPath) {
	const { width, height, data } = decode(fs.readFileSync(inputPath));
	const png = new PNG({ width, height });

	png.data = data;
	fs.writeFileSync(outputPath, PNG.sync.write(png));
}
