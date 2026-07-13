import sharp from "sharp"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")

const images = [
  {
    input: "src/assets/tours/baku.jpg",
    output: "src/assets/tours/baku-optimized.webp",
    width: 900,
    quality: 76,
  },
  {
    input: "src/assets/tours/malaysia.jpg",
    output: "src/assets/tours/malaysia-optimized-v2.webp",
    width: 900,
    quality: 76,
  },
  {
    input: "src/assets/Hotels/Hotel5.jpg",
    output: "src/assets/Hotels/Hotel5-optimized.webp",
    width: 1400,
    quality: 78,
  },
  {
    input: "src/assets/Hotels/makkahHotel4.jpg",
    output: "src/assets/Hotels/makkahHotel4-optimized.webp",
    width: 1400,
    quality: 78,
  },
]

async function optimize() {
  for (const image of images) {
    const inputPath = path.join(root, image.input)
    const outputPath = path.join(root, image.output)

    await sharp(inputPath)
      .rotate()
      .resize({
        width: image.width,
        withoutEnlargement: true,
      })
      .webp({
        quality: image.quality,
        effort: 6,
      })
      .toFile(outputPath)

    console.log(`Optimized: ${image.input}`)
    console.log(`       -> ${image.output}`)
  }

  console.log("\nTours and Hotels images optimized successfully.")
}

optimize().catch((error) => {
  console.error("Optimization failed:", error)
  process.exit(1)
})