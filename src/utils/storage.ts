interface UserStats {
  totalGames: number
  totalQuestions: number
  totalCorrect: number
  totalIncorrect: number
  bestStreak: number
  currentStreak: number
  averageScore: number
  totalStudyTime: number
  favoriteNumbers: number[]
  weakAreas: string[]
  strongAreas: string[]
  achievements: number
  weeklyGoal: {
    targetQuestions: number
    currentQuestions: number
    targetTime: number
    currentTime: number
  }
}

interface UserPreferences {
  soundEnabled: boolean
  musicEnabled: boolean
  difficulty: string
  theme: string
}

interface GameResult {
  id: string
  timestamp: string
  gameType: string
  level: string
  questionText: string
  questionItems: string[]
  correctAnswer: number
  userAnswer: number
  isCorrect: boolean
  score: number
}

interface User {
  id: string
  username: string
  password: string
  avatar: string
  createdAt: string
  updatedAt: string
  lastActivity: string
  stats: UserStats
  preferences: UserPreferences
  gameHistory: GameResult[]
  dataVersion: string
}

interface BackupData {
  version: string
  timestamp: string
  users: User[]
  currentUser: string | null
}

class StorageManager {
  static USERS_KEY = 'bearMathIslandUsers_v1'
  static CURRENT_USER_KEY = 'bearMathIslandCurrentUser_v1'
  static DATA_VERSION = '1.0'

  static getUsers(): User[] {
    try {
      let users = localStorage.getItem(this.USERS_KEY)
      
      if (!users) {
        const oldVersions = ['bearMathIslandUsers']
        for (const oldKey of oldVersions) {
          const oldData = localStorage.getItem(oldKey)
          if (oldData) {
            try {
              const migratedUsers = JSON.parse(oldData)
              const updatedUsers = migratedUsers.map((user: any) => this.migrateUser(user))
              this.saveUsers(updatedUsers)
              console.log('用户数据成功迁移到新版本')
              users = JSON.stringify(updatedUsers)
              break
            } catch (error) {
              console.error('数据迁移失败:', error)
            }
          }
        }
      }
      
      return users ? JSON.parse(users) : []
    } catch (error) {
      console.error('Failed to get users:', error)
      return []
    }
  }

  static migrateUser(user: any): User {
    const defaultStats: UserStats = {
      totalGames: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      bestStreak: 0,
      currentStreak: 0,
      averageScore: 0,
      totalStudyTime: 0,
      favoriteNumbers: [],
      weakAreas: [],
      strongAreas: [],
      achievements: 0,
      weeklyGoal: {
        targetQuestions: 100,
        currentQuestions: 0,
        targetTime: 105,
        currentTime: 0
      }
    }

    const defaultPreferences: UserPreferences = {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'easy',
      theme: 'light'
    }

    return {
      id: user.id || Date.now().toString(),
      username: user.username || '未命名用户',
      password: user.password || '',
      avatar: user.avatar || '🐻',
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString(),
      lastActivity: user.lastActivity || new Date().toISOString(),
      stats: { ...defaultStats, ...user.stats },
      preferences: { ...defaultPreferences, ...user.preferences },
      gameHistory: user.gameHistory || [],
      dataVersion: this.DATA_VERSION
    }
  }

