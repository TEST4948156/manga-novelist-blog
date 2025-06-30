<template>
  <div class="character-gallery">
    <div class="gallery-header">
      <h2>👥 角色设定库</h2>
      <p>记录每个角色的独特魅力</p>
      <button class="add-btn" @click="showAddForm = !showAddForm">
        {{ showAddForm ? '取消' : '+ 创建新角色' }}
      </button>
    </div>

    <!-- 添加新角色表单 -->
    <div v-if="showAddForm" class="add-form">
      <div class="form-row">
        <div class="form-group">
          <label>角色姓名</label>
          <input v-model="newCharacter.name" type="text" placeholder="输入角色姓名...">
        </div>
        <div class="form-group">
          <label>年龄</label>
          <input v-model="newCharacter.age" type="number" placeholder="年龄">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>性别</label>
          <select v-model="newCharacter.gender">
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div class="form-group">
          <label>职业/身份</label>
          <input v-model="newCharacter.occupation" type="text" placeholder="学生、魔法师、骑士...">
        </div>
      </div>

      <div class="form-group">
        <label>关联作品</label>
        <select v-model="newCharacter.relatedWork" multiple>
          <option value="">无关联作品</option>
          <option v-for="work in availableWorks" :key="work.id" :value="work.id">
            {{ work.title }} ({{ work.type }})
          </option>
        </select>
        <small class="form-hint">可选择多个相关作品，按住Ctrl键多选</small>
      </div>

      <div class="form-group">
        <label>外貌特征</label>
        <textarea v-model="newCharacter.appearance" placeholder="描述角色的外貌特征..." rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>性格特点</label>
        <textarea v-model="newCharacter.personality" placeholder="描述角色的性格特点..." rows="3"></textarea>
      </div>

      <div class="form-group">
        <label>背景故事</label>
        <textarea v-model="newCharacter.background" placeholder="角色的背景故事和经历..." rows="4"></textarea>
      </div>

      <div class="form-group">
        <label>特殊能力/技能</label>
        <input v-model="newCharacter.abilities" type="text" placeholder="用逗号分隔，如：魔法,剑术,治愈">
      </div>

      <div class="form-actions">
        <button @click="addCharacter" class="save-btn">保存角色</button>
        <button @click="resetForm" class="cancel-btn">重置</button>
      </div>
    </div>

    <!-- 角色卡片网格 -->
    <div class="characters-grid">
      <div v-for="character in characters" :key="character.id" class="character-card">
        <div class="character-avatar">
          <div class="avatar-placeholder">
            {{ character.name.charAt(0) }}
          </div>
          <div class="character-basic">
            <h3>{{ character.name }}</h3>
            <div class="character-info">
              <span class="age">{{ character.age }}岁</span>
              <span class="gender">{{ character.gender }}</span>
              <span class="occupation">{{ character.occupation }}</span>
            </div>
          </div>
        </div>

        <div class="character-details">
          <div class="detail-section">
            <h4>🎨 外貌</h4>
            <p>{{ character.appearance || '暂无描述' }}</p>
          </div>

          <div class="detail-section">
            <h4>💭 性格</h4>
            <p>{{ character.personality || '暂无描述' }}</p>
          </div>

          <div class="detail-section">
            <h4>📖 背景</h4>
            <p>{{ character.background || '暂无描述' }}</p>
          </div>

          <div v-if="character.abilities.length > 0" class="abilities">
            <h4>⚡ 能力</h4>
            <div class="ability-tags">
              <span v-for="ability in character.abilities" :key="ability" class="ability-tag">
                {{ ability }}
              </span>
            </div>
          </div>

          <div v-if="character.relatedWorks && character.relatedWorks.length > 0 && Array.isArray(availableWorks)" class="related-works">
            <h4>📚 相关作品</h4>
            <div class="work-tags">
              <span v-for="workId in character.relatedWorks" :key="workId" class="work-tag">
                {{ getWorkTitle(workId) }}
              </span>
            </div>
          </div>
        </div>

        <div class="character-actions">
          <button @click="viewCharacterDetail(character)" class="detail-btn">查看详情</button>
          <button @click="editCharacter(character)" class="edit-btn">编辑</button>
          <button @click="deleteCharacter(character.id)" class="delete-btn">删除</button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="characters.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>还没有角色</h3>
      <p>开始创建你的第一个角色吧！</p>
    </div>

    <!-- 详情弹框 -->
    <DetailModal
      :isVisible="showDetailModal"
      :title="selectedCharacter?.name || ''"
      type="character"
      :data="selectedCharacter"
      @close="closeDetailModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import DetailModal from './DetailModal.vue'
import { apiService, type Work } from '../services/api'

interface Character {
  id: number
  name: string
  age: number
  gender: string
  occupation: string
  appearance: string
  personality: string
  background: string
  abilities: string[]
  relatedWorks: string[] // 关联的作品ID数组
  createdAt: Date
  likes: number
}

const showAddForm = ref(false)
const showDetailModal = ref(false)
const selectedCharacter = ref<Character | null>(null)
const characters = ref<Character[]>([])
const availableWorks = ref<Work[]>([])

const newCharacter = reactive({
  name: '',
  age: 18,
  gender: '女',
  occupation: '',
  appearance: '',
  personality: '',
  background: '',
  abilities: '',
  relatedWork: [] as string[]
})

