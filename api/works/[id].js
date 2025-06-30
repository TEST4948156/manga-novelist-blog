// Vercel Serverless Function for individual work operations
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

async function writeWorks(works) {
  await fs.writeFile(WORKS_FILE, JSON.stringify(works, null, 2));
}

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // 获取单个作品
      const works = await readWorks();
      const work = works.find(w => w.id === id);
      
      if (!work) {
        res.status(404).json({ error: '作品未找到' });
        return;
      }
      
      // 增加浏览量
      work.views = (work.views || 0) + 1;
      await writeWorks(works);
      
      res.json(work);
      
    } else if (req.method === 'PUT') {
      // 更新作品
      const { title, type, content, tags } = req.body;
      const works = await readWorks();
      const workIndex = works.findIndex(w => w.id === id);
      
      if (workIndex === -1) {
        res.status(404).json({ error: '作品未找到' });
        return;
      }
      
      works[workIndex] = {
        ...works[workIndex],
        title,
        type,
        content,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        updated_at: new Date().toISOString()
      };
      
      await writeWorks(works);
      res.json({ message: '作品更新成功' });
      
    } else if (req.method === 'DELETE') {
      // 删除作品
      const works = await readWorks();
      const workIndex = works.findIndex(w => w.id === id);
      
      if (workIndex === -1) {
        res.status(404).json({ error: '作品未找到' });
        return;
      }
      
      works.splice(workIndex, 1);
      await writeWorks(works);
      
      res.json({ message: '作品删除成功' });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Work API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
