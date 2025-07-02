<template>
  <div class="blog-portfolio">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">创作作品集</h1>
        <p class="page-description">记录灵感瞬间，分享创作心得</p>

        <!-- 服务器状态 -->
        <div class="status-badge">
          <span v-if="isServerConnected" class="status online">
            <i class="status-dot"></i>
            服务器已连接
          </span>
          <span v-else class="status offline">
            <i class="status-dot"></i>
            离线模式
          </span>
        </div>
      </div>

      <div class="header-actions">
        <button
          v-if="props.isAdmin"
          class="btn-primary"
          @click="showAddForm = !showAddForm"
        >
          <i class="icon">{{ showAddForm ? '✕' : '✏️' }}</i>
          {{ showAddForm ? '取消' : '写新文章' }}
        </button>
        <div v-else class="guest-notice">
          <span class="notice-text">
            <i class="icon">👁️</i>
            游客模式 - 仅可查看和点赞
          </span>
        </div>
      </div>
    </header>

    <!-- 写作表单 -->
    <div v-if="showAddForm && props.isAdmin" class="editor-form">
      <div class="form-header">
        <h3>✍️ 创作新文章</h3>
        <p>分享你的创作灵感和故事</p>
      </div>

      <div class="form-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">文章标题</label>
            <input
              v-model="newWork.title"
              type="text"
              class="form-input"
              placeholder="给你的作品起个好听的名字..."
            >
          </div>
          <div class="form-group">
            <label class="form-label">文章类型</label>
            <select v-model="newWork.type" class="form-select">
              <option value="小说">📖 小说</option>
              <option value="短篇">📝 短篇</option>
              <option value="文案">💭 文案</option>
              <option value="设定">⚙️ 设定</option>
              <option value="对话">💬 对话</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">文章内容</label>
          <textarea
            v-model="newWork.content"
            class="form-textarea"
            placeholder="在这里尽情挥洒你的创作才华..."
            rows="8"
          ></textarea>

          <!-- AI续写功能 -->
          <div class="ai-continue-section">
            <div class="ai-continue-header">
              <button
                @click="toggleContinueOptions"
                class="ai-continue-btn"
                :disabled="!newWork.content.trim() || aiContinueLoading"
                type="button"
              >
                <i class="icon">{{ aiContinueLoading ? '⏳' : '🤖' }}</i>
                {{ aiContinueLoading ? 'AI思考中...' : 'AI续写助手' }}
              </button>
              <span class="ai-hint">基于已写内容智能续写</span>
            </div>

            <!-- 续写选项 -->
            <div v-if="showContinueOptions" class="ai-continue-options">
              <div class="continue-style-buttons">
                <button @click="generateContinuation('continue')" class="style-btn" type="button">
                  <i class="icon">📝</i>
                  <span>自然续写</span>
                </button>
                <button @click="generateContinuation('expand')" class="style-btn" type="button">
                  <i class="icon">🔍</i>
                  <span>扩展描写</span>
                </button>
                <button @click="generateContinuation('dialogue')" class="style-btn" type="button">
                  <i class="icon">💬</i>
                  <span>添加对话</span>
                </button>
                <button @click="generateContinuation('action')" class="style-btn" type="button">
                  <i class="icon">⚡</i>
                  <span>动作场面</span>
                </button>
                <button @click="generateContinuation('emotion')" class="style-btn" type="button">
                  <i class="icon">💝</i>
                  <span>情感描写</span>
                </button>
              </div>
            </div>

            <!-- 续写结果 -->
            <div v-if="continuationResult" class="ai-continuation-result">
              <div class="continuation-header">
                <h4>🤖 AI续写建议</h4>
                <div class="continuation-actions">
                  <button @click="applyContinuation" class="apply-btn" type="button">
                    <i class="icon">✅</i>
                    采用
                  </button>
                  <button @click="clearContinuation" class="clear-btn" type="button">
                    <i class="icon">❌</i>
                    清除
                  </button>
                </div>
              </div>
              <div class="continuation-content">
                {{ continuationResult }}
              </div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">标签</label>
            <input
              v-model="newWork.tags"
              type="text"
              class="form-input"
              placeholder="浪漫, 校园, 青春..."
            >
            <small class="form-hint">用逗号分隔多个标签</small>
          </div>
          <div class="form-group">
            <label class="form-label">附件文件</label>
            <input
              type="file"
              @change="handleFileChange"
              accept=".txt,.md,.doc,.docx,.jpg,.jpeg,.png,.gif"
              class="form-file"
            >
            <small class="form-hint">支持文档和图片，最大5MB</small>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <button @click="addWork" class="btn-primary" :disabled="loading">
          <i class="icon">{{ loading ? '⏳' : '📝' }}</i>
          {{ loading ? '发布中...' : '发布文章' }}
        </button>
        <button @click="resetForm" class="btn-secondary">
          <i class="icon">🔄</i>
          重置
        </button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="!works || works.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>还没有文章</h3>
        <p>点击上方"写新文章"按钮开始你的创作之旅吧！</p>
      </div>

      <div v-else class="articles-list">
        <article v-for="work in works" :key="work.id" class="article-card">
          <header class="article-header">
            <div class="article-meta">
              <span class="article-type">{{ work.type }}</span>
              <time class="article-date">{{ formatDate(work.created_at) }}</time>
            </div>
            <h2 class="article-title">{{ work.title }}</h2>
          </header>

          <div class="article-content">
            <p class="article-excerpt">
              {{ work.content.substring(0, 200) }}{{ work.content.length > 200 ? '...' : '' }}
            </p>

            <!-- AI评价部分 -->
            <div v-if="work.ai_evaluation" class="ai-evaluation">
              <div class="ai-evaluation-header">
                <h4 class="ai-title">
                  <i class="icon">🤖</i>
                  AI智能评价
                  <span v-if="!work.ai_evaluation.success" class="fallback-badge">备用评价</span>
                </h4>
              </div>
              <div class="ai-evaluation-content">
                <p class="ai-text">{{ work.ai_evaluation.content }}</p>
                <div class="ai-evaluation-footer">
                  <button @click="likeAIEvaluation(work.id)" class="ai-like-btn">
                    <i class="icon">👍</i>
                    <span>{{ work.ai_evaluation.likes || 0 }}</span>
                  </button>
                  <span class="ai-time">{{ formatDate(work.ai_evaluation.created_at) }}</span>
                </div>
              </div>
            </div>
          </div>

          <footer class="article-footer">
            <div class="article-tags">
              <span v-for="tag in work.tags" :key="tag" class="tag">#{{ tag }}</span>
            </div>

            <div class="article-stats">
              <button @click="likeWork(work.id)" class="stat-btn like-btn">
                <i class="icon">❤️</i>
                <span>{{ work.likes || 0 }}</span>
              </button>
              <div class="stat-item">
                <i class="icon">👁️</i>
                <span>{{ work.views || 0 }}</span>
              </div>
            </div>

            <div class="article-actions">
              <button @click="viewWorkDetail(work)" class="btn-outline">
                <i class="icon">📖</i>
                阅读全文
              </button>
              <template v-if="props.isAdmin">
                <button @click="editWork(work)" class="btn-text">
                  <i class="icon">✏️</i>
                  编辑
                </button>
                <button @click="deleteWork(work.id)" class="btn-text danger">
                  <i class="icon">🗑️</i>
                  删除
                </button>
              </template>
            </div>
          </footer>
        </article>
      </div>
    </div>

    <!-- 详情弹框 -->
    <DetailModal
      :isVisible="showDetailModal"
      :title="selectedWork?.title || ''"
      type="work"
      :data="selectedWork"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, withDefaults, defineProps, defineEmits } from 'vue'
