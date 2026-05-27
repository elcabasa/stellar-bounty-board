import "dotenv/config";
import { app } from "./app";
import { logStructured } from "./logger";

const port = Number(process.env.PORT ?? 3001);

// Warn operators who have not yet configured the admin API key hash.
// The GET /api/audit-log endpoint will return 500 until this is set.
// Generate the hash once with: node scripts/hash-admin-key.js <your-key>
if (!process.env.ADMIN_API_KEY_HASH) {
  logStructured("warn", "admin_api_key_hash_missing", {
    hint: "Set ADMIN_API_KEY_HASH in your environment. Run: node scripts/hash-admin-key.js <key>",
  });
}

app.listen(port, () => {
  logStructured("info", "server_listen", { port });
});
