<template>
  <div class="adventure-screen">
    <div class="header">
      <button class="back-button" @click="goBack">← 返回</button>
      <h1>冒险模式</h1>
    </div>
    
    <div class="map">
      <div class="map-grid">
        <div 
          v-for="island in game.adventureProgress.islands" 
          :key="island.id"
          class="level-node"
          :class="{ 'completed': island.completed, 'locked': !island.unlocked }"
          @click="startLevel(island.id)"
        >
          <div class="level-number">{{ island.id }}</div>
          <div class="level-name">{{ island.name }}</div>
          <div v-if="island.completed" class="completed-badge">
            <span v-for="star in 3" :key="star" class="star" :class="{ 'active': star <= island.stars }">★</span>
          </div>
          <div v-else-if="!island.unlocked" class="locked-badge">🔒</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()

const goBack = () => {
  game.setScreen('main')
}

const startLevel = (islandId) => {
  const island = game.adventureProgress.islands.find(island => island.id === islandId)
  if (island && island.unlocked) {
    game.startAdventureMode(islandId)
  }
}
</script>

<style scoped>
.adventure-screen {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  color: white;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.map {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 600px;
  width: 100%;
}

.level-node {
  background: white;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.level-node::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.8;
  z-index: 1;
}

.level-node * {
  position: relative;
  z-index: 2;
}

.level-node:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.level-node.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.level-node.locked:hover {
  transform: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.level-number {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.level-name {
  font-size: 1rem;
  color: white;
  margin-bottom: 10px;
}

.completed-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.star {
  font-size: 1rem;
  color: #ccc;
  transition: all 0.3s ease;
}

.star.active {
  color: #ffd700;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
}

.locked-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .map-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>