import DetailModal from './DetailModal.vue'
import { apiService, type Work, type CreateWorkData, type ContinuationRequest } from '../services/api'

// Props
interface Props {
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isAdmin: false
})

// Emits
const emit = defineEmits<{
  'stats-updated': []
}>()

// 使用API中定义的Work接口

const showAddForm = ref(false)
const showDetailModal = ref(false)
const selectedWork = ref<Work | null>(null)
const works = ref<Work[]>([])
const loading = ref(false)
const error = ref('')
const isServerConnected = ref(false)

// AI续写相关状态
const aiContinueLoading = ref(false)
const showContinueOptions = ref(false)
const continuationResult = ref('')

const newWork = reactive({
  title: '',
  type: '小说',
  content: '',
  tags: '',
  file: null as File | null
})

// 初始化数据
onMounted(async () => {
  await checkServerConnection()
  await loadWorks()
})

// 检查服务器连接
const checkServerConnection = async () => {
  try {
    isServerConnected.value = await apiService.checkConnection()
    if (!isServerConnected.value) {
      // 如果服务器未连接，使用本地存储
      loadLocalWorks()
    }
  } catch (err) {
    console.warn('服务器连接失败，使用本地存储')
    isServerConnected.value = false
    loadLocalWorks()
  }
}

// 从服务器加载作品
const loadWorks = async () => {
  if (!isServerConnected.value) {
    loadLocalWorks()
    return
  }

  try {
    loading.value = true
    error.value = ''
    const response = await apiService.getWorks()
    works.value = response.works || []
  } catch (err) {
    error.value = '加载作品失败'
    console.error('加载作品失败:', err)
    // 回退到本地存储
    loadLocalWorks()
  } finally {
    loading.value = false
  }
}

