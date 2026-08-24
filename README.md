# Document Summary Assistant

Upload a PDF or image, extract its text, and get a concise AI-generated summary with key points.

## Features

- Upload via drag-and-drop or file picker (PDF, PNG, JPG, WEBP).
- Server-side text extraction: PDF parsing and image OCR.
- AI summary generation via the Groq API with selectable length (short / medium / long).
- Summary, key points, and main ideas displayed clearly.
- Loading, success, empty, and error states, including retry on failure.
- Responsive neubrutalist UI that works on desktop and mobile.

## Tech Stack

- **Frontend:** React + Vite, plain CSS.
- **Backend:** Node.js serverless function (Vercel), with a local Express server for development.
- **Text extraction:** `pdf-parse` for PDFs, `tesseract.js` for image OCR.
- **Summarization:** Groq API (`llama-3.3-70b-versatile`).

## Local Setup

```bash
npm install
cp .env.example .env
# add your Groq API key to .env
npm run dev
```

This runs the Vite frontend (`http://localhost:5173`) and a local API server (`http://localhost:3001`) together, with `/api` requests proxied to the API server.

## Environment Variables

| Variable       | Description                          |
| -------------- | ------------------------------------- |
| `GROQ_API_KEY` | API key for the Groq API (server-only) |

Never commit `.env`. The key is read server-side only and is never sent to the browser.

## Architecture / Data Flow

1. The frontend lets the user select a file and a summary length, then submits both to `/api/summarize`.
2. The backend (`backend/summarizeHandler.js`) validates the file's type, size, and content.
3. Text is extracted server-side: `backend/services/pdfService.js` for PDFs, `backend/services/ocrService.js` (OCR) for images.
4. If usable text was found, `backend/services/groqService.js` sends it to the Groq API and requests structured JSON output.
5. The backend returns `{ summary, keyPoints, mainIdeas, length }` or a JSON error with an appropriate HTTP status code.
6. The frontend renders the result or an error state with a retry action.

In production, `api/summarize.js` is deployed as a Vercel serverless function and reuses the same handler used locally.

## Deployment Notes

- Deploy to Vercel: the `api/` directory is auto-detected as serverless functions and `vite build` produces the static frontend.
- Set `GROQ_API_KEY` in the Vercel project's environment variables.
- `vercel.json` raises the function timeout to accommodate OCR processing.

## Limitations

- OCR accuracy depends on image quality; low-resolution or handwritten text may not extract well.
- Very large documents are truncated before summarization to keep requests fast and within model limits.
- No document history or storage: files are processed in memory and discarded after the request completes.
