// Vercel Serverless Function for activities API
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = '/tmp';
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

// 初始化数据文件
async function initDataFiles() {
  try {
    await fs.access(ACTIVITIES_FILE);
  } catch {
    await fs.writeFile(ACTIVITIES_FILE, JSON.stringify([]));
  }
}

async function readActivities() {
  try {
    const data = await fs.readFile(ACTIVITIES_FILE, 'utf8');
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

  await initDataFiles();

  try {
    if (req.method === 'GET') {
      // 获取最新动态
      const { limit = 10 } = req.query;
      const activities = await readActivities();
      
      // 返回最新的活动记录
      const recentActivities = activities.slice(0, parseInt(limit));
      
      res.json(recentActivities);
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Activities API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
