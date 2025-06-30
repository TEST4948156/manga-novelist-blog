<template>
  <div class="story-archive">
    <div class="archive-header">
      <h2>📖 故事档案库</h2>
      <p>记录世界观设定与故事大纲</p>
      <button class="add-btn" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '取消' : '+ 创建新档案' }}
      </button>
    </div>

    <!-- 添加新档案表单 -->
    <div v-if="showAddForm" class="add-form">
      <div class="form-row">
        <div class="form-group">
          <label>档案标题</label>
          <input v-model="newArchive.title" type="text" placeholder="输入档案标题...">
        </div>
        <div class="form-group">
          <label>档案类型</label>
          <select v-model="newArchive.type">
            <option value="世界观">世界观</option>
            <option value="故事大纲">故事大纲</option>
            <option value="设定集">设定集</option>
            <option value="时间线">时间线</option>
            <option value="地图">地图</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label>简介</label>
        <textarea v-model="newArchive.summary" placeholder="简要描述这个档案的内容..." rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>详细内容</label>
        <textarea v-model="newArchive.content" placeholder="详细记录你的设定、大纲或其他内容..." rows="8"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>状态</label>
          <select v-model="newArchive.status">
            <option value="草稿">草稿</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
            <option value="暂停">暂停</option>
          </select>
        </div>
        <div class="form-group">
          <label>关联作品</label>
          <select v-model="newArchive.relatedWork" multiple>
            <option value="">无关联作品</option>
            <option v-for="work in availableWorks" :key="work.id" :value="work.id">
              {{ work.title }} ({{ work.type }})
            </option>
          </select>
          <small class="form-hint">可选择多个相关作品，按住Ctrl键多选</small>
        </div>
        <div class="form-group">
          <label>标签</label>
          <input v-model="newArchive.tags" type="text" placeholder="用逗号分隔标签">
        </div>
      </div>

      <div class="form-actions">
        <button @click="addArchive" class="save-btn">保存档案</button>
        <button @click="resetForm" class="cancel-btn">重置</button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-group">
        <label>类型筛选：</label>
        <select v-model="filterType">
          <option value="">全部类型</option>
          <option value="世界观">世界观</option>
          <option value="故事大纲">故事大纲</option>
          <option value="设定集">设定集</option>
          <option value="时间线">时间线</option>
          <option value="地图">地图</option>
          <option value="其他">其他</option>
        </select>
      </div>
      <div class="filter-group">
        <label>状态筛选：</label>
        <select v-model="filterStatus">
          <option value="">全部状态</option>
          <option value="草稿">草稿</option>
          <option value="进行中">进行中</option>
          <option value="已完成">已完成</option>
          <option value="暂停">暂停</option>
        </select>
      </div>
    </div>

    <!-- 档案列表 -->
    <div class="archives-grid">
      <div v-for="archive in filteredArchives" :key="archive.id" class="archive-card">
        <div class="archive-header-card">
          <div class="archive-title">
            <h3>{{ archive.title }}</h3>
            <div class="archive-meta">
              <span class="archive-type">{{ archive.type }}</span>
              <span :class="['archive-status', archive.status]">{{ archive.status }}</span>
            </div>
          </div>
        </div>

        <div class="archive-summary">
          <p>{{ archive.summary || '暂无简介' }}</p>
        </div>

        <div class="archive-content" v-if="expandedArchive === archive.id">
          <h4>详细内容：</h4>
          <div class="content-text">{{ archive.content }}</div>
        </div>

        <div class="archive-footer">
          <div class="tags" v-if="archive.tags.length > 0">
            <span v-for="tag in archive.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div v-if="archive.relatedWorks && archive.relatedWorks.length > 0 && Array.isArray(availableWorks)" class="related-works">
            <span class="related-label">📚 相关作品:</span>
            <span v-for="workId in archive.relatedWorks" :key="workId" class="work-tag">
              {{ getWorkTitle(workId) }}
            </span>
          </div>
          <div class="archive-date">{{ formatDate(archive.createdAt) }}</div>
        </div>

        <div class="archive-actions">
          <button @click="viewArchiveDetail(archive)" class="detail-btn">查看详情</button>
          <button @click="toggleExpand(archive.id)" class="expand-btn">
            {{ expandedArchive === archive.id ? '收起' : '展开' }}
          </button>
          <button @click="editArchive(archive)" class="edit-btn">编辑</button>
          <button @click="deleteArchive(archive.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredArchives.length === 0" class="empty-state">
      <div class="empty-icon">📖</div>
      <h3>{{ archives.length === 0 ? '还没有档案' : '没有符合条件的档案' }}</h3>
      <p>{{ archives.length === 0 ? '开始创建你的第一个故事档案吧！' : '尝试调整筛选条件' }}</p>
    </div>

    <!-- 详情弹框 -->
    <DetailModal
      :isVisible="showDetailModal"
      :title="selectedArchive?.title || ''"
      type="archive"
      :data="selectedArchive"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import DetailModal from './DetailModal.vue'
