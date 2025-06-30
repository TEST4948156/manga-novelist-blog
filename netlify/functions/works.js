const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const aiService = require('./ai-service');

// 数据文件路径
const DATA_DIR = '/tmp/data';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const LIKES_FILE = path.join(DATA_DIR, 'likes.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

// 确保数据目录存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// 初始化数据文件
function initDataFiles() {
  ensureDataDir();
  if (!fs.existsSync(WORKS_FILE)) {
    fs.writeFileSync(WORKS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(LIKES_FILE)) {
    fs.writeFileSync(LIKES_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(ACTIVITIES_FILE)) {
    fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify([]));
  }
}

// 读取数据
function readWorks() {
  try {
    initDataFiles();
    const data = fs.readFileSync(WORKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取作品数据失败:', error);
    return [];
  }
}

function readLikes() {
  try {
    initDataFiles();
    const data = fs.readFileSync(LIKES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取点赞数据失败:', error);
    return [];
  }
}

// 写入数据
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

function writeLikes(likes) {
  try {
    ensureDataDir();
    fs.writeFileSync(LIKES_FILE, JSON.stringify(likes, null, 2));
    return true;
  } catch (error) {
    console.error('写入点赞数据失败:', error);
    return false;
  }
}

// 活动记录相关函数
function readActivities() {
  try {
    initDataFiles();
    const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取活动数据失败:', error);
    return [];
  }
}

function writeActivities(activities) {
  try {
    ensureDataDir();
    fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(activities, null, 2));
    return true;
  } catch (error) {
    console.error('写入活动数据失败:', error);
    return false;
  }
}

// 添加活动记录
function addActivity(type, description, workId = null, workTitle = null, ipAddress = null) {
  try {
    const allowedTypes = ['create', 'like'];
    if (!allowedTypes.includes(type)) {
      return;
    }

    const activities = readActivities();

    let finalDescription = description;
    if (type === 'like' && workTitle) {
      const isStranger = !ipAddress || ipAddress === 'unknown' || Math.random() < 0.7;
      if (isStranger) {
        finalDescription = `一个充满善意的陌生人赞同了作品《${workTitle}》`;
      } else {
        finalDescription = `有人为作品《${workTitle}》点赞`;
      }
    }

    const newActivity = {
      id: Date.now().toString(),
      type,
      description: finalDescription,
      work_id: workId,
      work_title: workTitle,
      created_at: new Date().toISOString()
    };

    activities.unshift(newActivity);

    if (activities.length > 50) {
      activities.splice(50);
    }

    writeActivities(activities);
    console.log('活动记录已添加:', finalDescription);
  } catch (error) {
    console.error('添加活动记录失败:', error);
  }
}

exports.handler = async (event, context) => {
  // 设置 CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }

  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
    const { httpMethod, path, body, queryStringParameters } = event
    const pathParts = path.split('/').filter(Boolean)
    const workId = pathParts[pathParts.length - 1]
    const isLikeRequest = path.includes('/like')

    switch (httpMethod) {
      case 'GET':
        if (workId && workId !== 'works' && !isLikeRequest) {
          // 获取单个作品
          const works = readWorks();
          const work = works.find(w => w.id === workId);

          if (!work) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: '作品未找到' })
            }
          }

          // 增加浏览量
          work.views = (work.views || 0) + 1;
          writeWorks(works);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(work)
          }
        } else {
          // 获取所有作品
          const { page = 1, limit = 10, type, search } = queryStringParameters || {};
          let works = readWorks();

          // 筛选
          if (type) {
            works = works.filter(work => work.type === type);
          }

          if (search) {
            works = works.filter(work =>
              work.title.toLowerCase().includes(search.toLowerCase()) ||
              work.content.toLowerCase().includes(search.toLowerCase())
            );
          }

          // 排序
          works.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          // 分页
          const offset = (page - 1) * limit;
          const paginatedWorks = works.slice(offset, offset + parseInt(limit));

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              works: paginatedWorks,
              pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: works.length
              }
            })
          }
        }

      case 'POST':
        if (isLikeRequest) {
          // 点赞功能
          const ipAddress = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
          const likes = readLikes();
          const works = readWorks();

          // 检查是否已经点赞
          const existingLike = likes.find(like => like.work_id === workId && like.ip_address === ipAddress);
          if (existingLike) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: '您已经点过赞了' })
            }
          }

          // 查找作品
          const work = works.find(w => w.id === workId);
          if (!work) {
            return {
              statusCode: 404,
              headers,
              body: JSON.stringify({ error: '作品未找到' })
            }
          }

          // 添加点赞记录
          likes.push({
            id: Date.now(),
            work_id: workId,
            ip_address: ipAddress,
            created_at: new Date().toISOString()
          });

          // 更新作品点赞数
          work.likes = (work.likes || 0) + 1;

          // 保存数据
          if (!writeLikes(likes) || !writeWorks(works)) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ error: '点赞失败' })
            }
          }

          // 添加点赞活动记录
          addActivity('like', `有人为作品《${work.title}》点赞`, work.id, work.title, ipAddress);

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: '点赞成功' })
          }
        } else {
          // 创建新作品 - 注意：文件上传在Netlify Functions中需要特殊处理
          const workData = JSON.parse(body);
          const id = uuidv4();

          if (!workData.title || !workData.type || !workData.content) {
            return {
              statusCode: 400,
              headers,
              body: JSON.stringify({ error: '标题、类型和内容为必填项' })
            }
          }

          const works = readWorks();
          const newWork = {
            id,
            title: workData.title,
            type: workData.type,
            content: workData.content,
            tags: workData.tags ? workData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            likes: 0,
            views: 0,
            file_path: null, // 文件上传需要单独处理
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // 生成AI评价
          console.log('正在生成AI评价...');
          const aiEvaluation = await aiService.evaluateWork(newWork);
          newWork.ai_evaluation = {
            content: aiEvaluation.evaluation,
            likes: 0,
            created_at: aiEvaluation.timestamp,
            success: aiEvaluation.success
          };

          works.push(newWork);

          if (!writeWorks(works)) {
            return {
              statusCode: 500,
              headers,
              body: JSON.stringify({ error: '保存作品失败' })
            }
          }

          // 添加活动记录
          addActivity('create', `发布了新作品《${newWork.title}》`, newWork.id, newWork.title);

          console.log('作品创建成功，AI评价已生成');
          return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newWork)
          }
        }

      case 'PUT':
        // 更新作品
        const updateData = JSON.parse(body);
        const works = readWorks();
        const workIndex = works.findIndex(w => w.id === workId);

        if (workIndex === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: '作品未找到' })
          }
        }

        // 更新作品数据
        works[workIndex] = {
          ...works[workIndex],
          ...updateData,
          updated_at: new Date().toISOString()
        };

        if (!writeWorks(works)) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '更新作品失败' })
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(works[workIndex])
        }

      case 'DELETE':
        // 删除作品
        const works_del = readWorks();
        const workIndex_del = works_del.findIndex(w => w.id === workId);

        if (workIndex_del === -1) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: '作品未找到' })
          }
        }

        // 从数组中删除作品
        works_del.splice(workIndex_del, 1);

        if (!writeWorks(works_del)) {
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '删除作品失败' })
          }
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: '作品删除成功' })
        }

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        }
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
