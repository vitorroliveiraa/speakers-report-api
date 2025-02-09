import pdfParse from "pdf-parse";

/**
 * Valida se todas as páginas do PDF possuem apenas uma coluna, que por padrão deve ser "Nome".
 * @param buffer Arquivo PDF em buffer
 * @returns true se válido, false caso contrário
 */
export async function validatePDFStructure(buffer: Buffer): Promise<boolean> {
  const data = await pdfParse(buffer);
  const pages = data.text.split(/\f/g);

  for (const page of pages) {
    const match = page.match(/\bNome\b/g);

    if (data.numpages !== match?.length) {
      return false;
    }
  }

  return true;
}
