import "express-async-errors";
import app from "./app.ts";
import "dotenv/config";
import { setupDatabasePing } from "@database/dbPing.ts";
import db from "@database/index.ts";

app.listen(Number(process.env.API_PORT!), "0.0.0.0", () => {
  console.log("🚀 App is running at:" + process.env.API_PORT);

  // Iniciar o ping do banco de dados para manter conexão ativa
  setupDatabasePing();

  // Verificação inicial da conexão com o banco
  db.raw("SELECT 1")
    .then(() => console.log("Database connection established"))
    .catch((err) => console.error("Database connection failed:", err));
});
