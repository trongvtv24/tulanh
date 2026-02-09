/**
 * Script to optimize rank badge images
 * - Resize to multiple sizes (256x256, 64x64)
 * - Compress while maintaining quality
 *
 * Run: node scripts/optimize-badges.mjs
 */

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RANKS_DIR = path.join(__dirname, "../public/ranks");

const SIZES = [
  { suffix: "", width: 256, height: 256 }, // Default size
  { suffix: "-sm", width: 64, height: 64 }, // Thumbnail
  { suffix: "-lg", width: 512, height: 512 }, // Large display
];

const RANKS = ["rank-1", "rank-2", "rank-3", "rank-4", "rank-5"];

async function optimizeBadges() {
  console.log("🖼️  Starting badge optimization...\n");

  for (const rank of RANKS) {
    const inputPath = path.join(RANKS_DIR, `${rank}.png`);

    // Check if file exists
    try {
      await fs.access(inputPath);
    } catch {
      console.log(`⚠️  ${rank}.png not found, skipping...`);
      continue;
    }

    const originalStats = await fs.stat(inputPath);
    console.log(
      `📁 ${rank}.png - Original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`,
    );

    for (const { suffix, width, height } of SIZES) {
      const outputFilename = `${rank}${suffix}-optimized.png`;
      const outputPath = path.join(RANKS_DIR, outputFilename);

      try {
        await sharp(inputPath)
          .resize(width, height, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png({
            quality: 90,
            compressionLevel: 9,
            palette: false,
          })
          .toFile(outputPath);

        const newStats = await fs.stat(outputPath);
        console.log(
          `   ✅ ${outputFilename}: ${(newStats.size / 1024).toFixed(0)} KB (${width}x${height})`,
        );
      } catch (err) {
        console.error(`   ❌ Error processing ${outputFilename}:`, err.message);
      }
    }
    console.log("");
  }

  console.log("🎉 Badge optimization complete!");
  console.log("\n📋 Next steps:");
  console.log("   1. Review the optimized files in /public/ranks/");
  console.log("   2. Replace original files with optimized versions");
  console.log("   3. Update the RankBadge component to use new sizes");
}

optimizeBadges().catch(console.error);
