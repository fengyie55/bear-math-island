<template>
  <div class="leaderboard-container">
    <div class="leaderboard-header">
      <h2>🏆 排行榜</h2>
      <div class="leaderboard-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-button"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div class="leaderboard-content">
      <!-- 总分排行榜 -->
      <div v-if="activeTab === 'totalScore'" class="leaderboard-section">
        <h3>🏅 总分排行榜</h3>
        <div class="leaderboard-list">
          <div 
            v-for="(user, index) in totalScoreLeaderboard" 
            :key="user.id"
            class="leaderboard-item"
            :class="{ 'current-user': user.id === currentUserId }"
          >
            <div class="rank">
              <span v-if="index < 3" class="medal">{{ getMedal(index) }}</span>
              <span v-else class="rank-number">{{ index + 1 }}</span>
            </div>
            <div class="user-info">
              <span class="user-avatar">{{ user.avatar }}</span>
              <span class="user-name">{{ user.username }}</span>
            </div>
            <div class="score">{{ user.stats.totalScore || 0 }}</div>
          </div>
        </div>
      </div>
      
      <!-- 正确率排行榜 -->
      <div v-if="activeTab === 'accuracy'" class="leaderboard-section">
        <h3>🎯 正确率排行榜</h3>
        <div class="leaderboard-list">
          <div 
            v-for="(user, index) in accuracyLeaderboard" 
            :key="user.id"
            class="leaderboard-item"
            :class="{ 'current-user': user.id === currentUserId }"
          >
            <div class="rank">
              <span v-if="index < 3" class="medal">{{ getMedal(index) }}</span>
              <span v-else class="rank-number">{{ index + 1 }}</span>
            </div>
            <div class="user-info">
              <span class="user-avatar">{{ user.avatar }}</span>
              <span class="user-name">{{ user.username }}</span>
            </div>
            <div class="score">{{ user.accuracy }}%</div>
          </div>
        </div>
      </div>
      
      <!-- 连胜排行榜 -->
      <div v-if="activeTab === 'streak'" class="leaderboard-section">
        <h3>🔥 连胜排行榜</h3>
        <div class="leaderboard-list">
          <div 
            v-for="(user, index) in streakLeaderboard" 
            :key="user.id"
            class="leaderboard-item"
            :class="{ 'current-user': user.id === currentUserId }"
          >
            <div class="rank">
              <span v-if="index < 3" class="medal">{{ getMedal(index) }}</span>
              <span v-else class="rank-number">{{ index + 1 }}</span>
            </div>
            <div class="user-info">
              <span class="user-avatar">{{ user.avatar }}</span>
              <span class="user-name">{{ user.username }}</span>
            </div>
            <div class="score">{{ user.stats.bestStreak || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StorageManager from '../utils/storage'

export default {
  name: 'Leaderboard',
  
  data() {
    return {
      activeTab: 'totalScore',
      tabs: [
        { label: '总分', value: 'totalScore' },
        { label: '正确率', value: 'accuracy' },
        { label: '连胜', value: 'streak' }
      ],
      allUsers: []
    }
  },
  
  computed: {
    currentUserId() {
      const currentUser = StorageManager.getCurrentUser()
      return currentUser ? currentUser.id : null
    },
    
    totalScoreLeaderboard() {
      return this.allUsers
        .sort((a, b) => (b.stats.totalScore || 0) - (a.stats.totalScore || 0))
        .slice(0, 10)
    },
    
    accuracyLeaderboard() {
      return this.allUsers
        .map(user => {
          const totalQuestions = user.stats.totalQuestions || 0
          const correctCount = user.stats.totalCorrect || 0
          const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
          return { ...user, accuracy }
        })
        .sort((a, b) => b.accuracy - a.accuracy)
        .slice(0, 10)
    },
    
    streakLeaderboard() {
      return this.allUsers
        .sort((a, b) => (b.stats.bestStreak || 0) - (a.stats.bestStreak || 0))
        .slice(0, 10)
    }
  },
  
  created() {
    this.loadAllUsers()
  },
  
  methods: {
    loadAllUsers() {
      this.allUsers = StorageManager.getAllUsers()
    },
    
    getMedal(index) {
      const medals = ['🥇', '🥈', '🥉']
      return medals[index] || ''
    }
  }
}
</script>

<style scoped>
.leaderboard-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.leaderboard-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.leaderboard-header h2 {
  font-size: 1.5rem;
  color: #667eea;
  margin: 0 0 15px 0;
}

.leaderboard-tabs {
  display: flex;
  gap: 10px;
}

.tab-button {
  padding: 8px 16px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.tab-button:hover {
  background: rgba(102, 126, 234, 0.1);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.leaderboard-section {
  margin-top: 20px;
}

.leaderboard-section h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
}

.leaderboard-item.current-user {
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.rank {
  width: 50px;
  text-align: center;
  font-weight: bold;
}

.medal {
  font-size: 1.5rem;
}

.rank-number {
  font-size: 1.2rem;
  color: #666;
}

.user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: white;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  min-width: 80px;
  text-align: right;
}

@media (max-width: 768px) {
  .leaderboard-item {
    padding: 12px;
  }
  
  .rank {
    width: 40px;
  }
  
  .medal {
    font-size: 1.2rem;
  }
  
  .rank-number {
    font-size: 1rem;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 1.1rem;
  }
  
  .score {
    font-size: 1rem;
    min-width: 60px;
  }
}
</style>