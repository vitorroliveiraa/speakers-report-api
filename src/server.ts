import "express-async-errors";
import app from "./app.ts";
import "dotenv/config";

app.listen(Number(process.env.API_PORT!), "0.0.0.0", () => {
  console.log("🚀 App is running at http://localhost:" + process.env.API_PORT);
});
