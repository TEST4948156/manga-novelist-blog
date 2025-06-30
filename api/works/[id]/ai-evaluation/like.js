// Vercel Serverless Function for AI evaluation likes
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = '/tmp';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const AI_LIKES_FILE = path.join(DATA_DIR, 'ai_likes.json');

async function readWorks() {
  try {
    const data = await fs.readFile(WORKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeWorks(works) {
  await fs.writeFile(WORKS_FILE, JSON.stringify(works, null, 2));
}

async function readAILikes() {
  try {
    const data = await fs.readFile(AI_LIKES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeAILikes(likes) {
  await fs.writeFile(AI_LIKES_FILE, JSON.stringify(likes, null, 2));
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
  const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';

  try {
    const works = await readWorks();
    const work = works.find(w => w.id === id);

    if (!work || !work.ai_evaluation) {
      res.status(404).json({ error: '作品或AI评价未找到' });
      return;
    }

    // 检查是否已经点赞
    const aiLikes = await readAILikes();
    const likeKey = `ai_eval_${id}_${ipAddress}`;
    
    if (aiLikes.includes(likeKey)) {
      res.status(400).json({ error: '您已经为这个AI评价点过赞了' });
      return;
    }

    // 记录点赞
    aiLikes.push(likeKey);
    await writeAILikes(aiLikes);

    // 增加AI评价点赞数
    work.ai_evaluation.likes = (work.ai_evaluation.likes || 0) + 1;
    await writeWorks(works);

    res.json({ message: 'AI评价点赞成功' });
    
  } catch (error) {
    console.error('AI评价点赞失败:', error);
    res.status(500).json({ error: error.message });
  }
}
