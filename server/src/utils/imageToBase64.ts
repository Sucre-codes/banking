import fs from 'fs';
import path from 'path';

export const getLogoBase64 = (): string => {
  const logoPath = path.join(__dirname, '../../public/Logo.png');
  const imageBuffer = fs.readFileSync(logoPath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = 'image/png'; // Change to 'image/jpeg' if your logo is .jpg
  
  return `data:${mimeType};base64,${base64Image}`;
};