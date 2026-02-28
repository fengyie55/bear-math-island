import { defineStore } from 'pinia'
import { generateQuestion } from '../utils/questionGenerator'
import { saveGameProgress, loadGameProgress } from '../utils/storage'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 游戏状态
    currentScreen: 'main', // main, adventure, practice, game
    currentMode: null, // adventure, practice
    currentTopic: null,
    currentDifficulty: null,
    currentQuestion: null,
    userAnswer: '',
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    gameHistory: [],
    
    // 冒险模式数据
    adventureProgress: {
      islands: [
        { id: 1, name: '数字岛', unlocked: true, completed: false, stars: 0 },
        { id: 2, name: '加法岛', unlocked: false, completed: false, stars: 0 },
        { id: 3, name: '减法岛', unlocked: false, completed: false, stars: 0 },
        { id: 4, name: '混合运算岛', unlocked: false, completed: false, stars: 0 }
      ]
    },
    
    // 练习模式数据
    practiceProgress: {
      addition: { completed: false, bestScore: 0, lastPlayed: null },
      subtraction: { completed: false, bestScore: 0, lastPlayed: null },
      multiplication: { completed: false, bestScore: 0, lastPlayed: null },
      division: { completed: false, bestScore: 0, lastPlayed: null }
    },
    
    // 反馈状态
    showFeedback: false,
    feedbackCorrect: false,
    feedbackMessage: '',
    
    // 完成状态
    showCompletion: false,
    completionScore: 0,
    completionAccuracy: 0,
    completionMessage: ''
  }),
  
  getters: {
    accuracy: (state) => {
      return state.totalQuestions > 0 ? Math.round((state.correctAnswers / state.totalQuestions) * 100) : 0
    },
    unlockedIslands: (state) => {
      return state.adventureProgress.islands.filter(island => island.unlocked)
    },
    nextUnlockableIsland: (state) => {
      const lockedIslands = state.adventureProgress.islands.filter(island => !island.unlocked)
      return lockedIslands.length > 0 ? lockedIslands[0] : null
    }
  },
  
  actions: {
    // 初始化游戏数据
    initGame() {
      const savedProgress = loadGameProgress()
      if (savedProgress) {
        this.adventureProgress = savedProgress.adventureProgress || this.adventureProgress
        this.practiceProgress = savedProgress.practiceProgress || this.practiceProgress
        this.score = savedProgress.score || 0
      }
    },
    
    // 切换屏幕
    setScreen(screen) {
      this.currentScreen = screen
    },
    
    // 开始冒险模式
    startAdventureMode(islandId) {
      this.currentMode = 'adventure'
      this.currentScreen = 'game'
      this.currentTopic = islandId
      this.generateNewQuestion()
    },
    
    // 开始练习模式
    startPracticeMode(topic, difficulty) {
      this.currentMode = 'practice'
      this.currentScreen = 'game'
      this.currentTopic = topic
      this.currentDifficulty = difficulty
      this.generateNewQuestion()
    },
    
    // 生成新问题
    generateNewQuestion() {
      this.currentQuestion = generateQuestion(this.currentTopic, this.currentDifficulty)
      this.userAnswer = ''
    },
    
    // 检查答案
    checkAnswer() {
      if (!this.currentQuestion) return
      
      const isCorrect = this.userAnswer.toString() === this.currentQuestion.answer.toString()
      this.totalQuestions++
      
      if (isCorrect) {
        this.correctAnswers++
        this.score += 10
        this.feedbackCorrect = true
        this.feedbackMessage = '太棒了！回答正确！'
      } else {
        this.feedbackCorrect = false
        this.feedbackMessage = `再试一次，正确答案是 ${this.currentQuestion.answer}`
      }
      
      // 记录游戏历史
      this.gameHistory.push({
        question: this.currentQuestion.question,
        userAnswer: this.userAnswer,
        correctAnswer: this.currentQuestion.answer,
        isCorrect,
        timestamp: new Date().toISOString()
      })
      
      // 显示反馈
      this.showFeedback = true
      
      // 延迟后生成新问题
      setTimeout(() => {
        this.showFeedback = false
        this.generateNewQuestion()
      }, 2000)
    },
    
    // 完成游戏
    completeGame() {
      this.completionScore = this.score
      this.completionAccuracy = this.accuracy
      
      if (this.completionAccuracy >= 90) {
        this.completionMessage = '太棒了！你是数学小天才！'
      } else if (this.completionAccuracy >= 70) {
        this.completionMessage = '做得不错！继续努力！'
      } else {
        this.completionMessage = '加油！多练习就会更棒！'
      }
      
      // 更新游戏进度
      if (this.currentMode === 'adventure') {
        const island = this.adventureProgress.islands.find(island => island.id === this.currentTopic)
        if (island) {
          island.completed = true
          island.stars = Math.min(3, Math.floor(this.completionAccuracy / 33))
          
          // 解锁下一个岛屿
          const nextIslandIndex = this.adventureProgress.islands.findIndex(island => island.id === this.currentTopic) + 1
          if (nextIslandIndex < this.adventureProgress.islands.length) {
            this.adventureProgress.islands[nextIslandIndex].unlocked = true
          }
        }
      } else if (this.currentMode === 'practice') {
        const practiceData = this.practiceProgress[this.currentTopic]
        if (practiceData) {
          practiceData.completed = true
          practiceData.bestScore = Math.max(practiceData.bestScore, this.score)
          practiceData.lastPlayed = new Date().toISOString()
        }
      }
      
      // 保存游戏进度
      this.saveProgress()
      
      // 显示完成界面
      this.showCompletion = true
    },
    
    // 保存游戏进度
    saveProgress() {
      saveGameProgress({
        adventureProgress: this.adventureProgress,
        practiceProgress: this.practiceProgress,
        score: this.score
      })
    },
    
    // 重置游戏
    resetGame() {
      this.score = 0
      this.totalQuestions = 0
      this.correctAnswers = 0
      this.gameHistory = []
      this.currentQuestion = null
      this.userAnswer = ''
      this.showFeedback = false
      this.showCompletion = false
    },
    
    // 关闭完成界面
    closeCompletion() {
      this.showCompletion = false
      this.resetGame()
      this.setScreen('main')
    }
  }
})