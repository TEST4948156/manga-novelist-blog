// Vercel Serverless Function for AI continuation
import axios from 'axios';

// AI续写服务
async function generateContinuation(content, type, title = '', style = 'continue') {
  try {
    const apiKey = 'sk-5608f362dd6743a9a9d2880ea0b3c214';
    
    const styleInstructions = {
      continue: '请自然地续写下去，保持故事的连贯性',
      expand: '请对当前内容进行扩展和丰富，添加更多细节描写',
      dialogue: '请添加一些对话内容，让故事更加生动',
      action: '请增加一些动作场面或情节转折',
      emotion: '请深入挖掘人物的内心情感'
    };

    const prompt = `请为以下${type}作品续写内容：

${title ? `标题：${title}` : ''}
类型：${type}

已有内容：
${content}

续写要求：
${styleInstructions[style] || styleInstructions.continue}

请生成200-400字的续写内容，保持与原文风格一致，情节自然流畅。`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的创意写作助手，擅长各种文学体裁的创作。请根据用户提供的内容，生成自然流畅的续写内容。保持原文的风格、语调和情感基调。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8
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
      continuation: response.data.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI续写失败:', error.response?.data || error.message);
    
    // 备用续写内容
    const fallbackContinuations = {
      continue: [
        '时间仿佛在这一刻静止了，周围的一切都变得模糊不清。只有那个身影，在记忆中越来越清晰...',
        '突然，一阵微风吹过，带来了熟悉的香味。那是属于春天的味道，也是属于希望的味道...',
        '就在这时，远处传来了脚步声。那声音越来越近，越来越清晰，仿佛带着某种不可言喻的力量...'
      ],
      expand: [
        '细雨如丝，轻柔地洒在石板路上，发出细微的滴答声。路边的梧桐叶片上挂着晶莹的水珠，在路灯的照射下闪闪发光...',
        '房间里弥漫着淡淡的茶香，那是祖母最爱的茉莉花茶。阳光透过纱窗洒在木质地板上，形成斑驳的光影...',
        '夜色深沉，星星在天空中眨着眼睛。远山如黛，近水如镜，整个世界都沉浸在一片宁静祥和之中...'
      ],
      dialogue: [
        '"你真的要走吗？"她轻声问道，声音中带着不舍。\n"是的，但这不是结束，而是新的开始。"他温柔地回答...',
        '"告诉我，你在想什么？"他关切地询问。\n"我在想，如果时间能够倒流就好了。"她苦笑着说...',
        '"你相信命运吗？"她突然问道。\n"我相信选择。"他坚定地回答，"每一个选择都会改变我们的命运。"'
      ]
    };
    
    const continuations = fallbackContinuations[style] || fallbackContinuations.continue;
    
    return {
      success: false,
      continuation: continuations[Math.floor(Math.random() * continuations.length)],
      timestamp: new Date().toISOString()
    };
  }
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

  try {
    const { content, type, title, style = 'continue' } = req.body;
    
    if (!content || !type) {
      res.status(400).json({ error: '内容和类型为必填项' });
      return;
    }

    console.log('正在生成AI续写...');
    const result = await generateContinuation(content, type, title, style);
    
    res.json(result);
    
  } catch (error) {
    console.error('AI续写API失败:', error);
    res.status(500).json({ error: error.message });
  }
}
