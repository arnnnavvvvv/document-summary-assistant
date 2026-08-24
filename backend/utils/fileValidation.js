// Validates uploaded files before they are sent to text extraction.

const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

// Checks type, size, and emptiness of an uploaded file and returns an error message or null.
export function validateUploadedFile(file) {
  if (!file) {
    return "No file was uploaded.";
  }

  if (file.size === 0) {
    return "The uploaded file is empty.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "The file is too large. Maximum size is 15MB.";
  }

  if (!ACCEPTED_MIME_TYPES.has(file.mimetype)) {
    return "Unsupported file type. Please upload a PDF, PNG, JPG, or WEBP file.";
  }

  return null;
}

export function isPdfFile(file) {
  return file.mimetype === "application/pdf";
}
