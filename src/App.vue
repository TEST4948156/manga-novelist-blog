<script setup lang="ts">
import { ref, onMounted } from 'vue'
import WritingPortfolio from './components/WritingPortfolio.vue'
import CharacterGallery from './components/CharacterGallery.vue'
import StoryArchive from './components/StoryArchive.vue'
import LoginModal from './components/LoginModal.vue'
import logoImage from './assets/b_40581f85f74b88e38e9dc7d2ea0b139c.jpg'
import { apiService } from './services/api'

const activeTab = ref('portfolio')
const showLoginModal = ref(false)
const isAdmin = ref(false)
const stats = ref({
  total_works: 0,
  total_likes: 0,
  total_views: 0
})

const activities = ref<any[]>([])

// 检查登录状态
onMounted(async () => {
  checkAdminStatus()
  await loadStats()
  await loadActivities()
})

const checkAdminStatus = () => {
  isAdmin.value = localStorage.getItem('manga-novelist-admin') === 'true'
}

const loadStats = async () => {
  try {
    const response = await apiService.getStats()
    stats.value = response
  } catch (error) {
    console.warn('获取统计数据失败，使用默认值')
    // 使用默认值或从本地存储获取
    const savedWorks = localStorage.getItem('manga-novelist-works')
    if (savedWorks) {
      const works = JSON.parse(savedWorks)
      stats.value = {
        total_works: works.length,
        total_likes: works.reduce((sum: number, work: any) => sum + (work.likes || 0), 0),
        total_views: works.reduce((sum: number, work: any) => sum + (work.views || 0), 0)
      }
    }
  }
}

const loadActivities = async () => {
  try {
    const response = await apiService.getActivities(5) // 获取最新5条动态
    activities.value = response
  } catch (error) {
    console.warn('获取活动数据失败，使用默认值')
    // 使用默认的活动数据
    activities.value = [
      {
        id: '1',
        type: 'create',
        description: '发布了新作品《樱花飘落的午后》',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2小时前
      },
      {
        id: '2',
        type: 'ai_evaluation',
        description: 'AI为作品《魔法学院的新生》生成了评价',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1天前
      },
      {
        id: '3',
        type: 'like',
        description: '有人为作品《星空下的约定》点赞',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3天前
      }
    ]
  }
}

const handleLogin = () => {
  showLoginModal.value = true
}

const handleLoginSuccess = (adminStatus: boolean) => {
  isAdmin.value = adminStatus
  showLoginModal.value = false
}

const handleLogout = () => {
  localStorage.removeItem('manga-novelist-admin')
  isAdmin.value = false
}

const refreshData = async () => {
  await loadStats()
  await loadActivities()
}

// 格式化相对时间
const formatRelativeTime = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }
}

// 获取活动类型的图标
const getActivityIcon = (type: string) => {
  const icons = {
    create: '📝',
    like: '❤️'
  }
  return icons[type as keyof typeof icons] || '📌'
}
</script>