// 从本地存储加载作品
const loadLocalWorks = () => {
  const savedWorks = localStorage.getItem('manga-novelist-works')
  if (savedWorks) {
    works.value = JSON.parse(savedWorks).map((work: any) => ({
      ...work,
      created_at: work.createdAt || work.created_at
    }))
  } else {
    // 添加一些示例数据
    works.value = [
      {
        id: '1',
        title: '樱花飘落的午后',
        type: '短篇',
        content: '那是一个樱花飘落的午后，阳光透过粉色的花瓣洒在她的脸上。她静静地坐在长椅上，手中的画笔轻抚着画纸，描绘着眼前这美好的一刻。微风轻拂，花瓣如雪花般飘散，她的心中涌起一阵莫名的感动...',
        tags: ['浪漫', '校园', '青春'],
        created_at: '2024-01-15T00:00:00.000Z',
        likes: 12,
        views: 45
      },
      {
        id: '2',
        title: '魔法学院的新生',
        type: '小说',
        content: '艾莉娅紧张地站在魔法学院的大门前，手中紧握着录取通知书。这座古老的建筑散发着神秘的魔法气息，高耸的尖塔直插云霄，彩色的玻璃窗在阳光下闪闪发光。她深吸一口气，迈出了人生中最重要的一步...',
        tags: ['奇幻', '魔法', '成长'],
        created_at: '2024-01-20T00:00:00.000Z',
        likes: 8,
        views: 32
      }
    ]
    saveWorks()
  }
}

const addWork = async () => {
  if (!newWork.title.trim() || !newWork.content.trim()) {
    alert('请填写标题和内容')
    return
  }

  try {
    loading.value = true
    error.value = ''

    if (isServerConnected.value) {
      // 使用API创建作品
      const workData: CreateWorkData = {
        title: newWork.title,
        type: newWork.type,
        content: newWork.content,
        tags: newWork.tags,
        file: newWork.file || undefined
      }

      const createdWork = await apiService.createWork(workData)
      works.value.unshift(createdWork)
    } else {
      // 使用本地存储
      const work: Work = {
        id: Date.now().toString(),
        title: newWork.title,
        type: newWork.type,
        content: newWork.content,
        tags: newWork.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        created_at: new Date().toISOString(),
        likes: 0,
        views: 0
      }

      works.value.unshift(work)
      saveWorks()
    }

    resetForm()
    showAddForm.value = false
    emit('stats-updated')
  } catch (err) {
    error.value = '保存作品失败'
    console.error('保存作品失败:', err)
    alert('保存作品失败，请重试')
  } finally {
    loading.value = false
  }
}

