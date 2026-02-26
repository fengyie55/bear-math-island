<template>
  <div class="game-ui-container">
    <!-- 模式选择界面 -->
    <div v-if="currentScreen === 'main'" class="main-screen">
      <div class="game-header">
        <div class="game-title">小熊的海岛大冒险 🏝️</div>
        <div class="game-subtitle">帮小熊收集魔法星星，修复海岛！✨</div>
      </div>

      <!-- 模式选择 -->
      <div class="mode-selection">
        <div class="mode-card" @click="selectMode('adventure')">
          <div class="mode-icon">🏝️</div>
          <div class="mode-title">冒险模式</div>
          <div class="mode-description">适合3-4岁小朋友<br/>解锁海岛地图，边玩边学</div>
        </div>
        
        <div class="mode-card" @click="selectMode('practice')">
          <div class="mode-icon">📚</div>
          <div class="mode-title">练习模式</div>
          <div class="mode-description">适合4-6岁小朋友<br/>直接答题，快速提升</div>
        </div>
      </div>

      <div class="player-info">
        <div class="player-stats">
          <div class="stat-item">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">{{ totalScore }}</span>
            <span class="stat-label">魔法星星</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🏆</span>
            <span class="stat-value">{{ completedAreas }}</span>
            <span class="stat-label">已解锁区域</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⏱️</span>
            <span class="stat-value">{{ remainingTime }}</span>
            <span class="stat-label">今日剩余</span>
          </div>
        </div>
      </div>

      <div class="settings-button" @click="showSettings = true">
        ⚙️ 设置
      </div>
    </div>

    <!-- 冒险模式界面 -->
    <div v-if="currentScreen === 'adventure'" class="adventure-screen">
      <div class="mode-content-header">
        <div class="back-button" @click="currentScreen = 'main'">← 返回首页</div>
        <div class="mode-content-title">🏝️ 冒险模式</div>
        <div class="empty-space"></div>
      </div>

      <div class="island-map">
        <div class="island-area" v-for="(area, index) in islandMap.areas" :key="area.id">
          <div class="area-icon" :class="{ 'unlocked': area.unlocked, 'locked': !area.unlocked }">
            {{ getAreaIcon(area.id) }}
          </div>
          <div class="area-name">{{ area.name }}</div>
          <div class="area-progress" v-if="area.unlocked">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: area.completed ? '100%' : '0%' }"></div>
            </div>
          </div>
          <div class="start-button" v-if="area.unlocked" @click="startLevel(area.id)">
            开始探索 🔍
          </div>
          <div class="locked-text" v-else>
            🔒 待解锁
          </div>
        </div>
      </div>
    </div>

    <!-- 练习模式界面 -->
    <div v-if="currentScreen === 'practice'" class="practice-screen">
      <div class="mode-content-header">
        <div class="back-button" @click="currentScreen = 'main'">← 返回首页</div>
        <div class="mode-content-title">📚 练习模式</div>
        <div class="empty-space"></div>
      </div>

      <div class="practice-level-selection">
        <div class="practice-level" @click="selectPracticeLevel('5以内加法')">
          <div class="practice-level-icon">🍎</div>
          <div class="practice-level-title">5以内加法</div>
          <div class="practice-level-difficulty">⭐ 简单</div>
        </div>
        
        <div class="practice-level" @click="selectPracticeLevel('5以内减法')">
          <div class="practice-level-icon">🍊</div>
          <div class="practice-level-title">5以内减法</div>
          <div class="practice-level-difficulty">⭐ 简单</div>
        </div>
        
        <div class="practice-level" @click="selectPracticeLevel('5以内混合运算')">
          <div class="practice-level-icon">🍓</div>
          <div class="practice-level-title">5以内混合运算</div>
          <div class="practice-level-difficulty">⭐⭐ 中等</div>
        </div>
        
        <div class="practice-level" @click="selectPracticeLevel('10以内加法')">
          <div class="practice-level-icon">🍇</div>
          <div class="practice-level-title">10以内加法</div>
          <div class="practice-level-difficulty">⭐⭐ 中等</div>
        </div>
        
        <div class="practice-level" @click="selectPracticeLevel('10以内减法')">
          <div class="practice-level-icon">🍒</div>
          <div class="practice-level-title">10以内减法</div>
          <div class="practice-level-difficulty">⭐⭐ 中等</div>
        </div>
        
        <div class="practice-level" @click="selectPracticeLevel('10以内混合运算')">
          <div class="practice-level-icon">🍉</div>
          <div class="practice-level-title">10以内混合运算</div>
          <div class="practice-level-difficulty">⭐⭐⭐ 困难</div>
        </div>
      </div>
    </div>

    <!-- 游戏界面 -->
    <div v-if="currentScreen === 'game'" class="game-screen">
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

    <!-- 反馈弹窗 -->
    <div class="feedback-modal" v-if="showFeedback">
      <div class="modal-content" :class="{ 'correct': isCorrect, 'wrong': !isCorrect }">
        <div class="feedback-icon">{{ isCorrect ? '🎉' : '😊' }}</div>
        <div class="feedback-title">{{ isCorrect ? '太棒了！' : '再试一次' }}</div>
        <div class="feedback-text">{{ feedbackText }}</div>
        <button class="next-button" @click="nextQuestion">
          {{ isCorrect ? '下一题' : '再想想' }}
        </button>
      </div>
    </div>

    <!-- 练习完成界面 -->
    <div class="completion-modal" v-if="showCompletion">
      <div class="modal-content">
        <div class="completion-icon">🏆</div>
        <div class="completion-title">恭喜完成练习！</div>
        <div class="completion-message">
          <div class="score-info">得分：{{ finalScore }}分</div>
          <div class="accuracy-info">正确率：{{ Math.round((correctAnswers / totalQuestionsPerLevel) * 100) }}%</div>
        </div>
        <div class="completion-actions">
          <button class="continue-button" @click="continuePractice">
            🔄 继续练习
          </button>
          <button class="back-button" @click="backToPractice">
            ← 返回菜单
          </button>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <div class="settings-modal" v-if="showSettings">
      <div class="modal-overlay" @click="showSettings = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">⚙️ 设置</div>
          <div class="close-button" @click="showSettings = false">×</div>
        </div>
        
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-label">每日游戏时长（分钟）</div>
            <div class="setting-value">
              <select v-model="dailyDurationLimit">
                <option value="15">15分钟（适合3-4岁）</option>
                <option value="20">20分钟（适合4-5岁）</option>
                <option value="30">30分钟（适合5-6岁）</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">语音提示</div>
            <div class="setting-value">
              <label class="toggle-switch">
                <input type="checkbox" v-model="voiceEnabled">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">护眼模式</div>
            <div class="setting-value">
              <label class="toggle-switch">
                <input type="checkbox" v-model="eyeProtectionEnabled">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="save-button" @click="saveSettings">保存设置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'

