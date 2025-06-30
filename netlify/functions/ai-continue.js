const axios = require('axios');

// AI续写服务
async function generateContinuation(content, type, title, style = 'continue') {
  try {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API密钥未配置');
    }

    // 根据类型和风格构建提示词
    let prompt = '';
    
    if (style === 'continue') {
      prompt = `请为以下${type}作品续写一段内容，保持原有的风格和语调：

标题：${title || '未命名作品'}
类型：${type}
现有内容：
${content}

请续写约200-300字的内容，要求：
1. 保持与原文风格一致
2. 情节发展自然流畅
3. 符合${type}的特点
4. 不要重复原有内容

续写内容：`;
    } else if (style === 'expand') {
      prompt = `请对以下${type}作品进行扩展和丰富，添加更多细节描述：

标题：${title || '未命名作品'}
类型：${type}
原始内容：
${content}

请扩展原有内容，要求：
1. 增加环境描写和人物细节
2. 丰富情感表达
3. 保持原有故事框架
4. 符合${type}的特点

扩展内容：`;
    } else {
      prompt = `请为以下${type}作品提供创作建议和改进方向：

标题：${title || '未命名作品'}
类型：${type}
内容：
${content}

请提供：
1. 作品优点分析
2. 可改进的地方
3. 后续发展建议
4. 创作技巧提示

建议内容：`;
    }

    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的文学创作助手，擅长各种文体的创作和指导。请根据用户的要求提供高质量的续写、扩展或建议。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      const generatedContent = response.data.choices[0].message.content.trim();
      
      return {
        success: true,
        content: generatedContent,
        style: style,
        timestamp: new Date().toISOString(),
        model: 'deepseek-chat'
      };
    } else {
      throw new Error('AI响应格式异常');
    }
  } catch (error) {
    console.error('AI续写失败:', error);
    
    let errorMessage = 'AI续写服务暂时不可用';
    if (error.response) {
      errorMessage = `API错误: ${error.response.status} - ${error.response.data?.error?.message || '未知错误'}`;
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    };
  }
}

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
    const { content, type, title, style = 'continue' } = JSON.parse(event.body);

    if (!content || !type) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '内容和类型为必填项' })
      }
    }

    console.log('正在生成AI续写...');
    const result = await generateContinuation(content, type, title, style);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    }
  } catch (error) {
    console.error('AI续写失败:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}
