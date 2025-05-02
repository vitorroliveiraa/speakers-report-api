// src/database/db-ping.ts
import db from "./index";

/**
 * Configura um ping periódico para o banco de dados para manter a conexão ativa
 */
export function setupDatabasePing(intervalMs = 25000) {
  // Execute uma query simples a cada 25 segundos para manter a conexão viva
  const pingInterval = setInterval(async () => {
    try {
      await db.raw("SELECT 1");
      // Ping bem sucedido, não precisa fazer nada
    } catch (error) {
      console.error("Database ping failed:", error);
      // O erro será tratado pelo pool do Knex
    }
  }, intervalMs);

  // Limpe o intervalo se a aplicação for encerrada
  process.on("SIGINT", () => clearInterval(pingInterval));
  process.on("SIGTERM", () => clearInterval(pingInterval));

  return pingInterval;
}