import { apiService, type Work } from '../services/api'

interface Archive {
  id: number
  title: string
  type: string
  summary: string
  content: string
  status: string
  tags: string[]
  relatedWorks: string[] // 关联的作品ID数组
  createdAt: Date
}

const showAddForm = ref(false)
const showDetailModal = ref(false)
const selectedArchive = ref<Archive | null>(null)
const expandedArchive = ref<number | null>(null)
const filterType = ref('')
const filterStatus = ref('')
const archives = ref<Archive[]>([])
const availableWorks = ref<Work[]>([])

const newArchive = reactive({
  title: '',
  type: '世界观',
  summary: '',
  content: '',
  status: '草稿',
  tags: '',
  relatedWork: [] as string[]
})

// 筛选后的档案
const filteredArchives = computed(() => {
  return archives.value.filter(archive => {
    const typeMatch = !filterType.value || archive.type === filterType.value
    const statusMatch = !filterStatus.value || archive.status === filterStatus.value
    return typeMatch && statusMatch
  })
})

// 加载作品数据
const loadWorks = async () => {
  try {
    const response = await apiService.getWorks()
    availableWorks.value = Array.isArray(response) ? response : (response.works || [])
  } catch (error) {
    console.warn('获取作品列表失败，使用本地存储')
    const savedWorks = localStorage.getItem('manga-novelist-works')
    if (savedWorks) {
      const parsed = JSON.parse(savedWorks)
      availableWorks.value = Array.isArray(parsed) ? parsed : []
    } else {
      availableWorks.value = []
    }
  }
}

// 根据作品ID获取作品标题
const getWorkTitle = (workId: string) => {
  if (!Array.isArray(availableWorks.value)) {
    return '未知作品'
  }
  const work = availableWorks.value.find(w => w.id === workId)
  return work ? work.title : '未知作品'
}

// 初始化示例数据
onMounted(async () => {
  await loadWorks()
  const savedArchives = localStorage.getItem('manga-novelist-archives')
  if (savedArchives) {
    archives.value = JSON.parse(savedArchives).map((archive: any) => ({
      ...archive,
      createdAt: new Date(archive.createdAt)
    }))
  } else {
    // 添加示例档案
    archives.value = [
      {
        id: 1,
        title: '魔法学院世界观设定',
        type: '世界观',
        summary: '一个充满魔法与奇迹的学院世界，学生们在这里学习各种魔法技能。',
        content: `魔法学院位于云雾缭绕的高山之上，是一座拥有千年历史的古老建筑。学院分为四个学院：\n\n1. 元素学院 - 专精火、水、土、风四大元素魔法\n2. 治愈学院 - 专精治愈术和防护魔法\n3. 幻术学院 - 专精幻象和精神魔法\n4. 召唤学院 - 专精召唤术和契约魔法\n\n学院的魔法来源于古老的魔法水晶，这些水晶蕴含着纯净的魔法能量。学生们通过冥想和练习来感知和操控这些能量。`,
        status: '已完成',
        tags: ['魔法', '学院', '奇幻'],
        relatedWorks: [],
        createdAt: new Date('2024-01-08')
      },
      {
        id: 2,
        title: '青春校园恋爱故事大纲',
        type: '故事大纲',
        summary: '一个关于高中生美咲和她的朋友们的青春恋爱故事。',
        content: `第一章：新学期的开始\n- 美咲转学到新的高中\n- 遇到了神秘的学长雷恩\n- 加入了美术社\n\n第二章：社团生活\n- 美术社的日常活动\n- 与社团成员建立友谊\n- 准备文化祭的作品\n\n第三章：文化祭\n- 美咲的作品获得好评\n- 与雷恩的关系进展\n- 意外的告白场面\n\n第四章：考验\n- 面临升学压力\n- 友情与爱情的选择\n- 最终的决定`,
        status: '进行中',
        tags: ['校园', '恋爱', '青春'],
        relatedWorks: [],
        createdAt: new Date('2024-01-15')
      }
    ]
    saveArchives()
  }
})

