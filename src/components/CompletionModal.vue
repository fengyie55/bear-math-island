<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ game.currentMode === 'adventure' ? '冒险完成！' : '练习完成！' }}</h2>
      </div>
      <div class="modal-body">
        <div class="score-container">
          <div class="score-circle">
            <div class="score-number">{{ score }}</div>
            <div class="score-label">分数</div>
          </div>
        </div>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">正确率</span>
            <span class="stat-value">{{ accuracy }}%</span>
          </div>
        </div>
        <div class="message">
          <p>{{ message }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="back-button" @click="closeModal">返回主菜单</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const game = useGameStore()

const closeModal = () => {
  game.closeCompletion()
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
  text-align: center;
}

.modal-header h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #667eea;
}

.score-container {
  margin-bottom: 30px;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.score-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.score-label {
  font-size: 1rem;
  opacity: 0.9;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.stat-value.correct {
  color: #52c41a;
}

.message {
  margin-bottom: 30px;
}

.message p {
  font-size: 1.1rem;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.restart-button,
.back-button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.restart-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.back-button {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.restart-button:hover,
.back-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

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
</style>