import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import { promisify } from 'util';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function validateWithOpenAIVision(imageBuffer: Buffer): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set in environment');

  // Encode image as base64
  const base64Image = imageBuffer.toString('base64');
  const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

  const prompt = "Check if this image meets Meesho's e-commerce listing guidelines: no watermark, plain background, good lighting. If not, suggest improvements.";

  const body = {
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ]
      }
    ],
    max_tokens: 500
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let fields, files;
  try {
    ({ fields, files } = await parseForm(req));
  } catch (err) {
    res.status(400).json({ error: 'Failed to parse form data.', details: String(err) });
    return;
  }

  const file = files?.image;
  if (!file) {
    res.status(400).json({ error: 'No image uploaded.' });
    return;
  }

  const imgFile = Array.isArray(file) ? file[0] : file;
  const imgPath = imgFile.filepath;

  try {
    const inputBuffer = await promisify(fs.readFile)(imgPath);
    const openaiResult = await validateWithOpenAIVision(inputBuffer);
    // Extract the AI's message
    const aiMessage = openaiResult.choices?.[0]?.message?.content || 'No response from AI.';
    res.status(200).json({ result: aiMessage, raw: openaiResult });
  } catch (err) {
    res.status(500).json({ error: 'Image validation failed.', details: String(err) });
  }
} 