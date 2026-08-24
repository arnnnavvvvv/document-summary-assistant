// Extracts text content from image file buffers using OCR.
import { createWorker } from "tesseract.js";
import { tmpdir } from "node:os";

// Runs OCR on an image buffer and returns the recognized text, trimmed of extra whitespace.
export async function extractTextFromImage(buffer) {
  const worker = await createWorker("eng", 1, { cachePath: tmpdir() });
  try {
    const {
      data: { text },
    } = await worker.recognize(buffer);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}