// 加载作品数据
const loadWorks = async () => {
  try {
    const response = await apiService.getWorks()
    // 确保 availableWorks 是数组
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

// 初始化示例数据
onMounted(async () => {
  await loadWorks()
  const savedCharacters = localStorage.getItem('manga-novelist-characters')
  if (savedCharacters) {
    characters.value = JSON.parse(savedCharacters).map((char: any) => ({
      ...char,
      createdAt: new Date(char.createdAt)
    }))
  } else {
    // 添加示例角色
    characters.value = [
      {
        id: 1,
        name: '樱井美咲',
        age: 17,
        gender: '女',
        occupation: '高中生',
        appearance: '长长的黑发，总是扎着马尾辫。有着明亮的棕色眼睛，笑起来很甜美。身材娇小，喜欢穿校服和可爱的连衣裙。',
        personality: '开朗活泼，对任何事都充满好奇心。有时候会有点迷糊，但内心很坚强。喜欢帮助别人，是个天生的乐观主义者。',
        background: '出生在一个普通的家庭，从小就对绘画有着浓厚的兴趣。梦想成为一名漫画家，正在为此努力学习。',
        abilities: ['绘画', '创意思维', '共情能力'],
        relatedWorks: [],
        createdAt: new Date('2024-01-10'),
        likes: 15
      },
      {
        id: 2,
        name: '雷恩·阿斯特拉',
        age: 19,
        gender: '男',
        occupation: '魔法学院学生',
        appearance: '银白色的短发，深蓝色的眼睛如同夜空中的星辰。身材高挑，总是穿着学院的深蓝色制服。',
        personality: '冷静理智，但内心温柔。对魔法有着极高的天赋，但不喜欢炫耀。重视友情，会为了保护重要的人而战。',
        background: '来自古老的魔法世家，从小接受严格的魔法训练。背负着家族的期望，但更想按照自己的意愿生活。',
        abilities: ['冰系魔法', '治愈术', '剑术'],
        relatedWorks: [],
        createdAt: new Date('2024-01-12'),
        likes: 23
      }
    ]
    saveCharacters()
  }
})

const addCharacter = () => {
  if (!newCharacter.name.trim()) {
    alert('请填写角色姓名')
    return
  }

  const character: Character = {
    id: Date.now(),
    name: newCharacter.name,
    age: newCharacter.age,
    gender: newCharacter.gender,
    occupation: newCharacter.occupation,
    appearance: newCharacter.appearance,
    personality: newCharacter.personality,
    background: newCharacter.background,
    abilities: newCharacter.abilities.split(',').map(ability => ability.trim()).filter(ability => ability),
    relatedWorks: Array.isArray(newCharacter.relatedWork) ? newCharacter.relatedWork : [],
    createdAt: new Date(),
    likes: 0
  }

  characters.value.unshift(character)
  saveCharacters()
  resetForm()
  showAddForm.value = false
}

const editCharacter = (character: Character) => {
  newCharacter.name = character.name
  newCharacter.age = character.age
  newCharacter.gender = character.gender
  newCharacter.occupation = character.occupation
  newCharacter.appearance = character.appearance
  newCharacter.personality = character.personality
  newCharacter.background = character.background
  newCharacter.abilities = character.abilities.join(', ')
  showAddForm.value = true
  deleteCharacter(character.id)
}

const deleteCharacter = (id: number) => {
  if (confirm('确定要删除这个角色吗？')) {
    characters.value = characters.value.filter(char => char.id !== id)
    saveCharacters()
  }
}

const resetForm = () => {
  newCharacter.name = ''
  newCharacter.age = 18
  newCharacter.gender = '女'
  newCharacter.occupation = ''
  newCharacter.appearance = ''
  newCharacter.personality = ''
  newCharacter.background = ''
  newCharacter.abilities = ''
  newCharacter.relatedWork = []
}

const saveCharacters = () => {
  localStorage.setItem('manga-novelist-characters', JSON.stringify(characters.value))
}

// 根据作品ID获取作品标题
const getWorkTitle = (workId: string) => {
  if (!Array.isArray(availableWorks.value)) {
    return '未知作品'
  }
  const work = availableWorks.value.find(w => w.id === workId)
  return work ? work.title : '未知作品'
}

const viewCharacterDetail = (character: Character) => {
  selectedCharacter.value = character
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedCharacter.value = null
}
</script>

<style scoped>
.character-gallery {
  padding: 2rem;
}

.gallery-header {
  text-align: center;
  margin-bottom: 2rem;
}

.gallery-header h2 {
  color: #4c1d95;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.gallery-header p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.add-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
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
  border-color: #f59e0b;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.save-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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

.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.character-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: 2px solid transparent;
}

.character-card:hover {
  transform: translateY(-8px);
  border-color: #f59e0b;
}

.character-avatar {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 1rem;
}

.character-basic h3 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 1.3rem;
}

.character-info {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.character-info span {
  background: #fef3c7;
  color: #92400e;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.character-details {
  margin-bottom: 1.5rem;
}

.detail-section {
  margin-bottom: 1rem;
}

.detail-section h4 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.detail-section p {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  font-size: 0.9rem;
}

.abilities h4 {
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.ability-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ability-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.related-works {
  margin-top: 1rem;
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.work-tag {
  background: #48bb78;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.character-actions {
  display: flex;
  gap: 0.5rem;
}

.detail-btn,
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

.edit-btn {
  background: #dbeafe;
  color: #1e40af;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
}

.detail-btn:hover,
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
  .character-gallery {
    padding: 1rem;
  }
  
  .characters-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .character-info {
    flex-direction: column;
  }
}
</style>
