import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    dailyDurationLimit: 15,
    voiceEnabled: true,
    soundEnabled: true,
    eyeProtectionEnabled: true,
    dailyPlayTime: 0
  }),
  getters: {
    remainingTime: (state) => {
      const totalSeconds = state.dailyDurationLimit * 60
      const usedSeconds = state.dailyPlayTime
      const remainingSeconds = Math.max(0, totalSeconds - usedSeconds)
      const minutes = Math.floor(remainingSeconds / 60)
      const seconds = remainingSeconds % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  },
  actions: {
    saveSettings(settings) {
      Object.assign(this, settings)
      localStorage.setItem('bearMathSettings', JSON.stringify(settings))
    },
    loadSettings() {
      const savedSettings = localStorage.getItem('bearMathSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        this.dailyDurationLimit = settings.dailyDurationLimit || 15
        this.voiceEnabled = settings.voiceEnabled !== false
        this.soundEnabled = settings.soundEnabled !== false
        this.eyeProtectionEnabled = settings.eyeProtectionEnabled !== false
      }
    },
    updatePlayTime(seconds) {
      this.dailyPlayTime += seconds
    },
    resetPlayTime() {
      this.dailyPlayTime = 0
    }
  }
})