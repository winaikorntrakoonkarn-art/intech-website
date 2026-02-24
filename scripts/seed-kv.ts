import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
});

const DATA_DIR = path.join(process.cwd(), "data");

async function seed() {
  console.log("🚀 Starting KV seed...\n");

  // Seed files that have local data
  const files = ["products.json", "about.json", "services.json", "settings.json"];
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      await redis.set(file, data);
      console.log(`✅ Seeded: ${file}`);
    } else {
      console.log(`⚠️  Skipped (not found): ${file}`);
    }
  }

  // Initialize empty collections if they don't exist
  const emptyCollections = ["orders.json", "quotes.json", "users.json", "reviews.json"];
  for (const file of emptyCollections) {
    const existing = await redis.get(file);
    if (!existing) {
      await redis.set(file, []);
      console.log(`✅ Initialized empty: ${file}`);
    } else {
      console.log(`⏭️  Already exists: ${file}`);
    }
  }

  console.log("\n🎉 Seed complete!");
}

seed().catch(console.error);