<template>
  <div class="blog-app">
    <!-- 顶部导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <img :src="logoImage" alt="头像" class="avatar" />
          <div class="brand-info">
            <h1 class="brand-title">文笔部漫画风格的小说家</h1>
            <p class="brand-subtitle">创作空间</p>
          </div>
        </div>

        <div class="nav-menu">
          <a
            href="#"
            :class="['nav-link', { active: activeTab === 'portfolio' }]"
            @click.prevent="activeTab = 'portfolio'"
          >
            <i class="icon">✍️</i>
            <span>作品集</span>
          </a>
          <a
            href="#"
            :class="['nav-link', { active: activeTab === 'characters' }]"
            @click.prevent="activeTab = 'characters'"
          >
            <i class="icon">👥</i>
            <span>角色库</span>
          </a>
          <a
            href="#"
            :class="['nav-link', { active: activeTab === 'archive' }]"
            @click.prevent="activeTab = 'archive'"
          >
            <i class="icon">📚</i>
            <span>故事档案</span>
          </a>

          <!-- 登录/登出按钮 -->
          <div class="auth-section">
            <button v-if="!isAdmin" @click="handleLogin" class="nav-link auth-btn">
              <i class="icon">🔐</i>
              <span>登录</span>
            </button>
            <div v-else class="admin-info">
              <span class="admin-badge">
                <i class="icon">👑</i>
                管理员
              </span>
              <button @click="handleLogout" class="logout-btn">
                <i class="icon">🚪</i>
                登出
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-container">
      <div class="content-area">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="profile-card">
            <div class="profile-avatar">
              <img :src="logoImage" alt="头像" />
            </div>
            <h3 class="profile-name">文笔部漫画风格小说家</h3>
            <p class="profile-bio">白金之姿<br>联系QQ：548830248<br>QQ群：745311733（文笔部）</p>
            <div class="motivational-quote">
              <p class="quote-text">💪 唯有坚持才能成为白金，加油！</p>
            </div>
            <div class="profile-stats">
              <div class="stat-item">
                <span class="stat-number">{{ stats.total_works }}</span>
                <span class="stat-label">作品</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ stats.total_likes }}</span>
                <span class="stat-label">点赞</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ stats.total_views }}</span>
                <span class="stat-label">浏览</span>
              </div>
            </div>
          </div>

          <div class="sidebar-widget">
            <h4 class="widget-title">
              最新动态
              <button @click="refreshData" class="refresh-btn" title="刷新动态">
                🔄
              </button>
            </h4>
            <div class="activity-list">
              <div v-if="activities.length === 0" class="activity-item empty">
                <span class="activity-text">暂无动态记录</span>
              </div>
              <div v-else v-for="activity in activities" :key="activity.id" class="activity-item">
                <div class="activity-header">
                  <span class="activity-icon">{{ getActivityIcon(activity.type) }}</span>
                  <span class="activity-time">{{ formatRelativeTime(activity.created_at) }}</span>
                </div>
                <span class="activity-text">{{ activity.description }}</span>
              </div>
            </div>
          </div>

          <div class="sidebar-widget">
            <h4 class="widget-title">标签云</h4>
            <div class="tag-cloud">
              <span class="tag">浪漫</span>
              <span class="tag">校园</span>
              <span class="tag">奇幻</span>
              <span class="tag">魔法</span>
              <span class="tag">青春</span>
              <span class="tag">成长</span>
              <span class="tag">冒险</span>
            </div>
          </div>
        </aside>

        <!-- 主内容区 -->
        <section class="main-content">
          <WritingPortfolio
            v-if="activeTab === 'portfolio'"
            :is-admin="isAdmin"
            @stats-updated="refreshData"
          />
          <CharacterGallery v-if="activeTab === 'characters'" />
          <StoryArchive v-if="activeTab === 'archive'" />
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="blog-footer">
      <div class="footer-content">
        <p>&copy; 2024 文笔部 - 用心记录每一个故事</p>
        <div class="footer-links">
          <a href="#">关于我</a>
          <a href="#">联系方式  想要同样博客的添加QQ：1420440999（备注来意）</a>
          <a href="#">RSS订阅</a>
        </div>
      </div>
    </footer>

    <!-- 登录弹框 -->
    <LoginModal
      :is-visible="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<style scoped>
/* 博客风格的全局样式 */
.blog-app {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.6;
  color: #2d3748;
}

/* 顶部导航栏 */
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

/* 品牌区域 */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
  line-height: 1.2;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: #f7fafc;
  color: #2d3748;
}

.nav-link.active {
  background: #667eea;
  color: white;
}

.nav-link .icon {
  font-size: 1.1rem;
}

/* 认证相关样式 */
.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-btn {
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
}

.auth-btn:hover {
  background: #5a67d8;
  color: white;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-badge {
  background: #48bb78;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logout-btn:hover {
  background: #c53030;
}

/* 主容器 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 70px);
}

.content-area {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.profile-avatar {
  margin-bottom: 1rem;
}

.profile-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.profile-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
}

.profile-bio {
  color: #718096;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.motivational-quote {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.quote-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  line-height: 1.4;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 0.75rem;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* 侧边栏小部件 */
.sidebar-widget {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.widget-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-btn {
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.refresh-btn:hover {
  background: #f7fafc;
  opacity: 1;
  transform: rotate(180deg);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f7fafc;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item.empty {
  text-align: center;
  color: #a0aec0;
  font-style: italic;
  padding: 1rem 0;
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-icon {
  font-size: 0.875rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #a0aec0;
  margin-left: auto;
}

.activity-text {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.4;
  margin-left: 1.5rem;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f7fafc;
  color: #4a5568;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* 主内容区 */
.main-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-height: 600px;
}

/* 页脚 */
.blog-footer {
  background: #1a202c;
  color: #a0aec0;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-content p {
  margin: 0;
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: #a0aec0;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #667eea;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    height: auto;
    padding-top: 1rem;
    padding-bottom: 1rem;
    gap: 1rem;
  }

  .nav-menu {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem;
    font-size: 0.875rem;
  }

  .main-container {
    padding: 1rem;
  }

  .content-area {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .sidebar {
    order: 2;
  }

  .main-content {
    order: 1;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .profile-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-item {
    flex-direction: row;
    justify-content: space-between;
  }

  .motivational-quote {
    margin-bottom: 1rem;
  }

  .quote-text {
    font-size: 0.8rem;
  }
}


</style>
