import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import { promisify } from 'util';
import fs from 'fs';
import { FormData, File } from 'formdata-node';
import fetch from 'node-fetch';
import sharp from 'sharp';

// Disable Next.js default body parsing for this API route
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

async function removeBackgroundWithRemoveBg(imageBuffer: Buffer): Promise<Buffer> {
  const apiKey = process.env.REMOVEBG_API_KEY;
  if (!apiKey) throw new Error('REMOVEBG_API_KEY not set in environment');

  // Create a File from the buffer
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
  console.log('Enhance endpoint called');
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
    console.error('No image uploaded. files:', files);
    res.status(400).json({ error: 'No image uploaded.' });
    return;
  }

  const imgFile = Array.isArray(file) ? file[0] : file;
  const imgPath = imgFile.filepath;
  const removeBgValue = Array.isArray(fields?.removeBg) ? fields.removeBg[0] : fields?.removeBg;
  const removeBg = removeBgValue === 'true';
  console.log('removeBg field value:', fields?.removeBg);

  try {
    let inputBuffer = await promisify(fs.readFile)(imgPath);
    if (removeBg) {
      console.log('Calling remove.bg...');
      inputBuffer = await removeBackgroundWithRemoveBg(inputBuffer);
      console.log('remove.bg response length:', inputBuffer.length);
    }
    // Apply sharp enhancements
    const enhancedBuffer = await sharp(inputBuffer)
      .modulate({ brightness: 1.1 })
      .linear(1.1, 0)
      .toBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', 'inline; filename="enhanced.jpg"');
    res.status(200).send(enhancedBuffer);
  } catch (err) {
    console.error('Image processing error:', err);
    res.status(500).json({ error: 'Image processing failed.', details: String(err) });
  }
} 