const addArchive = () => {
  if (!newArchive.title.trim() || !newArchive.content.trim()) {
    alert('请填写标题和内容')
    return
  }

  const archive: Archive = {
    id: Date.now(),
    title: newArchive.title,
    type: newArchive.type,
    summary: newArchive.summary,
    content: newArchive.content,
    status: newArchive.status,
    tags: newArchive.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    relatedWorks: Array.isArray(newArchive.relatedWork) ? newArchive.relatedWork : [],
    createdAt: new Date()
  }

  archives.value.unshift(archive)
  saveArchives()
  resetForm()
  showAddForm.value = false
}

const editArchive = (archive: Archive) => {
  newArchive.title = archive.title
  newArchive.type = archive.type
  newArchive.summary = archive.summary
  newArchive.content = archive.content
  newArchive.status = archive.status
  newArchive.tags = archive.tags.join(', ')
  showAddForm.value = true
  deleteArchive(archive.id)
}

const deleteArchive = (id: number) => {
  if (confirm('确定要删除这个档案吗？')) {
    archives.value = archives.value.filter(archive => archive.id !== id)
    saveArchives()
  }
}

const toggleExpand = (id: number) => {
  expandedArchive.value = expandedArchive.value === id ? null : id
}

const resetForm = () => {
  newArchive.title = ''
  newArchive.type = '世界观'
  newArchive.summary = ''
  newArchive.content = ''
  newArchive.status = '草稿'
  newArchive.tags = ''
  newArchive.relatedWork = []
}

const saveArchives = () => {
  localStorage.setItem('manga-novelist-archives', JSON.stringify(archives.value))
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewArchiveDetail = (archive: Archive) => {
  selectedArchive.value = archive
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedArchive.value = null
}
</script>

<style scoped>
.story-archive {
  padding: 2rem;
}

.archive-header {
  text-align: center;
  margin-bottom: 2rem;
}

.archive-header h2 {
  color: #4c1d95;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.archive-header p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.add-btn {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.add-form {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  border: 2px solid #e2e8f0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ec4899;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.save-btn {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
}

.filter-group select {
  padding: 0.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.archives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.archive-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: 2px solid transparent;
}

.archive-card:hover {
  transform: translateY(-5px);
  border-color: #ec4899;
}

.archive-header-card {
  margin-bottom: 1rem;
}

.archive-title h3 {
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.archive-meta {
  display: flex;
  gap: 0.5rem;
}

.archive-type {
  background: #fef3c7;
  color: #92400e;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.archive-status {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.archive-status.草稿 { background: #f3f4f6; color: #6b7280; }
.archive-status.进行中 { background: #dbeafe; color: #1e40af; }
.archive-status.已完成 { background: #d1fae5; color: #065f46; }
.archive-status.暂停 { background: #fee2e2; color: #dc2626; }

.archive-summary p {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.archive-content {
  margin: 1rem 0;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #ec4899;
}

.archive-content h4 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.content-text {
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-line;
}

.archive-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #e0e7ff;
  color: #5b21b6;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

.related-works {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.related-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.work-tag {
  background: #48bb78;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
}

.archive-date {
  color: #9ca3af;
  font-size: 0.9rem;
}

.archive-actions {
  display: flex;
  gap: 0.5rem;
}

.detail-btn,
.expand-btn,
.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.detail-btn {
  background: #f3e8ff;
  color: #7c3aed;
}

.expand-btn {
  background: #f3f4f6;
  color: #374151;
}

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.detail-btn:hover,
.expand-btn:hover,
.edit-btn:hover,
.delete-btn:hover {
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .story-archive {
    padding: 1rem;
  }
  
  .archives-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .archive-actions {
    flex-direction: column;
  }
}
</style>
