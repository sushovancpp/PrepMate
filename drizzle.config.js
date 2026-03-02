/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
   url:'postgresql://neondb_owner:npg_yvIr1Qi6OtKd@ep-still-truth-a8cqnbh2-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
    }
  };