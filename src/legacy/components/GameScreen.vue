<template>
  <div class="game-screen">
    <div class="header">
      <button class="back-button" @click="goBack">← 返回</button>
      <h1>{{ game.currentMode === 'adventure' ? '冒险模式' : '练习模式' }}</h1>
      <div class="score">分数: {{ game.score }}</div>
    </div>
    
    <div class="game-content">
      <div class="question-container">
        <h2 class="question-number">第 {{ game.totalQuestions + 1 }} 题</h2>
        <div class="question">{{ game.currentQuestion?.question }}</div>
        <div class="visual-aid" v-if="game.currentQuestion?.visualAid">
          <img :src="game.currentQuestion.visualAid" alt="视觉辅助">
        </div>
        <div class="input-container">
          <input 
            type="number" 
            v-model="game.userAnswer" 
            @keyup.enter="submitAnswer"
            placeholder="请输入答案"
            class="answer-input"
            ref="answerInput"
          >
          <button class="submit-button" @click="submitAnswer">提交</button>
        </div>
      </div>
      
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '../stores/settingsStore'

const game = useGameStore()
const settings = useSettingsStore()
const answerInput = ref(null)

// 计算进度百分比
const progressPercentage = computed(() => {
  return game.totalQuestions > 0 ? (game.totalQuestions / 10) * 100 : 0
})

// 语音提示
const speakQuestion = () => {
  if (settings.voiceEnabled && game.currentQuestion) {
    const speech = new SpeechSynthesisUtterance(game.currentQuestion.question)
    speech.lang = 'zh-CN'
    speech.rate = 1
    speechSynthesis.speak(speech)
  }
}

// 播放音效
const playSound = (type) => {
  if (settings.soundEnabled) {
    const audio = new Audio()
    switch (type) {
      case 'correct':
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD'
        break
      case 'incorrect':
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD'
        break
      case 'submit':
        audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD'
        break
    }
    audio.play().catch(e => console.log('Audio play failed:', e))
  }
}

// 提交答案
const submitAnswer = () => {
  if (!game.currentQuestion || !game.userAnswer) return
  
  playSound('submit')
  game.checkAnswer()
  
  // 记录答题情况到设置
  settings.recordAnswer(game.feedbackCorrect)
  
  // 播放相应音效
  playSound(game.feedbackCorrect ? 'correct' : 'incorrect')
}

// 返回
const goBack = () => {
  if (game.currentMode === 'adventure') {
    game.setScreen('adventure')
  } else {
    game.setScreen('practice')
  }
}

// 监听题目变化，播放语音提示
watch(() => game.currentQuestion, (newQuestion) => {
  if (newQuestion) {
    speakQuestion()
    // 聚焦到输入框
    setTimeout(() => {
      answerInput.value?.focus()
    }, 100)
  }
}, { deep: true })

// 组件挂载时
onMounted(() => {
  // 聚焦到输入框
  setTimeout(() => {
    answerInput.value?.focus()
  }, 100)
  
  // 播放语音提示
  speakQuestion()
  
  // 增加游戏次数
  settings.addGamePlayed()
})
</script>

<style scoped>
.game-screen {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header h1 {
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.question-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  text-align: center;
}

.question-number {
  color: #667eea;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.question {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333;
}

.visual-aid {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.visual-aid img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.input-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.answer-input {
  padding: 15px 20px;
  border: 2px solid #667eea;
  border-radius: 10px;
  font-size: 1.5rem;
  width: 200px;
  text-align: center;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 10px;
  margin-top: auto;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.2rem;
  }
  
  .question {
    font-size: 1.5rem;
  }
  
  .answer-input {
    width: 150px;
    font-size: 1.2rem;
  }
  
  .submit-button {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style>