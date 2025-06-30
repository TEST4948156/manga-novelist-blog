// Vercel Serverless Function for stats API
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = '/tmp';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');

async function readWorks() {
  try {
    const data = await fs.readFile(WORKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const works = await readWorks();
    
    const stats = {
      total_works: works.length,
      total_likes: works.reduce((sum, work) => sum + (work.likes || 0), 0),
      total_views: works.reduce((sum, work) => sum + (work.views || 0), 0),
      total_types: [...new Set(works.map(work => work.type))].length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Stats API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
