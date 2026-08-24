// Shared constants for file constraints and summary length options.

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export const SUMMARY_LENGTHS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];
