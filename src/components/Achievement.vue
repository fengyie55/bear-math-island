<template>
  <div class="achievement-container">
    <div class="achievement-header">
      <h2>🏆 成就系统</h2>
      <div class="achievement-stats">
        <div class="stat-item">
          <span class="stat-value">{{ unlockedAchievements.length }}</span>
          <span class="stat-label">已解锁</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ totalAchievements }}</span>
          <span class="stat-label">总成就</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ Math.round((unlockedAchievements.length / totalAchievements) * 100) }}%</span>
          <span class="stat-label">完成率</span>
        </div>
      </div>
    </div>
    
    <div class="achievement-content">
      <!-- 已解锁成就 -->
      <div class="achievement-section">
        <h3>✨ 已解锁成就</h3>
        <div class="achievement-grid">
          <div 
            v-for="achievement in unlockedAchievements" 
            :key="achievement.id"
            class="achievement-card unlocked"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <div class="achievement-title">{{ achievement.title }}</div>
              <div class="achievement-description">{{ achievement.description }}</div>
              <div class="achievement-date">解锁时间: {{ formatDate(achievement.unlockedAt) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 未解锁成就 -->
      <div class="achievement-section">
        <h3>🔒 未解锁成就</h3>
        <div class="achievement-grid">
          <div 
            v-for="achievement in lockedAchievements" 
            :key="achievement.id"
            class="achievement-card locked"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <div class="achievement-title">{{ achievement.title }}</div>
              <div class="achievement-description">{{ achievement.description }}</div>
              <div class="achievement-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getProgress(achievement) + '%' }"></div>
                </div>
                <div class="progress-text">{{ getCurrentProgress(achievement) }}/{{ getTargetProgress(achievement) }}</div>
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
  name: 'Achievement',
  
  data() {
    return {
      achievements: [
        {
          id: 'first_game',
          title: '初次尝试',
          description: '完成第一场游戏',
          icon: '🎮',
          condition: { type: 'games', target: 1 }
        },
        {
          id: 'ten_games',
          title: '游戏达人',
          description: '完成10场游戏',
          icon: '🎯',
          condition: { type: 'games', target: 10 }
        },
        {
          id: 'hundred_games',
          title: '游戏大师',
          description: '完成100场游戏',
          icon: '🏆',
          condition: { type: 'games', target: 100 }
        },
        {
          id: 'first_streak',
          title: '连续学习',
          description: '连续3天完成游戏',
          icon: '🔥',
          condition: { type: 'streak', target: 3 }
        },
        {
          id: 'week_streak',
          title: '坚持一周',
          description: '连续7天完成游戏',
          icon: '⭐',
          condition: { type: 'streak', target: 7 }
        },
        {
          id: 'month_streak',
          title: '月度达人',
          description: '连续30天完成游戏',
          icon: '🌟',
          condition: { type: 'streak', target: 30 }
        },
        {
          id: 'accuracy_80',
          title: '精准射手',
          description: '正确率达到80%',
          icon: '🎯',
          condition: { type: 'accuracy', target: 80 }
        },
        {
          id: 'accuracy_90',
          title: '完美主义',
          description: '正确率达到90%',
          icon: '💎',
          condition: { type: 'accuracy', target: 90 }
        },
        {
          id: 'score_1000',
          title: '得分能手',
          description: '累计得分达到1000分',
          icon: '💰',
          condition: { type: 'score', target: 1000 }
        },
        {
          id: 'score_5000',
          title: '得分大师',
          description: '累计得分达到5000分',
          icon: '👑',
          condition: { type: 'score', target: 5000 }
        }
      ],
      userData: null
    }
  },
  
  computed: {
    totalAchievements() {
      return this.achievements.length
    },
    
    unlockedAchievements() {
      return this.achievements.filter(achievement => this.isUnlocked(achievement))
    },
    
    lockedAchievements() {
      return this.achievements.filter(achievement => !this.isUnlocked(achievement))
    }
  },
  
  created() {
    this.loadUserData()
  },
  
  methods: {
    loadUserData() {
      this.userData = StorageManager.getCurrentUser()
    },
    
    isUnlocked(achievement) {
      const userAchievements = this.userData?.achievements || []
      return userAchievements.includes(achievement.id)
    },
    
    getProgress(achievement) {
      const current = this.getCurrentProgress(achievement)
      const target = this.getTargetProgress(achievement)
      return Math.min((current / target) * 100, 100)
    },
    
    getCurrentProgress(achievement) {
      const stats = this.userData?.stats || {}
      
      switch (achievement.condition.type) {
        case 'games':
          return stats.totalGames || 0
        case 'streak':
          return stats.currentStreak || 0
        case 'accuracy':
          const totalQuestions = stats.totalQuestions || 0
          const correctCount = stats.totalCorrect || 0
          return totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
        case 'score':
          return stats.totalScore || 0
        default:
          return 0
      }
    },
    
    getTargetProgress(achievement) {
      return achievement.condition.target
    },
    
    formatDate(timestamp) {
      if (!timestamp) return '未知'
      return new Date(timestamp).toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.achievement-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.achievement-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.achievement-header h2 {
  font-size: 1.5rem;
  color: #667eea;
  margin: 0 0 15px 0;
}

.achievement-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  min-width: 80px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.achievement-section {
  margin-bottom: 30px;
}

.achievement-section h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.achievement-card {
  display: flex;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.achievement-card.locked {
  background: rgba(200, 200, 200, 0.1);
  border: 1px solid rgba(200, 200, 200, 0.2);
  opacity: 0.7;
}

.achievement-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.achievement-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 50%;
}

.achievement-info {
  flex: 1;
}

.achievement-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.achievement-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.3;
}

.achievement-date {
  font-size: 0.8rem;
  color: #999;
}

.achievement-progress {
  margin-top: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(200, 200, 200, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
}

@media (max-width: 768px) {
  .achievement-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1;
    min-width: 60px;
  }
  
  .achievement-icon {
    font-size: 2rem;
    width: 50px;
    height: 50px;
  }
}
</style>