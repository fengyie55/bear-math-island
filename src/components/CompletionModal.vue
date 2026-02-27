<template>
  <div class="completion-modal" v-if="show">
    <div class="modal-content animate">
      <div class="completion-icon spin">🏆</div>
      <div class="completion-title">恭喜完成练习！</div>
      <div class="completion-message">
        <div class="score-info pulse">得分：{{ finalScore }}分</div>
        <div class="accuracy-info">正确率：{{ Math.round((correctAnswers / totalQuestions) * 100) }}%</div>
      </div>
      <div class="completion-actions">
        <button class="continue-button pulse" @click="continuePractice">
          🔄 继续练习
        </button>
        <button class="back-button" @click="backToMenu">
          ← 返回菜单
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompletionModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    finalScore: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 5
    }
  },
  emits: ['continue-practice', 'back-to-menu'],
  setup(props, { emit }) {
    const continuePractice = () => {
      emit('continue-practice')
    }

    const backToMenu = () => {
      emit('back-to-menu')
    }

    return {
      continuePractice,
      backToMenu
    }
  }
}
</script>

<style scoped>
.completion-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: modalSlideIn 0.3s ease;
}

.completion-modal .modal-content {
  background: linear-gradient(135deg, #a8e6cf, #dcedc1);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  animation: modalSlideIn 0.3s ease;
}

.completion-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  animation: bounce 1s infinite;
}

.completion-icon.spin {
  animation: spin 1s ease-in-out;
}

.completion-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.completion-message {
  margin: 20px 0;
  font-size: 1.2rem;
  color: #333;
  line-height: 1.6;
}

.score-info {
  margin-bottom: 10px;
}

.accuracy-info {
  font-weight: bold;
}

.score-info.pulse {
  animation: pulse 1s ease-in-out;
}

.completion-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}

.continue-button {
  background: linear-gradient(45deg, #FF6B6B, #FF8E53);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.continue-button:hover {
  transform: scale(1.05);
}

.continue-button.pulse {
  animation: pulse 1s ease-in-out;
}

.back-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.back-button:hover {
  transform: scale(1.05);
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

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>