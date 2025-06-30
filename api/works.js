// Vercel Serverless Function for works API
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const DATA_DIR = '/tmp';
const WORKS_FILE = path.join(DATA_DIR, 'works.json');
const LIKES_FILE = path.join(DATA_DIR, 'likes.json');

// 初始化数据文件
async function initDataFiles() {
  try {
    await fs.access(WORKS_FILE);
  } catch {
    await fs.writeFile(WORKS_FILE, JSON.stringify([]));
  }
  
  try {
    await fs.access(LIKES_FILE);
  } catch {
    await fs.writeFile(LIKES_FILE, JSON.stringify([]));
  }
}

// 读取数据
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

// 写入数据
async function writeWorks(works) {
  await fs.writeFile(WORKS_FILE, JSON.stringify(works, null, 2));
}

async function writeLikes(likes) {
  await fs.writeFile(LIKES_FILE, JSON.stringify(likes, null, 2));
}

// AI评价服务
async function generateAIEvaluation(work) {
  try {
    const apiKey = 'sk-5608f362dd6743a9a9d2880ea0b3c214';
    const prompt = `请评价以下${work.type}作品：

标题：${work.title}
类型：${work.type}
标签：${work.tags.join(', ')}

内容：
${work.content}

请从以下几个方面进行评价：
1. 文笔和语言表达
2. 情节结构和逻辑
3. 人物塑造（如有）
4. 创意和独特性
5. 整体印象和建议

请用简洁、友好的语言给出评价，字数控制在200-300字以内。`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的文学评论家和创作导师，擅长分析各种文学作品。请用温和、鼓励且专业的语调来评价作品，既要指出优点，也要给出建设性的建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      evaluation: response.data.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI评价失败:', error.response?.data || error.message);

    // 备用评价
    const fallbackEvaluations = [
      `这是一篇很有潜力的${work.type}作品！文笔流畅，情感表达真挚。建议在细节描写上可以更加丰富一些，让读者更容易产生共鸣。继续加油！✨`,
      `读完这篇${work.type}，能感受到作者的用心。故事情节有趣，语言表达也很不错。如果能在人物刻画上再深入一些，相信会更加精彩。期待你的下一部作品！📚`,
      `这篇${work.type}展现了不错的创作功底。主题明确，表达清晰。建议可以尝试更多样的修辞手法，让文字更加生动有趣。加油创作！🌟`
    ];

    return {
      success: false,
      evaluation: fallbackEvaluations[Math.floor(Math.random() * fallbackEvaluations.length)],
      timestamp: new Date().toISOString()
    };
  }
}

export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await initDataFiles();

  try {
    if (req.method === 'GET') {
      // 获取作品列表
      const { page = 1, limit = 10, type, search } = req.query;
      let works = await readWorks();
      
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
      
    } else if (req.method === 'POST') {
      // 创建新作品
      const { title, type, content, tags } = req.body;

      if (!title || !type || !content) {
        res.status(400).json({ error: '标题、类型和内容为必填项' });
        return;
      }

      const works = await readWorks();
      const newWork = {
        id: uuidv4(),
        title,
        type,
        content,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        likes: 0,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 生成AI评价
      console.log('正在生成AI评价...');
      const aiEvaluation = await generateAIEvaluation(newWork);
      newWork.ai_evaluation = {
        content: aiEvaluation.evaluation,
        likes: 0,
        created_at: aiEvaluation.timestamp,
        success: aiEvaluation.success
      };

      works.push(newWork);
      await writeWorks(works);

      console.log('作品创建成功，AI评价已生成');
      res.status(201).json(newWork);
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
