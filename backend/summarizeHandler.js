// Core request handler for the document summarization endpoint, shared by the
// Vercel serverless function and the local development server.
import { readFile, unlink } from "node:fs/promises";
import { IncomingForm } from "formidable";
import { validateUploadedFile, isPdfFile } from "./utils/fileValidation.js";
import { extractTextFromPdf } from "./services/pdfService.js";
import { extractTextFromImage } from "./services/ocrService.js";
import { generateSummary } from "./services/groqService.js";

const VALID_LENGTHS = new Set(["short", "medium", "long"]);
const MIN_USABLE_TEXT_LENGTH = 20;

// Parses the incoming multipart request into the uploaded file and requested summary length.
async function parseRequest(req) {
  const form = new IncomingForm({
    maxFileSize: 15 * 1024 * 1024,
    allowEmptyFiles: true,
    minFileSize: 0,
  });
  const [fields, files] = await form.parse(req);

  const fileEntry = files.file?.[0];
  const length = fields.length?.[0] ?? "medium";

  return { fileEntry, length };
}

// Handles POST requests to summarize an uploaded document via the Groq API.
export async function handleSummarizeRequest(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  let fileEntry;
  let length;
  try {
    ({ fileEntry, length } = await parseRequest(req));
  } catch (error) {
    console.error("Failed to parse upload:", error);
    sendError(res, 400, "Could not read the uploaded file. Please try again.");
    return;
  }

  const validationError = validateUploadedFile(fileEntry);
  if (validationError) {
    sendError(res, 400, validationError);
    return;
  }

  if (!VALID_LENGTHS.has(length)) {
    sendError(res, 400, "Summary length must be short, medium, or long.");
    return;
  }

  const buffer = await readFile(fileEntry.filepath);
  await unlink(fileEntry.filepath).catch(() => {});

  let extractedText;
  try {
    extractedText = isPdfFile(fileEntry)
      ? await extractTextFromPdf(buffer)
      : await extractTextFromImage(buffer);
  } catch (error) {
    console.error("Text extraction failed:", error);
    sendError(res, 422, "Could not extract text from the uploaded file.");
    return;
  }

  if (!extractedText || extractedText.length < MIN_USABLE_TEXT_LENGTH) {
    sendError(
      res,
      422,
      "No usable text could be found in this document. Try a clearer scan or a different file."
    );
    return;
  }

  let summary;
  try {
    summary = await generateSummary(extractedText, length);
  } catch (error) {
    console.error("Groq request failed:", error);
    sendError(res, 502, "The summary service is currently unavailable. Please try again.");
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ...summary, length }));
}

// Writes a JSON error response with the given status code and message.
function sendError(res, statusCode, message) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: message }));
}
