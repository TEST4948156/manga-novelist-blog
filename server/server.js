const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const aiService = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-frontend-url.vercel.app', 'https://your-custom-domain.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 确保uploads目录存在
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 配置multer用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|txt|md|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片和文档文件！'));
    }
  }
});

// 数据文件路径
const DATA_DIR = './data';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const LIKES_FILE = path.join(DATA_DIR, 'likes.json');
const ACTIVITIES_FILE = path.join(DATA_DIR, 'activities.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// 初始化数据文件
function initDataFiles() {
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
    const data = fs.readFileSync(WORKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取作品数据失败:', error);
    return [];
  }
}

function readLikes() {
  try {
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
    fs.writeFileSync(WORKS_FILE, JSON.stringify(works, null, 2));
    return true;
  } catch (error) {
    console.error('写入作品数据失败:', error);
    return false;
  }
}

function writeLikes(likes) {
  try {
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
    const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取活动数据失败:', error);
    return [];
  }
}

function writeActivities(activities) {
  try {
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
    // 只记录特定类型的活动
    const allowedTypes = ['create', 'like'];
    if (!allowedTypes.includes(type)) {
      return; // 不记录其他类型的活动
    }

    const activities = readActivities();

    // 对于点赞活动，优化显示文本
    let finalDescription = description;
    if (type === 'like' && workTitle) {
      // 检查是否是陌生人点赞（基于IP地址的简单判断）
      const isStranger = !ipAddress || ipAddress === 'unknown' || Math.random() < 0.7; // 70%概率显示为陌生人
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

    activities.unshift(newActivity); // 添加到开头

    // 只保留最新的50条记录
    if (activities.length > 50) {
      activities.splice(50);
    }

    writeActivities(activities);
    console.log('活动记录已添加:', finalDescription);
  } catch (error) {
    console.error('添加活动记录失败:', error);
  }
}

// 初始化数据文件
initDataFiles();
console.log('数据存储已初始化');

// API路由

// 获取所有作品
app.get('/api/works', (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
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

    res.json({
      works: paginatedWorks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: works.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单个作品
app.get('/api/works/:id', (req, res) => {
  try {
    const { id } = req.params;
    const works = readWorks();
    const work = works.find(w => w.id === id);

    if (!work) {
      res.status(404).json({ error: '作品未找到' });
      return;
    }

    // 增加浏览量
    work.views = (work.views || 0) + 1;
    writeWorks(works);

    // 不再记录浏览活动

    res.json(work);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建新作品
app.post('/api/works', upload.single('file'), async (req, res) => {
  try {
    const { title, type, content, tags } = req.body;
    const id = uuidv4();
    const filePath = req.file ? req.file.path : null;

    if (!title || !type || !content) {
      res.status(400).json({ error: '标题、类型和内容为必填项' });
      return;
    }

    const works = readWorks();
    const newWork = {
      id,
      title,
      type,
      content,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      likes: 0,
      views: 0,
      file_path: filePath,
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
      res.status(500).json({ error: '保存作品失败' });
      return;
    }

    // 添加活动记录
    addActivity('create', `发布了新作品《${newWork.title}》`, newWork.id, newWork.title);

    console.log('作品创建成功，AI评价已生成');
    res.status(201).json(newWork);
  } catch (error) {
    console.error('创建作品失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 更新作品
app.put('/api/works/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { title, type, content, tags } = req.body;
  const filePath = req.file ? req.file.path : null;
  
  let sql = 'UPDATE works SET title = ?, type = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP';
  let params = [title, type, content, JSON.stringify(tags ? tags.split(',').map(tag => tag.trim()) : [])];
  
  if (filePath) {
    sql += ', file_path = ?';
    params.push(filePath);
  }
  
  sql += ' WHERE id = ?';
  params.push(id);
  
  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: '作品未找到' });
      return;
    }
    
    res.json({ message: '作品更新成功' });
  });
});

// 删除作品
app.delete('/api/works/:id', (req, res) => {
  try {
    const { id } = req.params;
    const works = readWorks();
    const workIndex = works.findIndex(w => w.id === id);

    if (workIndex === -1) {
      res.status(404).json({ error: '作品未找到' });
      return;
    }

    const work = works[workIndex];

    // 删除关联文件
    if (work.file_path && fs.existsSync(work.file_path)) {
      fs.unlinkSync(work.file_path);
    }

    // 从数组中删除作品
    const deletedWork = works.splice(workIndex, 1)[0];

    if (!writeWorks(works)) {
      res.status(500).json({ error: '删除作品失败' });
      return;
    }

    // 不再记录删除活动

    res.json({ message: '作品删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 点赞作品
app.post('/api/works/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const likes = readLikes();
    const works = readWorks();

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
    if (!writeLikes(likes) || !writeWorks(works)) {
      res.status(500).json({ error: '点赞失败' });
      return;
    }

    // 添加点赞活动记录
    addActivity('like', `有人为作品《${work.title}》点赞`, work.id, work.title, ipAddress);

    res.json({ message: '点赞成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI评价点赞
app.post('/api/works/:id/ai-evaluation/like', (req, res) => {
  try {
    const { id } = req.params;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    const works = readWorks();
    const work = works.find(w => w.id === id);

    if (!work || !work.ai_evaluation) {
      res.status(404).json({ error: '作品或AI评价未找到' });
      return;
    }

    // 简单的防重复点赞（基于IP）
    const likeKey = `ai_eval_${id}_${ipAddress}`;
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
      res.status(400).json({ error: '您已经为这个AI评价点过赞了' });
      return;
    }

    // 记录点赞
    existingLikes.push(likeKey);
    fs.writeFileSync(aiLikesFile, JSON.stringify(existingLikes));

    // 增加AI评价点赞数
    work.ai_evaluation.likes = (work.ai_evaluation.likes || 0) + 1;

    if (!writeWorks(works)) {
      res.status(500).json({ error: '点赞失败' });
      return;
    }

    // 不再记录AI评价点赞活动

    res.json({ message: 'AI评价点赞成功' });
  } catch (error) {
    console.error('AI评价点赞失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI续写接口
app.post('/api/ai/continue', async (req, res) => {
  try {
    const { content, type, title, style = 'continue' } = req.body;

    if (!content || !type) {
      res.status(400).json({ error: '内容和类型为必填项' });
      return;
    }

    console.log('正在生成AI续写...');
    const result = await aiService.generateContinuation(content, type, title, style);

    // 不再记录AI续写活动

    res.json(result);
  } catch (error) {
    console.error('AI续写失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取最新动态
app.get('/api/activities', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = readActivities();

    // 返回最新的活动记录
    const recentActivities = activities.slice(0, parseInt(limit));

    res.json(recentActivities);
  } catch (error) {
    console.error('获取活动记录失败:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取统计信息
app.get('/api/stats', (req, res) => {
  try {
    const works = readWorks();
    const likes = readLikes();

    const stats = {
      total_works: works.length,
      total_likes: works.reduce((sum, work) => sum + (work.likes || 0), 0),
      total_views: works.reduce((sum, work) => sum + (work.views || 0), 0),
      total_types: [...new Set(works.map(work => work.type))].length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过5MB限制' });
    }
  }
  res.status(500).json({ error: error.message });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  console.log('数据已保存到文件');
  process.exit(0);
});
