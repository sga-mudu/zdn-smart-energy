// server.js - Next.js custom server for cPanel (CloudLinux)
// ----------------------------------------------------------

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

// CloudLinux passes the port in process.env.PORT
// DO NOT hardcode the port!
const port = parseInt(process.env.PORT, 10) || 3000;

// Use 0.0.0.0 for cPanel (important!)
const hostname = "0.0.0.0";

const dev = process.env.NODE_ENV !== "production";

if (process.env.NODE_ENV === "production") {
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing.join(", "));
    process.exit(1);
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        // Make reverse proxy headers work (cPanel → Node)
        req.headers["x-forwarded-host"] = req.headers.host;

        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }).listen(port, hostname, (err) => {
      if (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
      }
      console.log(`✅ Next.js running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to prepare Next.js:", err);
    console.error("Possible causes:");
    console.error(" - Missing .next folder (run: npm run build)");
    console.error(" - Missing node_modules (CloudLinux creates them in virtual env)");
