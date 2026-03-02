<template>
  <div class="practice-screen">
    <div class="header">
      <button class="back-button" @click="goBack">← 返回</button>
      <h1>练习模式</h1>
    </div>
    
    <div class="practice-topics">
      <div 
        v-for="topic in topics" 
        :key="topic.id"
        class="topic-card"
        @click="selectTopic(topic.id)"
      >
        <div class="topic-icon">{{ topic.icon }}</div>
        <h2 class="topic-name">{{ topic.name }}</h2>
        <p class="topic-description">{{ topic.description }}</p>
        <div v-if="getTopicProgress(topic.id).completed" class="completed-badge">
          最佳分数: {{ getTopicProgress(topic.id).bestScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'

const game = useGameStore()

const topics = [
  { id: 'addition', name: '加法', icon: '+', description: '练习加法运算' },
  { id: 'subtraction', name: '减法', icon: '-', description: '练习减法运算' },
  { id: 'multiplication', name: '乘法', icon: '×', description: '练习乘法运算' },
  { id: 'division', name: '除法', icon: '÷', description: '练习除法运算' }
]

const goBack = () => {
  game.setScreen('main')
}

const selectTopic = (topicId) => {
  game.startPracticeMode(topicId, 1)
}

const getTopicProgress = (topicId) => {
  return game.practiceProgress[topicId] || { completed: false, bestScore: 0 }
}
</script>

<style scoped>
.practice-screen {
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

.practice-topics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
}

.topic-card {
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

.topic-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  opacity: 0.8;
  z-index: 1;
}

.topic-card * {
  position: relative;
  z-index: 2;
}

.topic-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.topic-icon {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
}

.topic-name {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
}

.topic-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.completed-badge {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 0.8rem;
  color: #f5576c;
  font-weight: bold;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .practice-topics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .topic-icon {
    font-size: 2.5rem;
  }
  
  .topic-name {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .practice-topics {
    grid-template-columns: 1fr;
  }
}
</style>