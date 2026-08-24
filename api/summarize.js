// Vercel serverless function entry point for document summarization.
import { handleSummarizeRequest } from "../backend/summarizeHandler.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Delegates the incoming request to the shared summarize handler.
export default async function handler(req, res) {
  await handleSummarizeRequest(req, res);
}