export default {
  name: 'GameUI',
  setup() {
    const state = reactive({
      currentScreen: 'main',
      selectedMode: null, // 'adventure' 或 'practice'
      currentLevel: '',
      currentArea: '',
      currentQuestion: {},
      currentQuestionIndex: 0,
      currentScore: 0,
      selectedOption: null,
      selectedItems: [],
      showFeedback: false,
      isCorrect: false,
      feedbackText: '',
      finalScore: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestionsPerLevel: 5,
      totalScore: 0,
      totalQuestions: 0,
      bestScore: 0,
      showSettings: false,
      showCompletion: false,
      voiceEnabled: true,
      eyeProtectionEnabled: true,
      dailyDurationLimit: 15,
      dailyPlayTime: 0,
      islandMap: {
        areas: [
          { id: 'orchard', name: '🍎 苹果园', unlocked: true, completed: false },
          { id: 'beach', name: '🏖️ 沙滩', unlocked: false, completed: false },
          { id: 'park', name: '🎢 游乐园', unlocked: false, completed: false },
          { id: 'treehouse', name: '🌲 树屋', unlocked: false, completed: false },
          { id: 'cave', name: '🔮 魔法山洞', unlocked: false, completed: false }
        ]
      }
    })

    // 计算属性
    const completedAreas = computed(() => {
      return state.islandMap.areas.filter(area => area.completed).length
    })

    const remainingTime = computed(() => {
      const totalSeconds = state.dailyDurationLimit * 60
      const usedSeconds = state.dailyPlayTime
      const remainingSeconds = Math.max(0, totalSeconds - usedSeconds)
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    })

    const currentAreaName = computed(() => {
      const area = state.islandMap.areas.find(area => area.id === state.currentArea)
      return area ? area.name : ''
    })

    const progressPercentage = computed(() => {
      return Math.round((state.currentQuestionIndex / state.totalQuestionsPerLevel) * 100)
    })

    // 方法
    const selectMode = (mode) => {
      state.currentScreen = mode
    }

    const backToMode = () => {
      // 根据当前模式返回对应的模式选择界面
      if (state.selectedMode === 'adventure') {
        state.currentScreen = 'adventure'
        state.selectedMode = null
      } else if (state.selectedMode === 'practice') {
        state.currentScreen = 'practice'
        state.selectedMode = null
      } else {
        state.currentScreen = 'main'
      }
    }

    const getAreaIcon = (areaId) => {
      const icons = {
        orchard: '🍎',
        beach: '🏖️',
        park: '🎢',
        treehouse: '🌲',
        cave: '🔮'
      }
      return icons[areaId] || '📦'
    }

    const startLevel = (areaId) => {
      state.currentArea = areaId
      state.currentScreen = 'game'
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.selectedItems = []
      state.showFeedback = false
      state.selectedMode = 'adventure'
      generateQuestion()
    }

    const selectPracticeLevel = (level) => {
      state.currentLevel = level
      state.currentScreen = 'game'
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.selectedItems = []
      state.showFeedback = false
      state.selectedMode = 'practice'
      generatePracticeQuestion()
    }

    const generatePracticeQuestion = () => {
      // 练习模式题目生成
      const questions = {
        '5以内加法': [
          { text: '1 + 1 = ?', items: ['🍎', '🍎'], answer: 2 },
          { text: '2 + 3 = ?', items: ['🍎', '🍎', '🍊', '🍊', '🍊'], answer: 5 },
          { text: '4 + 1 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍊'], answer: 5 },
          { text: '3 + 2 = ?', items: ['🍎', '🍎', '🍎', '🍊', '🍊'], answer: 5 },
          { text: '0 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 }
        ],
        '5以内减法': [
          { text: '5 - 1 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
          { text: '3 - 2 = ?', items: ['🍎'], answer: 1 },
          { text: '4 - 3 = ?', items: ['🍎'], answer: 1 },
          { text: '2 - 1 = ?', items: ['🍎'], answer: 1 },
          { text: '5 - 5 = ?', items: [], answer: 0 }
        ],
        '5以内混合运算': [
          { text: '1 + 1 = ?', items: ['🍎', '🍎'], answer: 2 },
          { text: '3 - 1 = ?', items: ['🍎', '🍎'], answer: 2 },
          { text: '2 + 3 = ?', items: ['🍎', '🍎', '🍊', '🍊', '🍊'], answer: 5 },
          { text: '4 - 2 = ?', items: ['🍎', '🍎'], answer: 2 },
          { text: '0 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 }
        ],
        '10以内加法': [
          { text: '5 + 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊'], answer: 8 },
          { text: '6 + 4 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊'], answer: 10 },
          { text: '7 + 2 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊'], answer: 9 },
          { text: '8 + 1 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊'], answer: 9 },
          { text: '5 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊', '🍊'], answer: 10 }
        ],
        '10以内减法': [
          { text: '10 - 2 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], answer: 8 },
          { text: '8 - 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 },
          { text: '9 - 5 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
          { text: '7 - 4 = ?', items: ['🍎', '🍎', '🍎'], answer: 3 },
          { text: '6 - 3 = ?', items: ['🍎', '🍎', '🍎'], answer: 3 }
        ],
        '10以内混合运算': [
          { text: '5 + 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊'], answer: 8 },
          { text: '8 - 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 },
          { text: '6 + 4 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊'], answer: 10 },
          { text: '9 - 5 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
          { text: '5 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊', '🍊'], answer: 10 }
        ]
      }

      const levelQuestions = questions[state.currentLevel] || questions['5以内加法']
      const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]

      state.currentQuestion = {
        text: randomQuestion.text,
        items: randomQuestion.items,
        answer: randomQuestion.answer,
        options: generateOptions(randomQuestion.answer)
      }
    }

    const generateQuestion = () => {
      // 冒险模式题目生成
      const questions = {
        orchard: [
          { text: '小熊的篮子里有1个苹果，小刺猬又送了1个，现在有几个？', items: ['🍎', '🍎'], answer: 2 },
          { text: '小熊有2个苹果，吃掉1个，还剩几个？', items: ['🍎', '🍎'], answer: 1 },
          { text: '树上有3个苹果，掉下来2个，还剩几个？', items: ['🍎', '🍎', '🍎'], answer: 1 },
          { text: '小熊采了4个苹果，松鼠又送了1个，现在有几个？', items: ['🍎', '🍎', '🍎', '🍎'], answer: 5 },
          { text: '小熊有5个苹果，分给小兔子3个，还剩几个？', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 2 }
        ],
        beach: [
          { text: '沙滩上有2个贝壳，又找到了3个，一共有几个？', items: ['🐚', '🐚'], answer: 5 },
          { text: '小熊堆了4个沙堡，被海浪冲垮2个，还剩几个？', items: ['🏰', '🏰', '🏰', '🏰'], answer: 2 }
        ],
        park: [
          { text: '游乐园里有3个小朋友，又来了2个，一共有几个？', items: ['👶', '👶', '👶'], answer: 5 },
          { text: '有5个气球，飞走2个，还剩几个？', items: ['🎈', '🎈', '🎈', '🎈', '🎈'], answer: 3 }
        ],
        treehouse: [
          { text: '树屋上有4只小鸟，飞走1只，还剩几只？', items: ['🐦', '🐦', '🐦', '🐦'], answer: 3 },
          { text: '小熊爬树，爬了3米，又爬了2米，一共爬了几米？', items: ['🌲', '🌲', '🌲'], answer: 5 }
        ],
        cave: [
          { text: '山洞里有5个萤火虫，飞出3个，还剩几个？', items: ['✨', '✨', '✨', '✨', '✨'], answer: 2 },
          { text: '发现了4个宝藏，又找到了1个，一共有几个？', items: ['💎', '💎', '💎', '💎'], answer: 5 }
        ]
      }

      const areaQuestions = questions[state.currentArea] || questions['orchard']
      const randomQuestion = areaQuestions[Math.floor(Math.random() * areaQuestions.length)]

      state.currentQuestion = {
        text: randomQuestion.text,
        items: randomQuestion.items,
        answer: randomQuestion.answer,
        options: generateOptions(randomQuestion.answer)
      }
    }

    const generateOptions = (correctAnswer) => {
      const options = [correctAnswer]
      while (options.length < 4) {
        const randomNum = Math.floor(Math.random() * 10)
        if (!options.includes(randomNum)) {
          options.push(randomNum)
        }
      }
      return options.sort((a, b) => a - b)
    }

    const selectItem = (item) => {
      if (!state.selectedItems.includes(item)) {
        state.selectedItems.push(item)
      } else {
        state.selectedItems = state.selectedItems.filter(i => i !== item)
      }
    }

    const selectAnswer = (option) => {
      if (state.showFeedback) return

      const isCorrect = option === state.currentQuestion.answer
      state.isCorrect = isCorrect
      state.selectedOption = state.currentQuestion.options.indexOf(option)
      state.showFeedback = true

      if (isCorrect) {
        state.correctAnswers++
        state.currentScore += 10
        state.feedbackText = '你太棒了！小熊给你点赞！🎉'
      } else {
        state.wrongAnswers++
        state.feedbackText = '没关系，我们再一起数一数！😊'
      }
    }

    const nextQuestion = () => {
      state.currentQuestionIndex++
      
      if (state.currentQuestionIndex < state.totalQuestionsPerLevel) {
        state.selectedOption = null
        state.selectedItems = []
        state.showFeedback = false
        
        if (state.selectedMode === 'adventure') {
          generateQuestion()
        } else {
          generatePracticeQuestion()
        }
      } else {
        // 练习模式完成
        if (state.selectedMode === 'practice') {
          // 显示完成界面
          state.finalScore = state.currentScore
          state.totalScore += state.currentScore
          state.totalQuestions += state.totalQuestionsPerLevel
          state.bestScore = Math.max(state.bestScore, state.currentScore)
          
          // 显示完成选项
          state.showCompletion = true
        } else {
          // 冒险模式完成
          state.finalScore = state.currentScore
          state.totalScore += state.currentScore
          state.totalQuestions += state.totalQuestionsPerLevel
          state.bestScore = Math.max(state.bestScore, state.currentScore)
          
          // 解锁下一关
          const currentAreaIndex = state.islandMap.areas.findIndex(area => area.id === state.currentArea)
          if (currentAreaIndex < state.islandMap.areas.length - 1) {
            state.islandMap.areas[currentAreaIndex].completed = true
            state.islandMap.areas[currentAreaIndex + 1].unlocked = true
          }
          
          state.currentScreen = 'main'
          state.selectedMode = null
        }
      }
    }

    const playQuestionVoice = () => {
      if (state.voiceEnabled) {
        const utterance = new SpeechSynthesisUtterance(state.currentQuestion.text)
        utterance.lang = 'zh-CN'
        utterance.pitch = 1.2
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    }

    const saveSettings = () => {
      // 保存设置到本地存储
      const settings = {
        dailyDurationLimit: state.dailyDurationLimit,
        voiceEnabled: state.voiceEnabled,
        eyeProtectionEnabled: state.eyeProtectionEnabled
      }
      localStorage.setItem('bearMathSettings', JSON.stringify(settings))
      state.showSettings = false
    }

    const continuePractice = () => {
      // 继续练习
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.selectedItems = []
      state.showCompletion = false
      state.showFeedback = false
      generatePracticeQuestion()
    }

    const backToPractice = () => {
      // 返回练习模式菜单
      state.currentScreen = 'practice'
      state.selectedMode = null
      state.currentLevel = ''
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.selectedItems = []
      state.showCompletion = false
      state.showFeedback = false
    }

    // 从本地存储加载设置
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('bearMathSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        state.dailyDurationLimit = settings.dailyDurationLimit || 15
        state.voiceEnabled = settings.voiceEnabled !== false
        state.eyeProtectionEnabled = settings.eyeProtectionEnabled !== false
      }
    }

    loadSettings()

    return {
      ...toRefs(state),
      completedAreas,
      remainingTime,
      currentAreaName,
      progressPercentage,
      getAreaIcon,
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
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.main-screen {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.mode-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.mode-card {
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
}

.mode-card:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-5px);
  border-color: rgba(255,255,255,0.3);
}

.mode-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.mode-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.mode-description {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
  margin-bottom: 20px;
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
}

.game-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.1);
  padding: 15px 20px;
  border-radius: 15px;
  margin-bottom: 20px;
}

.area-indicator {
  font-weight: bold;
  font-size: 1.1rem;
}

.question-progress {
  font-size: 1.2rem;
  font-weight: bold;
}

.stars-count {
  font-size: 1.2rem;
  font-weight: bold;
}

.question-container {
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
}

.question-text {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.4;
}

.question-visual {
  margin-bottom: 30px;
}

.question-items {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 100px;
}

.question-item {
  font-size: 3rem;
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
  margin-bottom: 20px;
}

.answer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 300px;
  margin: 0 auto;
}

.answer-option {
  background: rgba(255,255,255,0.2);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  font-size: 1.5rem;
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
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
  margin: 20px 0;
  transition: background 0.3s ease;
}

.voice-button:hover {
  background: rgba(255,255,255,0.2);
}

.question-progress-bar {
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 10px;
}

.progress-container {
  width: 100%;
  height: 15px;
  background: rgba(255,255,255,0.3);
  border-radius: 8px;
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
