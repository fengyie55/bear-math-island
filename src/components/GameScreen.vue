<template>
  <div class="game-screen">
    <div class="game-status">
      <div class="status-left">
        <button class="back-button" @click="backToMode">← 返回模式选择</button>
      </div>
      <div class="status-center">
        <div class="question-progress">
          {{ currentQuestionIndex }}/{{ totalQuestionsPerLevel }}
        </div>
      </div>
      <div class="status-right">
        <div class="stars-count">
          {{ currentScore }} ⭐
        </div>
      </div>
    </div>

    <div class="question-container">
      <div class="question-text">
        {{ currentQuestion.text }}
      </div>
      
      <div class="question-visual">
        <div class="question-items">
          <div 
            v-for="(item, index) in currentQuestion.items" 
            :key="index"
            class="question-item"
            @click="selectItem(item)"
            :class="{ 'selected': selectedItems.includes(item) }"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="answer-area">
        <div class="answer-grid">
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="answer-option"
            @click="selectAnswer(option)"
            :class="{ 'selected': selectedOption === index }"
          >
            {{ option }}
          </div>
        </div>
      </div>

      <div class="voice-button" @click="playQuestionVoice">
        🔊 听一听
      </div>
    </div>

    <div class="question-progress-bar">
      <div class="progress-container">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'GameScreen',
  props: {
    currentQuestion: {
      type: Object,
      default: () => ({
        text: '',
        items: [],
        answer: 0,
        options: []
      })
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    currentScore: {
      type: Number,
      default: 0
    },
    totalQuestionsPerLevel: {
      type: Number,
      default: 5
    },
    selectedOption: {
      type: Number,
      default: null
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    voiceEnabled: {
      type: Boolean,
      default: true
    }
  },
  emits: ['back-to-mode', 'select-answer', 'select-item', 'play-voice'],
  setup(props, { emit }) {
    const progressPercentage = computed(() => {
      return Math.round((props.currentQuestionIndex / props.totalQuestionsPerLevel) * 100)
    })

    const backToMode = () => {
      emit('back-to-mode')
    }

    const selectItem = (item) => {
      emit('select-item', item)
    }

    const selectAnswer = (option) => {
      emit('select-answer', option)
    }

    const playQuestionVoice = () => {
      emit('play-voice')
    }

    return {
      progressPercentage,
      backToMode,
      selectItem,
      selectAnswer,
      playQuestionVoice
    }
  }
}
</script>

<style scoped>
.game-screen {
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.game-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.1);
  padding: 10px 15px;
  border-radius: 12px;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.status-left {
  flex: 1;
}

.status-center {
  flex: 1;
  text-align: center;
}

.status-right {
  flex: 1;
  text-align: right;
}

.question-progress {
  font-size: 1rem;
  font-weight: bold;
}

.stars-count {
  font-size: 1rem;
  font-weight: bold;
}

.question-container {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin-bottom: 15px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.question-text {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.4;
  word-wrap: break-word;
}

.question-visual {
  margin-bottom: 20px;
}

.question-items {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 80px;
}

.question-item {
  font-size: 2.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.question-item:hover {
  transform: scale(1.2);
}

.question-item.selected {
  transform: scale(1.2);
  color: #FFD700;
}

.answer-area {
  margin-bottom: 15px;
}

.answer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  max-width: 300px;
  margin: 0 auto;
}

.answer-option {
  background: rgba(255,255,255,0.2);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.answer-option:hover {
  background: rgba(255,255,255,0.3);
  transform: scale(1.05);
}

.answer-option.selected {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
  transform: scale(1.1);
}

.voice-button {
  background: rgba(255,255,255,0.1);
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  text-align: center;
  margin: 15px 0;
  transition: background 0.3s ease;
}

.voice-button:hover {
  background: rgba(255,255,255,0.2);
}

.question-progress-bar {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 8px;
  flex-shrink: 0;
}

.progress-container {
  width: 100%;
  height: 10px;
  background: rgba(255,255,255,0.3);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.back-button {
  background: rgba(255,255,255,0.1);
  padding: 8px 16px;
  border: none;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .game-screen {
    padding: 0 10px;
  }
  
  .game-status {
    padding: 8px 12px;
    margin-bottom: 10px;
  }
  
  .question-container {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .question-text {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
  
  .question-item {
    font-size: 2rem;
  }
  
  .answer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 100%;
    padding: 0 10px;
  }
  
  .answer-option {
    padding: 12px;
    font-size: 1.2rem;
  }
  
  .voice-button {
    padding: 8px 16px;
    margin: 10px 0;
  }
  
  .question-progress-bar {
    padding: 6px;
  }
  
  .back-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  .question-progress {
    font-size: 0.9rem;
  }
  
  .stars-count {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .question-text {
    font-size: 1rem;
  }
  
  .question-item {
    font-size: 1.8rem;
  }
  
  .answer-option {
    padding: 10px;
    font-size: 1.1rem;
  }
  
  .game-status {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .status-left,
  .status-center,
  .status-right {
    flex: none;
  }
  
  .back-button {
    width: 100%;
    margin-bottom: 5px;
  }
}
</style>