<template>
  <div class="feedback-modal" v-if="show">
    <div class="modal-content" :class="{ 'correct': isCorrect, 'wrong': !isCorrect, 'animate': show }">
      <div class="feedback-icon" :class="{ 'bounce': isCorrect }">{{ isCorrect ? '🎉' : '😊' }}</div>
      <div class="feedback-title">{{ isCorrect ? '太棒了！' : '再试一次' }}</div>
      <div class="feedback-text">{{ feedbackText }}</div>
      <button class="next-button" @click="nextQuestion" :class="{ 'pulse': isCorrect }">
        {{ isCorrect ? '下一题' : '再想想' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isCorrect: {
      type: Boolean,
      default: false
    },
    feedbackText: {
      type: String,
      default: ''
    }
  },
  emits: ['next-question'],
  setup(props, { emit }) {
    const nextQuestion = () => {
      emit('next-question')
    }

    return {
      nextQuestion
    }
  }
}
</script>

<style scoped>
.feedback-modal {
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
}

.modal-content {
  background: white;
  color: #333;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

.modal-content.correct {
  background: linear-gradient(135deg, #a8e6cf, #dcedc1);
}

.modal-content.wrong {
  background: linear-gradient(135deg, #ffd3b6, #ffaaa5);
}

.feedback-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.feedback-icon.bounce {
  animation: bounce 1s ease-in-out;
}

.next-button.pulse {
  animation: pulse 1s ease-in-out;
}

.modal-content.animate {
  animation: modalSlideIn 0.5s ease-out;
}

.feedback-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.feedback-text {
  font-size: 1.2rem;
  margin-bottom: 25px;
  line-height: 1.4;
}

.next-button {
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

.next-button:hover {
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
</style>