import { defineStore } from 'pinia'
import { questionGenerator } from '../utils/questionGenerator'

export const useGameStore = defineStore('game', {
  state: () => ({
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
    islandMap: {
      areas: [
        { id: 'orchard', name: '🍎 苹果园', unlocked: true, completed: false },
        { id: 'beach', name: '🏖️ 沙滩', unlocked: false, completed: false },
        { id: 'park', name: '🎢 游乐园', unlocked: false, completed: false },
        { id: 'treehouse', name: '🌲 树屋', unlocked: false, completed: false },
        { id: 'cave', name: '🔮 魔法山洞', unlocked: false, completed: false }
      ]
    }
  }),
  getters: {
    completedAreas: (state) => {
      return state.islandMap.areas.filter(area => area.completed).length
    }
  },
  actions: {
    selectMode(mode) {
      this.currentScreen = mode
    },
    backToMode() {
      if (this.selectedMode === 'adventure') {
        this.currentScreen = 'adventure'
        this.selectedMode = null
      } else if (this.selectedMode === 'practice') {
        this.currentScreen = 'practice'
        this.selectedMode = null
      } else {
        this.currentScreen = 'main'
      }
    },
    startLevel(areaId) {
      this.currentArea = areaId
      this.currentScreen = 'game'
      this.currentQuestionIndex = 0
      this.currentScore = 0
      this.correctAnswers = 0
      this.wrongAnswers = 0
      this.selectedOption = null
      this.selectedItems = []
      this.showFeedback = false
      this.selectedMode = 'adventure'
      this.generateQuestion()
    },
    selectPracticeLevel(level) {
      this.currentLevel = level
      this.currentScreen = 'game'
      this.currentQuestionIndex = 0
      this.currentScore = 0
      this.correctAnswers = 0
      this.wrongAnswers = 0
      this.selectedOption = null
      this.selectedItems = []
      this.showFeedback = false
      this.selectedMode = 'practice'
      this.generatePracticeQuestion()
    },
    generatePracticeQuestion() {
      const questionData = questionGenerator.generatePracticeQuestion(this.currentLevel)
      this.currentQuestion = {
        text: questionData.text,
        items: questionData.items,
        answer: questionData.answer,
        options: this.generateOptions(questionData.answer)
      }
    },
    generateQuestion() {
      const questionData = questionGenerator.generateAdventureQuestion(this.currentArea)
      this.currentQuestion = {
        text: questionData.text,
        items: questionData.items,
        answer: questionData.answer,
        options: this.generateOptions(questionData.answer)
      }
    },
    generateOptions(correctAnswer) {
      const options = [correctAnswer]
      while (options.length < 4) {
        let randomNum
        if (correctAnswer > 10) {
          randomNum = Math.floor(Math.random() * 10) + (correctAnswer - 5)
        } else {
          randomNum = Math.floor(Math.random() * 10)
        }
        if (!options.includes(randomNum)) {
          options.push(randomNum)
        }
      }
      return options.sort((a, b) => a - b)
    },
    selectItem(item) {
      if (!this.selectedItems.includes(item)) {
        this.selectedItems.push(item)
      } else {
        this.selectedItems = this.selectedItems.filter(i => i !== item)
      }
    },
    selectAnswer(option) {
      if (this.showFeedback) return

      const isCorrect = option === this.currentQuestion.answer
      this.isCorrect = isCorrect
      this.selectedOption = this.currentQuestion.options.indexOf(option)
      this.showFeedback = true

      if (isCorrect) {
        this.correctAnswers++
        this.currentScore += 10
        this.feedbackText = '你太棒了！小熊给你点赞！🎉'
      } else {
        this.wrongAnswers++
        this.feedbackText = '没关系，我们再一起数一数！😊'
      }

      this.recordGameResult(isCorrect, option)
    },
    recordGameResult(isCorrect, userAnswer) {
      const StorageManager = require('../utils/storage').default
      const currentUser = StorageManager.getCurrentUser()
      
      if (currentUser) {
        const gameData = {
          gameType: this.selectedMode === 'adventure' ? 'adventure' : 'practice',
          level: this.selectedMode === 'adventure' ? this.currentArea : this.currentLevel,
          questionText: this.currentQuestion.text,
          questionItems: this.currentQuestion.items,
          correctAnswer: this.currentQuestion.answer,
          userAnswer: userAnswer,
          isCorrect: isCorrect,
          score: isCorrect ? 10 : 0,
          timestamp: new Date().toISOString()
        }

        StorageManager.recordGameResult(currentUser.id, gameData)
      }
    },
    nextQuestion() {
      this.currentQuestionIndex++
      
      if (this.currentQuestionIndex < this.totalQuestionsPerLevel) {
        this.selectedOption = null
        this.selectedItems = []
        this.showFeedback = false
        
        if (this.selectedMode === 'adventure') {
          this.generateQuestion()
        } else {
          this.generatePracticeQuestion()
        }
      } else {
          if (this.selectedMode === 'practice') {
            this.finalScore = this.currentScore
            this.totalScore += this.currentScore
            this.totalQuestions += this.totalQuestionsPerLevel
            this.bestScore = Math.max(this.bestScore, this.currentScore)
            this.showCompletion = true
          } else {
            this.finalScore = this.currentScore
            this.totalScore += this.currentScore
            this.totalQuestions += this.totalQuestionsPerLevel
            this.bestScore = Math.max(this.bestScore, this.currentScore)
            
            const currentAreaIndex = this.islandMap.areas.findIndex(area => area.id === this.currentArea)
            if (currentAreaIndex < this.islandMap.areas.length - 1) {
              this.islandMap.areas[currentAreaIndex].completed = true
              this.islandMap.areas[currentAreaIndex + 1].unlocked = true
            }
            
            this.currentScreen = 'main'
            this.selectedMode = null
          }
        }
    },
    continuePractice() {
      this.currentQuestionIndex = 0
      this.currentScore = 0
      this.correctAnswers = 0
      this.wrongAnswers = 0
      this.selectedOption = null
      this.selectedItems = []
      this.showCompletion = false
      this.showFeedback = false
      this.generatePracticeQuestion()
    },
    backToPractice() {
      this.currentScreen = 'practice'
      this.selectedMode = null
      this.currentLevel = ''
      this.currentQuestionIndex = 0
      this.currentScore = 0
      this.correctAnswers = 0
      this.wrongAnswers = 0
      this.selectedOption = null
      this.selectedItems = []
      this.showCompletion = false
      this.showFeedback = false
    }
  }
})