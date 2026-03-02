<template>
  <div class="modal">
    <div class="modal-content" :class="{ 'correct': correct, 'incorrect': !correct }">
      <div class="modal-header">
        <h2>{{ correct ? '回答正确！' : '回答错误' }}</h2>
      </div>
      <div class="modal-body">
        <div v-if="correct" class="correct-message">
          <div class="emoji">🎉</div>
          <p>{{ message }}</p>
        </div>
        <div v-else class="incorrect-message">
          <div class="emoji">😞</div>
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'

const props = defineProps({
  correct: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

const game = useGameStore()
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

.modal-content.correct {
  border: 4px solid #52c41a;
}

.modal-content.incorrect {
  border: 4px solid #ff4d4f;
}

.modal-header h2 {
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.modal-content.correct .modal-header h2 {
  color: #52c41a;
}

.modal-content.incorrect .modal-header h2 {
  color: #ff4d4f;
}

.modal-body {
  margin-bottom: 30px;
}

.emoji {
  font-size: 4rem;
  margin-bottom: 20px;
}

.correct-message p,
.incorrect-message p {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.correct-answer {
  font-weight: bold;
  color: #ff4d4f;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.next-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-button:hover {
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