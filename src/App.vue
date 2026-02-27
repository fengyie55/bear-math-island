<template>
  <div id="app">
    <!-- 用户登录界面 -->
    <UserLogin v-if="!currentUser" @login-success="handleLoginSuccess" />
    
    <!-- 主应用界面 -->
    <div v-else class="main-app">
      <!-- 用户信息栏 -->
      <div class="user-header">
        <div class="user-info">
          <span class="user-avatar">{{ currentUser.avatar }}</span>
          <span class="user-name">{{ currentUser.username }}</span>
          <span class="user-stats">
            连胜: {{ currentUser.stats?.currentStreak || 0 }} 
            | 游戏: {{ currentUser.stats?.totalGames || 0 }}
          </span>
        </div>
        <div class="header-actions">
          <button class="btn-profile" @click="toggleProfile">
            {{ showProfile ? '游戏' : '个人信息' }}
          </button>
          <button class="btn-monitor" @click="toggleMonitor">
            {{ showMonitor ? '游戏' : '家长监控' }}
          </button>
          <button class="btn-leaderboard" @click="toggleLeaderboard">
            {{ showLeaderboard ? '游戏' : '排行榜' }}
          </button>
          <button class="btn-achievement" @click="toggleAchievement">
            {{ showAchievement ? '游戏' : '成就' }}
          </button>
          <button class="btn-logout" @click="handleLogout">
            退出
          </button>
        </div>
      </div>
      
      <!-- 内容区域 -->
      <div class="content">
        <!-- 个人信息页面 -->
        <div v-if="showProfile" class="profile-content">
          <UserProfile 
            :user="currentUser" 
            @logout="handleLogout"
          />
        </div>
        
        <!-- 家长监控页面 -->
        <div v-else-if="showMonitor" class="monitor-content">
          <ParentMonitor 
            :currentUser="currentUser" 
            @reset-data="resetData"
          />
        </div>
        
        <!-- 排行榜页面 -->
        <div v-else-if="showLeaderboard" class="leaderboard-content">
          <Leaderboard />
        </div>
        
        <!-- 成就页面 -->
        <div v-else-if="showAchievement" class="achievement-content">
          <Achievement />
        </div>
        
        <!-- 游戏界面 -->
        <div v-else class="game-content">
          <GameUI />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameUI from './components/GameUI.vue'
import UserLogin from './components/UserLogin.vue'
import UserProfile from './components/UserProfile.vue'
import ParentMonitor from './components/ParentMonitor.vue'
import Leaderboard from './components/Leaderboard.vue'
import Achievement from './components/Achievement.vue'
import StorageManager from './utils/storage'

export default {
  name: 'App',
  
  components: {
    GameUI,
    UserLogin,
    UserProfile,
    ParentMonitor,
    Leaderboard,
    Achievement
  },
  
  data() {
    return {
      currentUser: null,
      showProfile: false,
      showMonitor: false,
      showLeaderboard: false,
      showAchievement: false
    }
  },
  
  created() {
    // 检查是否有已登录的用户
    this.checkLoginStatus()
  },
  
  methods: {
    checkLoginStatus() {
      const user = StorageManager.getCurrentUser()
      if (user) {
        this.currentUser = user
        console.log('用户已登录:', user.username)
      }
    },
    
    handleLoginSuccess(user) {
      this.currentUser = user
      console.log('登录成功:', user.username)
    },
    
    handleLogout() {
      StorageManager.clearCurrentUser()
      this.currentUser = null
      this.showProfile = false
      this.showMonitor = false
      this.showLeaderboard = false
      this.showAchievement = false
      console.log('用户已退出')
    },
    
    toggleProfile() {
      this.showProfile = !this.showProfile
      this.showMonitor = false
      this.showLeaderboard = false
      this.showAchievement = false
    },
    
    toggleMonitor() {
      this.showMonitor = !this.showMonitor
      this.showProfile = false
      this.showLeaderboard = false
      this.showAchievement = false
    },
    
    toggleLeaderboard() {
      this.showLeaderboard = !this.showLeaderboard
      this.showProfile = false
      this.showMonitor = false
      this.showAchievement = false
    },
    
    toggleAchievement() {
      this.showAchievement = !this.showAchievement
      this.showProfile = false
      this.showMonitor = false
      this.showLeaderboard = false
    },
    
    resetData() {
      // 重置用户数据
      this.currentUser = {
        ...this.currentUser,
        stats: {
          totalGames: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          totalIncorrect: 0,
          currentStreak: 0,
          bestStreak: 0,
          averageScore: 0,
          totalStudyTime: 0,
          achievements: 0
        },
        gameHistory: [],
        achievements: []
      }
      
      StorageManager.updateUser(this.currentUser.id, {
        stats: this.currentUser.stats,
        gameHistory: [],
        achievements: []
      })
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  width: 100%;
  height: 100vh;
}

.main-app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 用户信息栏 */
.user-header {
  background: white;
  padding: 10px 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  flex-shrink: 0;
  height: 60px;
}

.user-info {
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
  font-size: 0.95rem;
  color: #333;
  white-space: nowrap;
}

.user-stats {
  font-size: 0.8rem;
  color: #666;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.btn-profile,
.btn-monitor,
.btn-leaderboard,
.btn-achievement,
.btn-logout {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-profile:hover,
.btn-monitor:hover,
.btn-leaderboard:hover,
.btn-achievement:hover,
.btn-logout:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.btn-monitor {
  color: #52c41a;
  border-color: #52c41a;
}

.btn-monitor:hover {
  background: #f6ffed;
}

.btn-leaderboard {
  color: #faad14;
  border-color: #faad14;
}

.btn-leaderboard:hover {
  background: #fffbe6;
}

.btn-achievement {
  color: #1890ff;
  border-color: #1890ff;
}

.btn-achievement:hover {
  background: #e6f7ff;
}

.btn-logout {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-logout:hover {
  background: #fff1f0;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  position: relative;
  padding: 0 15px 15px;
}

.profile-content,
.monitor-content,
.leaderboard-content,
.achievement-content,
.game-content {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 动画类 */
@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 响应式基础样式 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  .user-header {
    padding: 10px 15px;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
    gap: 5px;
  }
  
  .user-stats {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px;
  }
  
  .btn-profile,
  .btn-logout {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