const editWork = (work: Work) => {
  newWork.title = work.title
  newWork.type = work.type
  newWork.content = work.content
  newWork.tags = work.tags.join(', ')
  showAddForm.value = true
  deleteWork(work.id, true) // 编辑时跳过确认直接删除
}

const deleteWork = async (id: string, skipConfirm = false) => {
  if (!skipConfirm) {
    if (!confirm('确定要删除这篇作品吗？此操作不可撤销。')) {
      return
    }
  }

  try {
    loading.value = true
    error.value = ''

    if (isServerConnected.value) {
      await apiService.deleteWork(id)
    }

    works.value = works.value.filter((work: Work) => work.id !== id)

    if (!isServerConnected.value) {
      saveWorks()
    }

    emit('stats-updated')
  } catch (err) {
    error.value = '删除作品失败'
    console.error('删除作品失败:', err)
    alert('删除作品失败，请重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  newWork.title = ''
  newWork.type = '小说'
  newWork.content = ''
  newWork.tags = ''
  newWork.file = null
}

const saveWorks = () => {
  localStorage.setItem('manga-novelist-works', JSON.stringify(works.value))
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const likeWork = async (workId: string) => {
  try {
    if (isServerConnected.value) {
      await apiService.likeWork(workId)
    }

    const work = works.value.find((w: Work) => w.id === workId)
    if (work) {
      work.likes++

      if (!isServerConnected.value) {
        saveWorks()
      }

      emit('stats-updated')
    }
  } catch (err) {
    console.error('点赞失败:', err)
    // 如果是重复点赞错误，不显示错误信息
    const errorMessage = err instanceof Error ? err.message : String(err)
    if (!errorMessage.includes('已经点过赞')) {
      alert('点赞失败，请重试')
    }
  }
}

const likeAIEvaluation = async (workId: string) => {
  try {
    if (isServerConnected.value) {
      await apiService.likeAIEvaluation(workId)
    }

    const work = works.value.find((w: Work) => w.id === workId)
    if (work && work.ai_evaluation) {
      work.ai_evaluation.likes++

      if (!isServerConnected.value) {
        saveWorks()
      }
    }
  } catch (err) {
    console.error('AI评价点赞失败:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    if (!errorMessage.includes('已经')) {
      alert('AI评价点赞失败，请重试')
    }
  }
}

// AI续写相关方法
const toggleContinueOptions = () => {
  showContinueOptions.value = !showContinueOptions.value
  if (!showContinueOptions.value) {
    continuationResult.value = ''
  }
}

const generateContinuation = async (style: string) => {
  if (!newWork.content.trim()) {
    alert('请先输入一些内容再使用AI续写功能')
    return
  }

  aiContinueLoading.value = true
  continuationResult.value = ''

  try {
    const request: ContinuationRequest = {
      content: newWork.content,
      type: newWork.type,
      title: newWork.title,
      style: style as any
    }

    const response = await apiService.generateContinuation(request)
    continuationResult.value = response.continuation

    if (!response.success) {
      console.warn('使用了备用续写内容')
    }
  } catch (err) {
    console.error('AI续写失败:', err)
    const errorMessage = err instanceof Error ? err.message : String(err)
    alert('AI续写失败: ' + errorMessage)
  } finally {
    aiContinueLoading.value = false
  }
}

const applyContinuation = () => {
  if (continuationResult.value) {
    // 在当前内容后添加续写内容
    newWork.content += '\n\n' + continuationResult.value
    continuationResult.value = ''
    showContinueOptions.value = false
  }
}

const clearContinuation = () => {
  continuationResult.value = ''
}

const viewWorkDetail = (work: Work) => {
  selectedWork.value = work
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedWork.value = null
}

// 处理文件上传
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过5MB')
      target.value = ''
      return
    }

    newWork.file = file
  } else {
    newWork.file = null
  }
}
</script>

