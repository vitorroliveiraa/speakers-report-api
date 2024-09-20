import "express-async-errors";
import app from "./app.ts";
import "dotenv/config";

app.listen(process.env.API_PORT, () => {
    console.log("🚀 App is running at http://localhost:" + process.env.API_PORT);
});
