import sharp from "sharp"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, "..")

const images = [
  {
    input: "src/assets/tours/malaysia.jpg",
    output: "src/assets/tours/malaysia-optimized.webp",
    width: 1200,
    quality: 80,
  },
  {
    input: "src/assets/Hotels/custom-hotel.jpg",
    output: "src/assets/Hotels/custom-hotel-optimized.webp",
    width: 1600,
    quality: 80,
  },
  {
    input: "src/assets/tours/dubai.jpg",
    output: "src/assets/tours/dubai-optimized.webp",
    width: 1200,
    quality: 80,
  },
  {
    input: "src/assets/contact/contact.jpg",
    output: "src/assets/contact/contact-optimized.webp",
    width: 1600,
    quality: 80,
  },
  {
    input: "src/assets/hero/banner-bg1.png",
    output: "src/assets/hero/banner-bg1-optimized.webp",
    width: 1920,
    quality: 82,
  },
  {
    input: "src/assets/visa/visa-page.jpg",
    output: "src/assets/visa/visa-page-optimized.webp",
    width: 1600,
    quality: 80,
  },
  {
    input: "src/assets/tours/tour.jpg",
    output: "src/assets/tours/tour-optimized.webp",
    width: 1600,
    quality: 80,
  },
  {
    input: "src/assets/tours/istanbul.jpg",
    output: "src/assets/tours/istanbul-optimized.webp",
    width: 1200,
    quality: 80,
  },
  {
    input: "src/assets/Cars/car-rental.jpg",
    output: "src/assets/Cars/car-rental-optimized.webp",
    width: 1600,
    quality: 80,
  },
  {
    input: "src/assets/hero/visa/thailand.png",
    output: "src/assets/hero/visa/thailand-optimized.webp",
    width: 1080,
    quality: 82,
  },
]

async function optimizeImages() {
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

  console.log("\nAll images optimized successfully.")
}

optimizeImages().catch((error) => {
  console.error("Image optimization failed:", error)
  process.exit(1)
})