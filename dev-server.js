// Local development server that mirrors the Vercel API route for the frontend to call.
import "dotenv/config";
import express from "express";
import { handleSummarizeRequest } from "./backend/summarizeHandler.js";

const app = express();
const port = process.env.API_PORT || 3001;

app.post("/api/summarize", (req, res) => {
  handleSummarizeRequest(req, res);
});

app.listen(port, () => {
  console.log(`API dev server listening on http://localhost:${port}`);
});
