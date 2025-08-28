import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import { promisify } from 'util';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { FormData, File } from 'formdata-node';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getTempDir(): string {
  // Use Vercel's /tmp in serverless, else OS temp dir
  if (process.env.VERCEL) return '/tmp';
  return os.tmpdir();
}

function ensureDir(dirPath: string) {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch {}
}

function parseForm(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  const baseTmp = getTempDir();
  const uploadDir = path.join(baseTmp, 'uploads');
  ensureDir(uploadDir);
  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields: Fields, files: Files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function removeBackgroundWithRemoveBg(imageBuffer: Buffer): Promise<Buffer> {
  const apiKey = process.env.REMOVEBG_API_KEY;
  if (!apiKey) throw new Error('REMOVEBG_API_KEY not set in environment');

  const file = new File([imageBuffer], 'image.jpg', { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', file);

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: formData as any,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`remove.bg API error: ${response.status} ${errorText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    let fields, files;
    try {
      ({ fields, files } = await parseForm(req));
    } catch (err) {
      console.error('Form parsing error:', err);
      res.status(400).json({ error: 'Failed to parse form data.', details: String(err) });
      return;
    }

    const file = files?.image;
    if (!file) {
      res.status(400).json({ error: 'No image uploaded.' });
      return;
    }

    const imgFile = Array.isArray(file) ? file[0] : file;
    const imgPath = (imgFile as any).filepath;
    const removeBgValue = Array.isArray((fields as any)?.removeBg) ? (fields as any).removeBg[0] : (fields as any)?.removeBg;
    const shouldRemoveBg = removeBgValue === 'true';

    let inputBuffer: Buffer;
    try {
      inputBuffer = await promisify(fs.readFile)(imgPath);
    } catch (err) {
      res.status(400).json({ error: 'Failed to read uploaded file.', details: String(err) });
      return;
    }

    try {
      if (shouldRemoveBg) {
        inputBuffer = await removeBackgroundWithRemoveBg(inputBuffer);
      }
      const enhancedBuffer = await sharp(inputBuffer)
        .modulate({ brightness: 1.1 })
        .linear(1.1, 0)
        .toBuffer();
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', 'inline; filename="enhanced.jpg"');
      res.status(200).send(enhancedBuffer);
    } catch (err) {
      console.error('Enhance pipeline error:', err);
      res.status(500).json({ error: 'Image processing failed.', details: String(err) });
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error.', details: String(err) });
  }
} 