  static saveUsers(users: User[]): boolean {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Failed to save users:', error)
      return false
    }
  }

  static addUser(user: Partial<User>): boolean {
    const users = this.getUsers()
    users.push({
      id: Date.now().toString(),
      username: user.username || '未命名用户',
      password: user.password || '',
      avatar: user.avatar || '🐻',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      stats: {
        totalGames: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        bestStreak: 0,
        currentStreak: 0,
        averageScore: 0,
        totalStudyTime: 0,
        favoriteNumbers: [],
        weakAreas: [],
        strongAreas: [],
        achievements: 0,
        weeklyGoal: {
          targetQuestions: 100,
          currentQuestions: 0,
          targetTime: 105,
          currentTime: 0
        }
      },
      preferences: {
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'easy',
        theme: 'light'
      },
      gameHistory: []
    })
    return this.saveUsers(users)
  }

  static findUserByUsername(username: string): User | undefined {
    const users = this.getUsers()
    return users.find(user => user.username === username)
  }

  static findUserById(userId: string): User | undefined {
    const users = this.getUsers()
    return users.find(user => user.id === userId)
  }

  static updateUser(userId: string, updates: Partial<User>): boolean {
    const users = this.getUsers()
    const index = users.findIndex(user => user.id === userId)
    
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      return this.saveUsers(users)
    }
    
    return false
  }

  static recordGameResult(userId: string, gameData: Omit<GameResult, 'id' | 'timestamp'>): boolean {
    const user = this.findUserById(userId)
    if (!user) return false

    const result: GameResult = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...gameData
    }

    const gameHistory = [result, ...(user.gameHistory || [])].slice(0, 100)
    
    const stats = {
      ...user.stats,
      totalGames: (user.stats.totalGames || 0) + 1,
      totalQuestions: (user.stats.totalQuestions || 0) + 1,
      totalCorrect: (user.stats.totalCorrect || 0) + (result.isCorrect ? 1 : 0),
      totalIncorrect: (user.stats.totalIncorrect || 0) + (result.isCorrect ? 0 : 1),
      totalStudyTime: (user.stats.totalStudyTime || 0) + 5
    }

    if (result.isCorrect) {
      stats.currentStreak = (user.stats.currentStreak || 0) + 1
      stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)
    } else {
      stats.currentStreak = 0
    }

    const averageScore = stats.totalQuestions > 0 ? Math.round(stats.totalCorrect / stats.totalQuestions * 100) : 0
    stats.averageScore = averageScore

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weeklyGames = gameHistory.filter(game => {
      const gameDate = new Date(game.timestamp)
      return gameDate >= oneWeekAgo
    })
    
    stats.weeklyGoal = {
      targetQuestions: 100,
      currentQuestions: weeklyGames.length,
      targetTime: 105,
      currentTime: weeklyGames.length * 5
    }

    this.analyzeSkillAreas(stats, gameHistory)

    const lastActivity = new Date().toISOString()

    return this.updateUser(userId, {
      gameHistory,
      stats,
      lastActivity
    })
  }

  static analyzeSkillAreas(stats: UserStats, gameHistory: GameResult[]): void {
    const areaStats: Record<string, { correct: number; total: number }> = {
      addition: { correct: 0, total: 0 },
      subtraction: { correct: 0, total: 0 },
      multiplication: { correct: 0, total: 0 },
      division: { correct: 0, total: 0 },
      comparison: { correct: 0, total: 0 },
      matching: { correct: 0, total: 0 }
    }

    gameHistory.forEach(game => {
      const gameType = game.gameType || 'other'
      if (areaStats[gameType]) {
        areaStats[gameType].total++
        if (game.isCorrect) {
          areaStats[gameType].correct++
        }
      }
    })

    const weakAreas: string[] = []
    const strongAreas: string[] = []

    Object.entries(areaStats).forEach(([area, data]) => {
      if (data.total > 0) {
        const accuracy = data.correct / data.total
        if (accuracy < 0.6) {
          weakAreas.push(area)
        } else if (accuracy > 0.8) {
          strongAreas.push(area)
        }
      }
    })

    stats.weakAreas = weakAreas
    stats.strongAreas = strongAreas
  }

  static getCurrentUser(): User | null {
    try {
      const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY)
      if (currentUserId) {
        return this.findUserById(currentUserId) || null
      }
      return null
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  static getAllUsers(): User[] {
    return this.getUsers()
  }

  static setCurrentUser(userId: string): boolean {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, userId)
      return true
    } catch (error) {
      console.error('Failed to set current user:', error)
      return false
    }
  }

  static clearCurrentUser(): boolean {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear current user:', error)
      return false
    }
  }

  static deleteUser(userId: string): boolean {
    const users = this.getUsers()
    const filteredUsers = users.filter(user => user.id !== userId)
    
    if (this.getCurrentUser()?.id === userId) {
      this.clearCurrentUser()
    }

    return this.saveUsers(filteredUsers)
  }

  static validateUser(username: string, password: string): User | null {
    const user = this.findUserByUsername(username)
    if (!user) return null
    
    return user.password === password ? user : null
  }

  static getUserStats(userId: string): UserStats {
    const user = this.findUserById(userId)
    return user?.stats || {
      totalGames: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      bestStreak: 0,
      currentStreak: 0,
      averageScore: 0,
      totalStudyTime: 0,
      favoriteNumbers: [],
      weakAreas: [],
      strongAreas: [],
      achievements: 0,
      weeklyGoal: {
        targetQuestions: 100,
        currentQuestions: 0,
        targetTime: 105,
        currentTime: 0
      }
    }
  }

  static getUserGameHistory(userId: string): GameResult[] {
    const user = this.findUserById(userId)
    return user?.gameHistory || []
  }

  static exportUserData(userId: string): Partial<User> | null {
    const user = this.findUserById(userId)
    if (!user) return null

    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      stats: user.stats,
      preferences: user.preferences,
      gameHistory: user.gameHistory,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  static backupData(): BackupData | null {
    try {
      const users = this.getUsers()
      const currentUser = this.getCurrentUser()
      
      const backupData: BackupData = {
        version: this.DATA_VERSION,
        timestamp: new Date().toISOString(),
        users: users,
        currentUser: currentUser ? currentUser.id : null
      }
      
      localStorage.setItem(`bearMathIslandBackup_${Date.now()}`, JSON.stringify(backupData))
      
      this.cleanupOldBackups()
      
      return backupData
    } catch (error) {
      console.error('Backup failed:', error)
      return null
    }
  }

  static restoreData(backupData: BackupData): boolean {
    try {
      if (backupData.version !== this.DATA_VERSION) {
        console.warn('数据版本不匹配，尝试迁移')
        backupData.users = backupData.users.map(user => this.migrateUser(user))
      }
      
      this.saveUsers(backupData.users)
      
      if (backupData.currentUser) {
        this.setCurrentUser(backupData.currentUser)
      }
      
      return true
    } catch (error) {
      console.error('Restore failed:', error)
      return false
    }
  }

  static getBackups(): Array<{ timestamp: string; version: string; userCount: number; key: string }> {
    try {
      const backups: Array<{ timestamp: string; version: string; userCount: number; key: string }> = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('bearMathIslandBackup_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}')
            backups.push({
              timestamp: data.timestamp,
              version: data.version,
              userCount: data.users.length,
              key: key
            })
          } catch (error) {
            console.error('Failed to parse backup:', key, error)
          }
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } catch (error) {
      console.error('Failed to get backups:', error)
      return []
    }
  }

  static cleanupOldBackups(): void {
    try {
      const backups = this.getBackups()
      if (backups.length > 5) {
        const oldBackups = backups.slice(5)
        oldBackups.forEach(backup => {
          localStorage.removeItem(backup.key)
        })
      }
    } catch (error) {
      console.error('Backup cleanup failed:', error)
    }
  }

  static exportData(): string {
    const backupData = this.backupData()
    return JSON.stringify(backupData, null, 2)
  }

  static importData(jsonString: string): boolean {
    try {
      const backupData = JSON.parse(jsonString)
      return this.restoreData(backupData)
    } catch (error) {
      console.error('Import failed:', error)
      return false
    }
  }

  static clearAllData(): boolean {
    try {
      localStorage.removeItem(this.USERS_KEY)
      localStorage.removeItem(this.CURRENT_USER_KEY)
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('bearMathIslandBackup_')) {
          localStorage.removeItem(key)
        }
      }
      
      return true
    } catch (error) {
      console.error('Failed to clear all data:', error)
      return false
    }
  }
}

export default StorageManager