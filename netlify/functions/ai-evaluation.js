const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 数据文件路径
const DATA_DIR = '/tmp/data';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取作品数据
function readWorks() {
  try {
    ensureDataDir();
    if (!fs.existsSync(WORKS_FILE)) {
      fs.writeFileSync(WORKS_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(WORKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取作品数据失败:', error);
    return [];
  }
}

// 写入作品数据
function writeWorks(works) {
  try {
    ensureDataDir();
    fs.writeFileSync(WORKS_FILE, JSON.stringify(works, null, 2));
    return true;
  } catch (error) {
    console.error('写入作品数据失败:', error);
    return false;
  }
}

// AI评价点赞
exports.handler = async (event, context) => {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const pathParts = event.path.split('/').filter(Boolean);
    const workId = pathParts[pathParts.length - 3]; // 从路径中提取workId
    const ipAddress = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';

    const works = readWorks();
    const work = works.find(w => w.id === workId);

    if (!work || !work.ai_evaluation) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: '作品或AI评价未找到' })
      }
    }

    // 简单的防重复点赞（基于IP）
    const likeKey = `ai_eval_${workId}_${ipAddress}`;
    const aiLikesFile = path.join(DATA_DIR, 'ai_likes.json');
    let existingLikes = [];

    try {
      if (fs.existsSync(aiLikesFile)) {
        existingLikes = JSON.parse(fs.readFileSync(aiLikesFile, 'utf8'));
      }
    } catch (error) {
      existingLikes = [];
    }

    if (existingLikes.includes(likeKey)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '您已经为这个AI评价点过赞了' })
      }
    }

    // 记录点赞
    existingLikes.push(likeKey);
    fs.writeFileSync(aiLikesFile, JSON.stringify(existingLikes));

    // 增加AI评价点赞数
    work.ai_evaluation.likes = (work.ai_evaluation.likes || 0) + 1;

    if (!writeWorks(works)) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '点赞失败' })
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'AI评价点赞成功' })
    }
  } catch (error) {
    console.error('AI评价点赞失败:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
