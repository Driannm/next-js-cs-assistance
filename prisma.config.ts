import "dotenv/config";
import { defineConfig } from "@prisma/internals";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Prisma otomatis baca process.env, jadi lo ga perlu "env()"
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
