import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRequestUser } from "../lib/request-user";

const router = Router();

router.post("/background/insight", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ message: "Background processing is not configured." });
  const input = typeof req.body?.input === "string" ? req.body.input.trim() : "";
  if (!input) return res.status(400).json({ message: "Input is required." });

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(
    `Process this marketplace record in the background. Return concise JSON with keys summary, risks, and recommendations. Do not mention AI or the processing method. Record:\\n${input}`,
  );
  const text = result.response.text();
  return res.json({ result: text });
});

export default router;