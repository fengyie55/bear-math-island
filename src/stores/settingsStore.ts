import { defineStore } from 'pinia'

interface SettingsState {
  soundEnabled: boolean
  musicEnabled: boolean
  voiceEnabled: boolean
  difficulty: string
  theme: string
  notifications: boolean
  language: string
  fontSize: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsState => ({
    soundEnabled: true,
    musicEnabled: true,
    voiceEnabled: true,
    difficulty: 'easy',
    theme: 'light',
    notifications: true,
    language: 'zh-CN',
    fontSize: 'medium'
  }),
  actions: {
    toggleSound() {
      this.soundEnabled = !this.soundEnabled
      this.saveSettings()
    },
    toggleMusic() {
      this.musicEnabled = !this.musicEnabled
      this.saveSettings()
    },
    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled
      this.saveSettings()
    },
    setDifficulty(difficulty: string) {
      this.difficulty = difficulty
      this.saveSettings()
    },
    setTheme(theme: string) {
      this.theme = theme
      this.applyTheme()
      this.saveSettings()
    },
    toggleNotifications() {
      this.notifications = !this.notifications
      this.saveSettings()
    },
    setLanguage(language: string) {
      this.language = language
      this.saveSettings()
    },
    setFontSize(size: string) {
      this.fontSize = size
      this.applyFontSize()
      this.saveSettings()
    },
    saveSettings() {
      try {
        localStorage.setItem('bearMathIslandSettings', JSON.stringify({
          soundEnabled: this.soundEnabled,
          musicEnabled: this.musicEnabled,
          voiceEnabled: this.voiceEnabled,
          difficulty: this.difficulty,
          theme: this.theme,
          notifications: this.notifications,
          language: this.language,
          fontSize: this.fontSize
        }))
      } catch (error) {
        console.error('Failed to save settings:', error)
      }
    },
    loadSettings() {
      try {
        const savedSettings = localStorage.getItem('bearMathIslandSettings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          this.soundEnabled = settings.soundEnabled ?? true
          this.musicEnabled = settings.musicEnabled ?? true
          this.voiceEnabled = settings.voiceEnabled ?? true
          this.difficulty = settings.difficulty ?? 'easy'
          this.theme = settings.theme ?? 'light'
          this.notifications = settings.notifications ?? true
          this.language = settings.language ?? 'zh-CN'
          this.fontSize = settings.fontSize ?? 'medium'
          this.applyTheme()
          this.applyFontSize()
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    },
    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
    },
    applyFontSize() {
      const fontSizeMap = {
        small: '12px',
        medium: '14px',
        large: '16px'
      }
      document.documentElement.style.fontSize = fontSizeMap[this.fontSize as keyof typeof fontSizeMap] || '14px'
    },
    resetSettings() {
      this.soundEnabled = true
      this.musicEnabled = true
      this.voiceEnabled = true
      this.difficulty = 'easy'
      this.theme = 'light'
      this.notifications = true
      this.language = 'zh-CN'
      this.fontSize = 'medium'
      this.applyTheme()
      this.applyFontSize()
      this.saveSettings()
    }
  }
})