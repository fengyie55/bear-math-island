import { defineStore } from 'pinia'
import { saveSettings, loadSettings } from '../utils/storage'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // 游戏设置
    dailyTimeLimit: 30, // 每日游戏时长限制（分钟）
    voiceEnabled: true, // 语音提示
    eyeProtection: true, // 护眼模式
    soundEnabled: true, // 音效
    parentPassword: '1234', // 家长监控密码
    
    // 游戏统计
    totalPlayTime: 0, // 总游戏时间（分钟）
    totalGamesPlayed: 0, // 总游戏次数
    totalCorrectAnswers: 0, // 总正确答案数
    totalQuestionsAnswered: 0, // 总答题数
    
    // 今日游戏数据
    todayPlayTime: 0, // 今日游戏时间
    todayGamesPlayed: 0, // 今日游戏次数
    lastPlayDate: null, // 最后游戏日期
    
    // 显示设置
    showSettings: false
  }),
  
  getters: {
    // 计算今日是否达到时间限制
    isTimeLimitReached: (state) => {
      const today = new Date().toDateString()
      const lastDate = state.lastPlayDate ? new Date(state.lastPlayDate).toDateString() : null
      
      if (today !== lastDate) {
        // 新的一天，重置今日数据
        return false
      }
      
      return state.todayPlayTime >= state.dailyTimeLimit
    },
    
    // 计算总体准确率
    overallAccuracy: (state) => {
      return state.totalQuestionsAnswered > 0 
        ? Math.round((state.totalCorrectAnswers / state.totalQuestionsAnswered) * 100) 
        : 0
    },
    
    // 计算平均游戏时长
    averagePlayTime: (state) => {
      return state.totalGamesPlayed > 0 
        ? Math.round(state.totalPlayTime / state.totalGamesPlayed) 
        : 0
    }
  },
  
  actions: {
    // 初始化设置
    initSettings() {
      const savedSettings = loadSettings()
      if (savedSettings) {
        this.dailyTimeLimit = savedSettings.dailyTimeLimit || this.dailyTimeLimit
        this.voiceEnabled = savedSettings.voiceEnabled !== undefined ? savedSettings.voiceEnabled : this.voiceEnabled
        this.eyeProtection = savedSettings.eyeProtection !== undefined ? savedSettings.eyeProtection : this.eyeProtection
        this.soundEnabled = savedSettings.soundEnabled !== undefined ? savedSettings.soundEnabled : this.soundEnabled
        this.parentPassword = savedSettings.parentPassword || this.parentPassword
        this.totalPlayTime = savedSettings.totalPlayTime || this.totalPlayTime
        this.totalGamesPlayed = savedSettings.totalGamesPlayed || this.totalGamesPlayed
        this.totalCorrectAnswers = savedSettings.totalCorrectAnswers || this.totalCorrectAnswers
        this.totalQuestionsAnswered = savedSettings.totalQuestionsAnswered || this.totalQuestionsAnswered
        this.todayPlayTime = savedSettings.todayPlayTime || this.todayPlayTime
        this.todayGamesPlayed = savedSettings.todayGamesPlayed || this.todayGamesPlayed
        this.lastPlayDate = savedSettings.lastPlayDate || this.lastPlayDate
      }
      
      // 检查是否是新的一天
      this.checkNewDay()
    },
    
    // 检查是否是新的一天
    checkNewDay() {
      const today = new Date().toDateString()
      const lastDate = this.lastPlayDate ? new Date(this.lastPlayDate).toDateString() : null
      
      if (today !== lastDate) {
        this.todayPlayTime = 0
        this.todayGamesPlayed = 0
        this.lastPlayDate = new Date().toISOString()
        this.saveSettings()
      }
    },
    
    // 更新设置
    updateSettings(settings) {
      Object.assign(this, settings)
      this.saveSettings()
    },
    
    // 增加游戏时间
    addPlayTime(minutes) {
      this.totalPlayTime += minutes
      this.todayPlayTime += minutes
      this.lastPlayDate = new Date().toISOString()
      this.saveSettings()
    },
    
    // 增加游戏次数
    addGamePlayed() {
      this.totalGamesPlayed++
      this.todayGamesPlayed++
      this.saveSettings()
    },
    
    // 记录答题情况
    recordAnswer(isCorrect) {
      this.totalQuestionsAnswered++
      if (isCorrect) {
        this.totalCorrectAnswers++
      }
      this.saveSettings()
    },
    
    // 保存设置
    saveSettings() {
      saveSettings({
        dailyTimeLimit: this.dailyTimeLimit,
        voiceEnabled: this.voiceEnabled,
        eyeProtection: this.eyeProtection,
        soundEnabled: this.soundEnabled,
        parentPassword: this.parentPassword,
        totalPlayTime: this.totalPlayTime,
        totalGamesPlayed: this.totalGamesPlayed,
        totalCorrectAnswers: this.totalCorrectAnswers,
        totalQuestionsAnswered: this.totalQuestionsAnswered,
        todayPlayTime: this.todayPlayTime,
        todayGamesPlayed: this.todayGamesPlayed,
        lastPlayDate: this.lastPlayDate
      })
    },
    
    // 重置所有设置
    resetSettings() {
      this.dailyTimeLimit = 30
      this.voiceEnabled = true
      this.eyeProtection = true
      this.soundEnabled = true
      this.parentPassword = '1234'
      this.totalPlayTime = 0
      this.totalGamesPlayed = 0
      this.totalCorrectAnswers = 0
      this.totalQuestionsAnswered = 0
      this.todayPlayTime = 0
      this.todayGamesPlayed = 0
      this.lastPlayDate = null
      this.saveSettings()
    },
    
    // 切换设置面板显示
    toggleSettings() {
      this.showSettings = !this.showSettings
    },
    
    // 关闭设置面板
    closeSettings() {
      this.showSettings = false
    }
  }
})