<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button @click="closeModal" class="close-btn">✕</button>
      </div>
      
      <div class="modal-content">
        <!-- 作品详情 -->
        <div v-if="type === 'work'" class="work-detail">
          <div class="detail-meta">
            <span class="detail-type">{{ data.type }}</span>
            <span class="detail-date">{{ formatDate(data.createdAt) }}</span>
          </div>
          
          <div class="detail-tags" v-if="data.tags && data.tags.length > 0">
            <span v-for="tag in data.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          
          <div class="detail-content">
            <h3>📖 内容</h3>
            <div class="content-text">{{ data.content }}</div>
          </div>
          
          <div class="detail-stats">
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ data.likes || 0 }} 点赞</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📝</span>
              <span class="stat-value">{{ data.content?.length || 0 }} 字</span>
            </div>
          </div>
        </div>

        <!-- 角色详情 -->
        <div v-if="type === 'character'" class="character-detail">
          <div class="character-header">
            <div class="character-avatar-large">
              {{ data.name?.charAt(0) }}
            </div>
            <div class="character-basic-info">
              <div class="character-info-row">
                <span class="info-label">年龄:</span>
                <span class="info-value">{{ data.age }}岁</span>
              </div>
              <div class="character-info-row">
                <span class="info-label">性别:</span>
                <span class="info-value">{{ data.gender }}</span>
              </div>
              <div class="character-info-row">
                <span class="info-label">职业:</span>
                <span class="info-value">{{ data.occupation }}</span>
              </div>
            </div>
          </div>

          <div class="character-sections">
            <div class="detail-section">
              <h3>🎨 外貌特征</h3>
              <p>{{ data.appearance || '暂无描述' }}</p>
            </div>

            <div class="detail-section">
              <h3>💭 性格特点</h3>
              <p>{{ data.personality || '暂无描述' }}</p>
            </div>

            <div class="detail-section">
              <h3>📖 背景故事</h3>
              <p>{{ data.background || '暂无描述' }}</p>
            </div>

            <div v-if="data.abilities && data.abilities.length > 0" class="detail-section">
              <h3>⚡ 特殊能力</h3>
              <div class="abilities-grid">
                <span v-for="ability in data.abilities" :key="ability" class="ability-tag">
                  {{ ability }}
                </span>
              </div>
            </div>
          </div>

          <div class="detail-stats">
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ data.likes || 0 }} 点赞</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📅</span>
              <span class="stat-value">{{ formatDate(data.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- 档案详情 -->
        <div v-if="type === 'archive'" class="archive-detail">
          <div class="detail-meta">
            <span class="detail-type">{{ data.type }}</span>
            <span :class="['detail-status', data.status]">{{ data.status }}</span>
          </div>
          
          <div class="detail-section" v-if="data.summary">
            <h3>📋 简介</h3>
            <p>{{ data.summary }}</p>
          </div>
          
          <div class="detail-section">
            <h3>📖 详细内容</h3>
            <div class="content-text">{{ data.content }}</div>
          </div>
          
          <div class="detail-tags" v-if="data.tags && data.tags.length > 0">
            <h3>🏷️ 标签</h3>
            <div class="tags-container">
              <span v-for="tag in data.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          
          <div class="detail-stats">
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ data.likes || 0 }} 点赞</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📅</span>
              <span class="stat-value">{{ formatDate(data.createdAt) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">📝</span>
              <span class="stat-value">{{ data.content?.length || 0 }} 字</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="closeModal" class="close-footer-btn">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  isVisible: boolean
  title: string
  type: 'work' | 'character' | 'archive'
  data: any
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const formatDate = (date: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
}

.close-btn {
  background: #e2e8f0;
  border: none;
  color: #4a5568;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #cbd5e0;
  color: #2d3748;
}

.modal-content {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.detail-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.detail-type {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-date {
  background: #e0e7ff;
  color: #5b21b6;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-status {
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-status.草稿 { background: #f3f4f6; color: #6b7280; }
.detail-status.进行中 { background: #dbeafe; color: #1e40af; }
.detail-status.已完成 { background: #d1fae5; color: #065f46; }
.detail-status.暂停 { background: #fee2e2; color: #dc2626; }

.detail-tags {
  margin-bottom: 1.5rem;
}

.detail-tags h3 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.1rem;
}

.tags-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #e0e7ff;
  color: #5b21b6;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #374151;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-section p {
  color: #4b5563;
  line-height: 1.8;
  margin: 0;
  font-size: 1rem;
}

.content-text {
  color: #4b5563;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 1rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #8b5cf6;
}

.character-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
}

.character-avatar-large {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  flex-shrink: 0;
}

.character-basic-info {
  flex: 1;
}

.character-info-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.info-label {
  font-weight: 600;
  color: #374151;
  min-width: 60px;
}

.info-value {
  color: #6b7280;
}

.abilities-grid {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ability-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.detail-stats {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-value {
  color: #374151;
  font-weight: 500;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 2px solid #f3f4f6;
  text-align: center;
  background: #f8fafc;
}

.close-footer-btn {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.close-footer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .character-header {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
