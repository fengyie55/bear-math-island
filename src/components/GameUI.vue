<template>
  <div class="game-ui-container">
    <!-- 模式选择界面 -->
    <MainScreen 
      v-if="currentScreen === 'main'" 
      :totalScore="totalScore"
      :completedAreas="completedAreas"
      :remainingTime="remainingTime"
      @select-mode="selectMode"
      @show-settings="showSettings = true"
    />

    <!-- 冒险模式界面 -->
    <AdventureScreen 
      v-if="currentScreen === 'adventure'" 
      :islandMap="islandMap"
      @back-to-main="currentScreen = 'main'"
      @start-level="startLevel"
    />

    <!-- 练习模式界面 -->
    <PracticeScreen 
      v-if="currentScreen === 'practice'" 
      @back-to-main="currentScreen = 'main'"
      @select-practice-level="selectPracticeLevel"
    />

    <!-- 游戏界面 -->
    <GameScreen 
      v-if="currentScreen === 'game'" 
      :currentQuestion="currentQuestion"
      :currentQuestionIndex="currentQuestionIndex"
      :currentScore="currentScore"
      :totalQuestionsPerLevel="totalQuestionsPerLevel"
      :selectedOption="selectedOption"
      :selectedItems="selectedItems"
      :voiceEnabled="voiceEnabled"
      @back-to-mode="backToMode"
      @select-answer="selectAnswer"
      @select-item="selectItem"
      @play-voice="playQuestionVoice"
    />

    <!-- 反馈弹窗 -->
    <FeedbackModal 
      :show="showFeedback"
      :isCorrect="isCorrect"
      :feedbackText="feedbackText"
      @next-question="nextQuestion"
    />

    <!-- 练习完成界面 -->
    <CompletionModal 
      :show="showCompletion"
      :finalScore="finalScore"
      :correctAnswers="correctAnswers"
      :totalQuestions="totalQuestionsPerLevel"
      @continue-practice="continuePractice"
      @back-to-menu="backToPractice"
    />

    <!-- 设置弹窗 -->
    <SettingsModal 
      :show="showSettings"
      :settings="settings"
      @close="showSettings = false"
      @save-settings="saveSettings"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import MainScreen from './MainScreen.vue'
import AdventureScreen from './AdventureScreen.vue'
import PracticeScreen from './PracticeScreen.vue'
import GameScreen from './GameScreen.vue'
import FeedbackModal from './FeedbackModal.vue'
import CompletionModal from './CompletionModal.vue'
import SettingsModal from './SettingsModal.vue'
import { useGameStore } from '../stores/gameStore.ts'
import { useSettingsStore } from '../stores/settingsStore.ts'

