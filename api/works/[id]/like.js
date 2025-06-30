// Vercel Serverless Function for like functionality
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = '/tmp';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const LIKES_FILE = path.join(DATA_DIR, 'likes.json');

async function readWorks() {
  try {
    const data = await fs.readFile(WORKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function readLikes() {
  try {
    const data = await fs.readFile(LIKES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeWorks(works) {
  await fs.writeFile(WORKS_FILE, JSON.stringify(works, null, 2));
}

async function writeLikes(likes) {
  await fs.writeFile(LIKES_FILE, JSON.stringify(likes, null, 2));
}

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id } = req.query;
  const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';

  try {
    const likes = await readLikes();
    const works = await readWorks();
    
    // 检查是否已经点赞
    const existingLike = likes.find(like => like.work_id === id && like.ip_address === ipAddress);
    if (existingLike) {
      res.status(400).json({ error: '您已经点过赞了' });
      return;
    }
    
    // 查找作品
    const work = works.find(w => w.id === id);
    if (!work) {
      res.status(404).json({ error: '作品未找到' });
      return;
    }
    
    // 添加点赞记录
    likes.push({
      id: Date.now(),
      work_id: id,
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    });
    
    // 更新作品点赞数
    work.likes = (work.likes || 0) + 1;
    
    // 保存数据
    await writeLikes(likes);
    await writeWorks(works);
    
    res.json({ message: '点赞成功' });
    
  } catch (error) {
    console.error('Like API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
