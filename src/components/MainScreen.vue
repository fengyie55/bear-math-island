<template>
  <div class="main-screen">
    <div class="header">
      <h1>小熊数学岛</h1>
      <p>欢迎来到数学冒险之旅！</p>
    </div>
    
    <div class="game-modes">
      <button class="mode-button adventure" @click="navigateToAdventure">
        <h2>冒险模式</h2>
        <p>探索数学世界，挑战关卡</p>
      </button>
      
      <button class="mode-button practice" @click="navigateToPractice">
        <h2>练习模式</h2>
        <p>针对性练习，提升技能</p>
      </button>
    </div>
    
    <div class="footer">
      <button class="settings-button" @click="toggleSettings">
        设置
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

const game = useGameStore()
const settings = useSettingsStore()

const navigateToAdventure = () => {
  game.setScreen('adventure')
}

const navigateToPractice = () => {
  game.setScreen('practice')
}

const toggleSettings = () => {
  settings.toggleSettings()
}
</script>

<style scoped>
.main-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.game-modes {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.mode-button {
  background: white;
  border: none;
  border-radius: 15px;
  padding: 30px;
  width: 250px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.mode-button:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.mode-button h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
}

.mode-button p {
  font-size: 1rem;
  color: #666;
}

.mode-button.adventure {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.mode-button.adventure h2 {
  color: white;
}

.mode-button.adventure p {
  color: rgba(255, 255, 255, 0.8);
}

.mode-button.practice {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.mode-button.practice h2 {
  color: white;
}

.mode-button.practice p {
  color: rgba(255, 255, 255, 0.8);
}

.footer {
  margin-top: auto;
}

.settings-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .game-modes {
    flex-direction: column;
    align-items: center;
  }
  
  .mode-button {
    width: 200px;
    padding: 20px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
}
</style>