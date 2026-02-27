<template>
  <div class="adventure-screen">
    <div class="mode-content-header">
      <div class="back-button" @click="backToMain">← 返回首页</div>
      <div class="mode-content-title">🏝️ 冒险模式</div>
      <div class="empty-space"></div>
    </div>

    <div class="island-map">
      <div class="island-area" v-for="(area, index) in islandMap.areas" :key="area.id">
        <div class="area-icon" :class="{ 'unlocked': area.unlocked, 'locked': !area.unlocked }">
          {{ getAreaIcon(area.id) }}
        </div>
        <div class="area-name">{{ area.name }}</div>
        <div class="area-progress" v-if="area.unlocked">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: area.completed ? '100%' : '0%' }"></div>
          </div>
        </div>
        <div class="start-button" v-if="area.unlocked" @click="startLevel(area.id)">
          开始探索 🔍
        </div>
        <div class="locked-text" v-else>
          🔒 待解锁
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdventureScreen',
  props: {
    islandMap: {
      type: Object,
      default: () => ({
        areas: [
          { id: 'orchard', name: '🍎 苹果园', unlocked: true, completed: false },
          { id: 'beach', name: '🏖️ 沙滩', unlocked: false, completed: false },
          { id: 'park', name: '🎢 游乐园', unlocked: false, completed: false },
          { id: 'treehouse', name: '🌲 树屋', unlocked: false, completed: false },
          { id: 'cave', name: '🔮 魔法山洞', unlocked: false, completed: false }
        ]
      })
    }
  },
  emits: ['back-to-main', 'start-level'],
  setup(props, { emit }) {
    const backToMain = () => {
      emit('back-to-main')
    }

    const getAreaIcon = (areaId) => {
      const icons = {
        orchard: '🍎',
        beach: '🏖️',
        park: '🎢',
        treehouse: '🌲',
        cave: '🔮'
      }
      return icons[areaId] || '📦'
    }

    const startLevel = (areaId) => {
      emit('start-level', areaId)
    }

    return {
      backToMain,
      getAreaIcon,
      startLevel
    }
  }
}
</script>

<style scoped>
.adventure-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.adventure-screen .mode-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.adventure-screen .mode-content-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.back-button {
  background: rgba(255,255,255,0.1);
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-button:hover {
  background: rgba(255,255,255,0.2);
}

.empty-space {
  width: 80px; /* 占位空间，使标题居中 */
}

.island-map {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.island-area {
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.island-area:hover {
  transform: translateY(-10px);
}

.area-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  transition: transform 0.3s ease;
}

.area-icon.unlocked {
  animation: bounce 2s infinite;
}

.area-icon.locked {
  opacity: 0.5;
  transform: scale(0.8);
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.area-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.area-progress {
  margin: 15px 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.start-button {
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  margin: 15px 0;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.start-button:hover {
  transform: scale(1.05);
}

.locked-text {
  opacity: 0.6;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .island-map {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
</style>