<style scoped>
/* 博客风格的作品集样式 */
.blog-portfolio {
  padding: 0;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.page-description {
  color: #718096;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.status-badge {
  display: inline-block;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.online {
  background: #f0fff4;
  color: #22543d;
  border: 1px solid #c6f6d5;
}

.status.offline {
  background: #fef5e7;
  color: #c05621;
  border: 1px solid #fed7aa;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status.online .status-dot {
  background: #48bb78;
}

.status.offline .status-dot {
  background: #ed8936;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.guest-notice {
  background: #fef5e7;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.notice-text {
  color: #c05621;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 按钮样式 */
.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #cbd5e0;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

.btn-text {
  background: transparent;
  color: #718096;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-text:hover {
  background: #f7fafc;
  color: #4a5568;
}

.btn-text.danger:hover {
  background: #fed7d7;
  color: #c53030;
}

.icon {
  font-size: 1rem;
}

/* 编辑器表单 */
.editor-form {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.form-header p {
  color: #718096;
  margin: 0;
  font-size: 0.875rem;
}

.form-body {
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.5;
}

/* AI续写功能样式 */
.ai-continue-section {
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.ai-continue-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.ai-continue-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-continue-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ai-continue-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.ai-hint {
  color: #718096;
  font-size: 0.75rem;
  font-style: italic;
}

.ai-continue-options {
  padding: 1rem;
}

.continue-style-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.style-btn {
  background: white;
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
}

.style-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: translateY(-1px);
}

.style-btn .icon {
  font-size: 1.25rem;
}

.style-btn span {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4a5568;
}

.ai-continuation-result {
  margin-top: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
}

.continuation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.continuation-header h4 {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.continuation-actions {
  display: flex;
  gap: 0.5rem;
}

.apply-btn {
  background: #48bb78;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.apply-btn:hover {
  background: #38a169;
}

.clear-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.clear-btn:hover {
  background: #c53030;
}

.continuation-content {
  padding: 1rem;
  line-height: 1.6;
  color: #2d3748;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

.form-file {
  padding: 0.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-file:hover {
  border-color: #667eea;
  background: white;
}

.form-hint {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-footer {
  padding: 1rem 2rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* 文章容器 */
.articles-container {
  padding: 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #718096;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #718096;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #4a5568;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
}

/* 文章列表 */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.article-card:hover {
  border-color: #cbd5e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.article-header {
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.article-type {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-date {
  color: #a0aec0;
  font-size: 0.875rem;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s ease;
}

.article-title:hover {
  color: #667eea;
}

.article-content {
  margin-bottom: 1.5rem;
}

.article-excerpt {
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
}

/* AI评价样式 */
.ai-evaluation {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.ai-evaluation-header {
  margin-bottom: 0.75rem;
}

.ai-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fallback-badge {
  background: #fed7aa;
  color: #c05621;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.ai-evaluation-content {
  background: white;
  border-radius: 6px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
}

.ai-text {
  color: #2d3748;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
}

.ai-evaluation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #f7fafc;
}

.ai-like-btn {
  background: transparent;
  border: 1px solid #cbd5e0;
  color: #718096;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
}

.ai-like-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.ai-time {
  color: #a0aec0;
  font-size: 0.75rem;
}

/* 文章页脚 */
.article-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f7fafc;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
}

.article-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-btn {
  background: transparent;
  border: none;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.stat-btn:hover {
  background: #f7fafc;
  color: #4a5568;
}

.stat-btn.like-btn:hover {
  background: #fed7d7;
  color: #c53030;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0aec0;
  font-size: 0.875rem;
}

.article-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-footer {
    flex-direction: column;
  }

  .article-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .article-stats {
    justify-content: space-between;
  }

  .articles-container {
    padding: 1rem;
  }

  .editor-form {
    margin: 1rem;
  }

  .form-body {
    padding: 1rem;
  }

  .form-header {
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .form-footer {
    padding: 0.5rem 1rem 1rem 1rem;
  }
}






</style>