export default {
  name: 'GameUI',
  components: {
    MainScreen,
    AdventureScreen,
    PracticeScreen,
    GameScreen,
    FeedbackModal,
    CompletionModal,
    SettingsModal
  },
  setup() {
    const gameStore = useGameStore()
    const settingsStore = useSettingsStore()

    // 加载设置
    settingsStore.loadSettings()

    // 方法
    const selectMode = (mode) => {
      gameStore.selectMode(mode)
    }

    const backToMode = () => {
      gameStore.backToMode()
    }

    const startLevel = (areaId) => {
      gameStore.startLevel(areaId)
    }

    const selectPracticeLevel = (level) => {
      gameStore.selectPracticeLevel(level)
    }

    const selectItem = (item) => {
      gameStore.selectItem(item)
    }

    const selectAnswer = (option) => {
      gameStore.selectAnswer(option)
      playSound('click')
      
      if (gameStore.isCorrect) {
        playSound('correct')
      } else {
        playSound('wrong')
      }
    }

    const nextQuestion = () => {
      gameStore.nextQuestion()
      if (gameStore.currentQuestionIndex === gameStore.totalQuestionsPerLevel) {
        playSound('completion')
      }
    }

    const playQuestionVoice = () => {
      if (settingsStore.voiceEnabled && gameStore.currentQuestion.text) {
        const utterance = new SpeechSynthesisUtterance(gameStore.currentQuestion.text)
        utterance.lang = 'zh-CN'
        utterance.pitch = 1.2
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    }

    const playSound = (type) => {
      if (!settingsStore.soundEnabled) return
      
      // 这里使用Web Audio API创建简单的音效
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      switch (type) {
        case 'correct':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1) // A5
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
          break
        case 'wrong':
          oscillator.type = 'sawtooth'
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
          oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.3) // A3
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.5)
          break
        case 'click':
          oscillator.type = 'square'
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
          break
        case 'completion':
          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
          oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.2) // E5
          oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.4) // G5
          oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioContext.currentTime + 0.6) // C6
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 1)
          break
      }
    }

    const saveSettings = (newSettings) => {
      settingsStore.saveSettings(newSettings)
      gameStore.showSettings = false
    }

    const continuePractice = () => {
      gameStore.continuePractice()
    }

    const backToPractice = () => {
      gameStore.backToPractice()
    }

    return {
      // 游戏状态
      currentScreen: computed(() => gameStore.currentScreen),
      selectedMode: computed(() => gameStore.selectedMode),
      currentLevel: computed(() => gameStore.currentLevel),
      currentArea: computed(() => gameStore.currentArea),
      currentQuestion: computed(() => gameStore.currentQuestion),
      currentQuestionIndex: computed(() => gameStore.currentQuestionIndex),
      currentScore: computed(() => gameStore.currentScore),
      selectedOption: computed(() => gameStore.selectedOption),
      selectedItems: computed(() => gameStore.selectedItems),
      showFeedback: computed(() => gameStore.showFeedback),
      isCorrect: computed(() => gameStore.isCorrect),
      feedbackText: computed(() => gameStore.feedbackText),
      finalScore: computed(() => gameStore.finalScore),
      correctAnswers: computed(() => gameStore.correctAnswers),
      wrongAnswers: computed(() => gameStore.wrongAnswers),
      totalQuestionsPerLevel: computed(() => gameStore.totalQuestionsPerLevel),
      totalScore: computed(() => gameStore.totalScore),
      totalQuestions: computed(() => gameStore.totalQuestions),
      bestScore: computed(() => gameStore.bestScore),
      showSettings: computed(() => gameStore.showSettings),
      showCompletion: computed(() => gameStore.showCompletion),
      islandMap: computed(() => gameStore.islandMap),
      
      // 设置状态
      voiceEnabled: computed(() => settingsStore.voiceEnabled),
      soundEnabled: computed(() => settingsStore.soundEnabled),
      eyeProtectionEnabled: computed(() => settingsStore.eyeProtectionEnabled),
      dailyDurationLimit: computed(() => settingsStore.dailyDurationLimit),
      dailyPlayTime: computed(() => settingsStore.dailyPlayTime),
      
      // 计算属性
      completedAreas: computed(() => gameStore.completedAreas),
      remainingTime: computed(() => settingsStore.remainingTime),
      settings: computed(() => ({
        dailyDurationLimit: settingsStore.dailyDurationLimit,
        voiceEnabled: settingsStore.voiceEnabled,
        soundEnabled: settingsStore.soundEnabled,
        eyeProtectionEnabled: settingsStore.eyeProtectionEnabled
      })),
      
      // 方法
      selectMode,
      startLevel,
      selectPracticeLevel,
      selectItem,
      selectAnswer,
      nextQuestion,
      playQuestionVoice,
      saveSettings,
      continuePractice,
      backToPractice,
      backToMode
    }
  }
}
</script>

<style scoped>
.game-ui-container {
  height: 100%;
  min-height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 10px;
  color: white;
  overflow: hidden;
}

.main-screen {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mode-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  flex: 1;
}

.mode-card {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 200px;
}

.mode-card:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-5px);
  border-color: rgba(255,255,255,0.3);
}

.mode-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.mode-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.mode-description {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
  margin-bottom: 15px;
}

.mode-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.mode-content-title {
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

.adventure-content, .practice-content {
  margin-bottom: 40px;
}

.practice-level-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.practice-level {
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.practice-level:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-5px);
}

.practice-level-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.practice-level-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.practice-level-difficulty {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.1);
  padding: 5px 15px;
  border-radius: 15px;
  display: inline-block;
}

.game-header {
  margin-bottom: 40px;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.game-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
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

.player-info {
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.player-stats {
  display: flex;
  justify-content: space-around;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.settings-button {
  background: rgba(255,255,255,0.1);
  padding: 15px 25px;
  border-radius: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.settings-button:hover {
  background: rgba(255,255,255,0.2);
}

/* 冒险模式和练习模式界面样式 */
.adventure-screen, .practice-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.adventure-screen .mode-content-header,
.practice-screen .mode-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.adventure-screen .mode-content-title,
.practice-screen .mode-content-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.empty-space {
  width: 80px; /* 占位空间，使标题居中 */
}

/* 设置弹窗样式优化 */
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: modalFadeIn 0.3s ease;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

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

.area-indicator {
  font-weight: bold;
  font-size: 1rem;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.close-button {
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.6;
}

.close-button:hover {
  opacity: 1;
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

.completion-icon.spin {
  animation: spin 1s ease-in-out;
}

.score-info.pulse {
  animation: pulse 1s ease-in-out;
}

.continue-button.pulse {
  animation: pulse 1s ease-in-out;
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

.settings-content {
  text-align: left;
  margin: 20px 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.setting-label {
  font-weight: bold;
  flex: 1;
}

.setting-value {
  flex: 1;
  text-align: right;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.save-button {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }
  
  .mode-selection {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .practice-level-selection {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .island-map {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .player-stats {
    flex-direction: column;
    gap: 15px;
  }
  
  .question-text {
    font-size: 1.2rem;
  }
  
  .answer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
</style>
