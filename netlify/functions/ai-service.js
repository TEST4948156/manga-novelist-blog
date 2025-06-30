const axios = require('axios');

// AI评价服务
async function evaluateWork(work) {
  try {
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    
    if (!DEEPSEEK_API_KEY) {
      console.warn('DeepSeek API密钥未配置，跳过AI评价');
      return {
        success: false,
        evaluation: '暂时无法生成AI评价，请稍后重试。',
        timestamp: new Date().toISOString()
      };
    }

    const prompt = `请对以下${work.type}作品进行专业评价：

标题：${work.title}
类型：${work.type}
内容：
${work.content}

请从以下几个方面进行评价（约150-200字）：
1. 作品的优点和亮点
2. 文笔和表达技巧
3. 情节或内容的吸引力
4. 改进建议（如有）

请用温和、鼓励的语调，给出建设性的评价。`;

    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位温和、专业的文学评论家，擅长发现作品的优点并给出建设性的建议。请用鼓励和支持的语调进行评价。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data && response.data.choices && response.data.choices[0]) {
      const evaluation = response.data.choices[0].message.content.trim();
      
      return {
        success: true,
        evaluation: evaluation,
        timestamp: new Date().toISOString(),
        model: 'deepseek-chat'
      };
    } else {
      throw new Error('AI响应格式异常');
    }
  } catch (error) {
    console.error('AI评价失败:', error);
    
    let fallbackEvaluation = '';
    
    // 根据作品类型提供不同的备用评价
    switch (work.type) {
      case '小说':
        fallbackEvaluation = '这是一部很有潜力的小说作品。故事情节引人入胜，人物刻画生动。建议在后续创作中继续深化人物性格，丰富故事背景。期待看到更多精彩的章节！';
        break;
      case '诗歌':
        fallbackEvaluation = '这首诗歌展现了作者独特的情感表达和艺术感悟。语言优美，意境深远。建议在韵律和节奏方面可以进一步打磨，让诗歌更加朗朗上口。';
        break;
      case '散文':
        fallbackEvaluation = '这篇散文文笔流畅，情感真挚。作者善于观察生活中的细节，并将其转化为动人的文字。建议在结构安排上可以更加紧凑，突出主题。';
        break;
      case '剧本':
        fallbackEvaluation = '这个剧本构思巧妙，对话生动自然。人物性格鲜明，冲突设置合理。建议在舞台指示和场景描述方面可以更加详细，便于演出实施。';
        break;
      default:
        fallbackEvaluation = '这是一部很有创意的作品，展现了作者的独特视角和表达能力。内容丰富，思路清晰。建议继续保持创作热情，不断完善和提升作品质量。';
    }
    
    return {
      success: false,
      evaluation: fallbackEvaluation,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

module.exports = {
  evaluateWork
};
