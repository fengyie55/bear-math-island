<template>
  <div class="main-screen">
    <div class="game-header">
      <div class="game-title">小熊的海岛大冒险 🏝️</div>
      <div class="game-subtitle">帮小熊收集魔法星星，修复海岛！✨</div>
    </div>

    <!-- 模式选择 -->
    <div class="mode-selection">
      <div class="mode-card" @click="selectMode('adventure')">
        <div class="mode-icon">🏝️</div>
        <div class="mode-title">冒险模式</div>
        <div class="mode-description">适合3-4岁小朋友<br/>解锁海岛地图，边玩边学</div>
      </div>
      
      <div class="mode-card" @click="selectMode('practice')">
        <div class="mode-icon">📚</div>
        <div class="mode-title">练习模式</div>
        <div class="mode-description">适合4-6岁小朋友<br/>直接答题，快速提升</div>
      </div>
    </div>

    <div class="player-info">
      <div class="player-stats">
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{{ totalScore }}</span>
          <span class="stat-label">魔法星星</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🏆</span>
          <span class="stat-value">{{ completedAreas }}</span>
          <span class="stat-label">已解锁区域</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⏱️</span>
          <span class="stat-value">{{ remainingTime }}</span>
          <span class="stat-label">今日剩余</span>
        </div>
      </div>
    </div>

    <div class="settings-button" @click="showSettings = true">
      ⚙️ 设置
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MainScreen',
  props: {
    totalScore: {
      type: Number,
      default: 0
    },
    completedAreas: {
      type: Number,
      default: 0
    },
    remainingTime: {
      type: String,
      default: '0:00'
    }
  },
  emits: ['select-mode', 'show-settings'],
  setup(props, { emit }) {
    const selectMode = (mode) => {
      emit('select-mode', mode)
    }

    return {
      selectMode
    }
  }
}
</script>

<style scoped>
.main-screen {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mode-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
}

.mode-card {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
}

.mode-card:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-5px);
  border-color: rgba(255,255,255,0.3);
}

.mode-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.mode-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.mode-description {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
  margin-bottom: 15px;
}

.game-header {
  margin-bottom: 40px;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.game-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.player-info {
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.player-stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.settings-button {
  background: rgba(255,255,255,0.1);
  padding: 15px 25px;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.settings-button:hover {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }
  
  .mode-selection {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .player-stats {
    flex-direction: column;
    gap: 15px;
  }
}
</style>