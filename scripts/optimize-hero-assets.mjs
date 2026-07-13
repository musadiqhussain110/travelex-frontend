import sharp from "sharp"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")

const assets = [
  {
    input: "src/assets/hero/umrah/finals.png",
    output: "src/assets/hero/umrah/finals-optimized.webp",
    width: 900,
    quality: 82,
  },
  {
    input: "src/assets/hero/tours/tours.png",
    output: "src/assets/hero/tours/tours-optimized.webp",
    width: 900,
    quality: 82,
  },
  {
    input: "src/assets/hero/consultant.png",
    output: "src/assets/hero/consultant-optimized.webp",
    width: 1400,
    quality: 82,
  },
]

async function optimizeHeroAssets() {
  for (const asset of assets) {
    const inputPath = path.join(root, asset.input)
    const outputPath = path.join(root, asset.output)

    await sharp(inputPath)
      .rotate()
      .resize({
        width: asset.width,
        withoutEnlargement: true,
      })
      .webp({
        quality: asset.quality,
        alphaQuality: 90,
        effort: 6,
      })
      .toFile(outputPath)

    console.log(`Optimized: ${asset.input}`)
    console.log(`       -> ${asset.output}`)
  }

  console.log("\nHero assets optimized successfully.")
}

optimizeHeroAssets().catch((error) => {
  console.error("Hero optimization failed:", error)
  process.exit(1)
})