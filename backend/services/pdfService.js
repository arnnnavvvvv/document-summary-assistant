// Extracts text content from PDF file buffers.
import pdfParse from "pdf-parse";

// Parses a PDF buffer and returns its extracted text, trimmed of extra whitespace.
export async function extractTextFromPdf(buffer) {
  const result = await pdfParse(buffer);
  return result.text.trim();
}
