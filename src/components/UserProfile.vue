<template>
  <div class="user-profile">
    <!-- 用户信息卡片 -->
    <div class="profile-card">
      <div class="card-header">
        <div class="user-avatar">
          {{ currentUser.avatar }}
        </div>
        <div class="user-info">
          <h3 class="username">{{ currentUser.username }}</h3>
          <p class="member-since">
            加入时间: {{ formatDate(currentUser.createdAt) }}
          </p>
        </div>
        <button class="logout-btn" @click="handleLogout">
          退出登录
        </button>
      </div>
      
      <div class="card-body">
        <!-- 统计信息 -->
        <div class="stats-section">
          <h4>学习统计</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalGames }}</div>
              <div class="stat-label">总游戏次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalCorrect }}</div>
              <div class="stat-label">正确答案</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.totalIncorrect }}</div>
              <div class="stat-label">错误答案</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.bestStreak }}</div>
              <div class="stat-label">最长连胜</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ stats.currentStreak }}</div>
              <div class="stat-label">当前连胜</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ accuracy }}%</div>
              <div class="stat-label">正确率</div>
            </div>
          </div>
        </div>
        
        <!-- 偏好设置 -->
        <div class="preferences-section">
          <h4>偏好设置</h4>
          <div class="preferences-grid">
            <div class="preference-item">
              <label>
                <input
                  type="checkbox"
                  v-model="preferences.soundEnabled"
                  @change="updatePreferences"
                />
                声音效果
              </label>
            </div>
            <div class="preference-item">
              <label>
                <input
                  type="checkbox"
                  v-model="preferences.musicEnabled"
                  @change="updatePreferences"
                />
                背景音乐
              </label>
            </div>
            <div class="preference-item">
              <label>难度设置</label>
              <select
                v-model="preferences.difficulty"
                @change="updatePreferences"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- 最近游戏记录 -->
        <div class="history-section" v-if="gameHistory.length > 0">
          <h4>最近游戏</h4>
          <div class="history-list">
            <div 
              class="history-item" 
              v-for="game in recentGames" 
              :key="game.id"
            >
              <div class="game-info">
                <div class="game-type">{{ getGameTypeText(game.gameType) }}</div>
                <div class="game-answer">
                  {{ game.question }} = <span :class="game.isCorrect ? 'correct' : 'incorrect'">{{ game.userAnswer }}</span>
                </div>
                <div class="game-time">{{ formatTime(game.timestamp) }}</div>
              </div>
              <div class="game-result" :class="game.isCorrect ? 'correct' : 'incorrect'">
                {{ game.isCorrect ? '✓' : '✗' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StorageManager from '../utils/storage'

export default {
  name: 'UserProfile',
  
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      currentUser: null,
      stats: {},
      preferences: {},
      gameHistory: []
    }
  },
  
  computed: {
    accuracy() {
      if (this.stats.totalGames === 0) return 0
      return Math.round((this.stats.totalCorrect / this.stats.totalGames) * 100)
    },
    
    recentGames() {
      return this.gameHistory.slice(0, 5)
    }
  },
  
  watch: {
    user(newUser) {
      if (newUser) {
        this.loadUserData(newUser)
      }
    }
  },
  
  created() {
    if (this.user) {
      this.loadUserData(this.user)
    }
  },
  
  methods: {
    loadUserData(user) {
      this.currentUser = user
      this.stats = user.stats || {}
      this.preferences = user.preferences || {}
      this.gameHistory = user.gameHistory || []
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    
    formatTime(dateString) {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (seconds < 60) return '刚刚'
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      if (days < 7) return `${days}天前`
      
      return this.formatDate(dateString)
    },
    
    getGameTypeText(gameType) {
      const typeMap = {
        'addition': '加法',
        'subtraction': '减法',
        'mixed': '混合运算',
        'counting': '数数',
        'comparison': '比较'
      }
      return typeMap[gameType] || gameType
    },
    
    updatePreferences() {
      StorageManager.updateUser(this.currentUser.id, {
        preferences: this.preferences
      })
    },
    
    handleLogout() {
      if (confirm('确定要退出登录吗？')) {
        StorageManager.clearCurrentUser()
        this.$emit('logout')
      }
    }
  }
}
</script>

<style scoped>
.user-profile {
  padding: 10px;
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  flex-shrink: 0;
  height: 80px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.username {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.member-since {
  font-size: 0.8rem;
  opacity: 0.9;
}

.logout-btn {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.card-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.stats-section,
.preferences-section,
.history-section {
  margin-bottom: 30px;
}

.stats-section h4,
.preferences-section h4,
.history-section h4 {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 3px;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.preference-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preference-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.preference-item select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item:hover {
  background-color: #f8f9fa;
}

.game-info {
  flex: 1;
  min-width: 0;
}

.game-type {
  font-weight: 500;
  color: #667eea;
  margin-bottom: 3px;
  font-size: 0.9rem;
}

.game-answer {
  font-family: monospace;
  font-size: 0.95rem;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-answer .correct {
  color: #52c41a;
}

.game-answer .incorrect {
  color: #ff4d4f;
}

.game-time {
  font-size: 0.75rem;
  color: #999;
}

.game-result {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  flex-shrink: 0;
}

.game-result.correct {
  background: #52c41a;
  color: white;
}

.game-result.incorrect {
  background: #ff4d4f;
  color: white;
}

@media (max-width: 768px) {
  .card-header {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
  
  .user-avatar {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .username {
    font-size: 1.2rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preferences-grid {
    grid-template-columns: 1fr;
  }
}
</style>
