import { IChurchMembers } from "types/IUserDTO.ts";
import { utilsLogger as logger } from "./logger.ts";
import pdfParse from "pdf-parse";

export async function extractNamesFromPDF(
  wardId: number,
  buffer: Buffer
): Promise<IChurchMembers[]> {
  logger.info("Iniciando extração de nomes do PDF");

  try {
    const data = await pdfParse(buffer);
    const text: string = data.text;

    // Divide o texto em linhas
    const lines = text.split("\n");

    // Filtra e limpa as linhas para extrair os nomes
    const names: string[] = [];
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Ignora linhas que contêm o texto de rodapé
      if (trimmedLine.includes("Somente para Uso da Igreja")) {
        continue; // Pula para a próxima linha
      }

      // Verifica se a linha parece ser um nome (contém uma vírgula e tem mais de 3 caracteres)
      if (trimmedLine.includes(",") && trimmedLine.length > 3) {
        names.push(trimmedLine);
      }
    }

    if (names.length === 0) {
      logger.error("Nenhum nome encontrado no PDF");
      throw new Error("Nenhum nome encontrado no PDF.");
    }

    // Gera a lista de membros com um ward_id aleatório
    const members: IChurchMembers[] = names.map((name) => ({
      name: name.trim(),
      ward_id: wardId, // Gera um número aleatório para ward_id
    }));

    logger.info("Nomes extraídos com sucesso");
    return members;
  } catch (error) {
    logger.error({ error }, "Erro ao extrair nomes do PDF");
    throw error;
  }
}
