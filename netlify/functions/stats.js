const fs = require('fs');
const path = require('path');

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

exports.handler = async (event, context) => {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const works = readWorks();

    const stats = {
      total_works: works.length,
      total_likes: works.reduce((sum, work) => sum + (work.likes || 0), 0),
      total_views: works.reduce((sum, work) => sum + (work.views || 0), 0),
      total_types: [...new Set(works.map(work => work.type))].length
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(stats)
    }
  } catch (error) {
    console.error('获取统计信息失败:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
