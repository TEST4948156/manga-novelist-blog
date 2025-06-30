const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = 'sk-5608f362dd6743a9a9d2880ea0b3c214';
    this.baseURL = 'https://api.deepseek.com/v1';
  }

  async evaluateWork(work) {
    try {
      const prompt = this.createEvaluationPrompt(work);
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
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
            'Authorization': `Bearer ${this.apiKey}`,
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
      return {
        success: false,
        evaluation: this.getFallbackEvaluation(work),
        timestamp: new Date().toISOString()
      };
    }
  }

  createEvaluationPrompt(work) {
    return `请评价以下${work.type}作品：

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
  }

  getFallbackEvaluation(work) {
    const fallbackEvaluations = [
      `这是一篇很有潜力的${work.type}作品！文笔流畅，情感表达真挚。建议在细节描写上可以更加丰富一些，让读者更容易产生共鸣。继续加油！✨`,
      `读完这篇${work.type}，能感受到作者的用心。故事情节有趣，语言表达也很不错。如果能在人物刻画上再深入一些，相信会更加精彩。期待你的下一部作品！📚`,
      `这篇${work.type}展现了不错的创作功底。主题明确，表达清晰。建议可以尝试更多样的修辞手法，让文字更加生动有趣。加油创作！🌟`,
      `很棒的${work.type}作品！能看出作者的创作热情。情节安排合理，文字表达也很流畅。继续保持这种创作状态，相信会有更大的进步！💪`,
      `这篇${work.type}给人留下了深刻印象。创意独特，表达方式也很有个人特色。建议在结构安排上可以更加紧凑一些。期待看到更多优秀作品！🎯`
    ];

    return fallbackEvaluations[Math.floor(Math.random() * fallbackEvaluations.length)];
  }

  // AI续写功能
  async generateContinuation(content, type, title = '', style = 'continue') {
    try {
      const prompt = this.createContinuationPrompt(content, type, title, style);

      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
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
            'Authorization': `Bearer ${this.apiKey}`,
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
      return {
        success: false,
        continuation: this.getFallbackContinuation(type, style),
        timestamp: new Date().toISOString()
      };
    }
  }

  createContinuationPrompt(content, type, title, style) {
    const styleInstructions = {
      continue: '请自然地续写下去，保持故事的连贯性',
      expand: '请对当前内容进行扩展和丰富，添加更多细节描写',
      dialogue: '请添加一些对话内容，让故事更加生动',
      action: '请增加一些动作场面或情节转折',
      emotion: '请深入挖掘人物的内心情感'
    };

    return `请为以下${type}作品续写内容：

${title ? `标题：${title}` : ''}
类型：${type}

已有内容：
${content}

续写要求：
${styleInstructions[style] || styleInstructions.continue}

请生成200-400字的续写内容，保持与原文风格一致，情节自然流畅。`;
  }

  getFallbackContinuation(type, style) {
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
    return continuations[Math.floor(Math.random() * continuations.length)];
  }
}

module.exports = new AIService();
