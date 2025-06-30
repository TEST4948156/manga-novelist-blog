const fs = require('fs');
const path = require('path');

// 数据文件路径
const DATA_DIR = '/tmp/data';
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 读取活动数据
function readActivities() {
  try {
    ensureDataDir();
    if (!fs.existsSync(ACTIVITIES_FILE)) {
      fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取活动数据失败:', error);
    return [];
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

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
    const { limit = 10 } = event.queryStringParameters || {};
    const activities = readActivities();

    // 返回最新的活动记录
    const recentActivities = activities.slice(0, parseInt(limit));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(recentActivities)
    }
  } catch (error) {
    console.error('Activities function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
