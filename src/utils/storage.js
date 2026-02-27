// 本地存储工具类
class StorageManager {
  // 用户数据存储键（包含版本信息，防止数据被覆盖）
  static USERS_KEY = 'bearMathIslandUsers_v1'
  static CURRENT_USER_KEY = 'bearMathIslandCurrentUser_v1'
  static DATA_VERSION = '1.0'

  // 获取所有用户
  static getUsers() {
    try {
      // 首先尝试从新版本存储获取数据
      let users = localStorage.getItem(this.USERS_KEY)
      
      // 如果新版本没有数据，尝试从旧版本迁移
      if (!users) {
        const oldVersions = ['bearMathIslandUsers']
        for (const oldKey of oldVersions) {
          const oldData = localStorage.getItem(oldKey)
          if (oldData) {
            try {
              const migratedUsers = JSON.parse(oldData)
              // 迁移数据到新版本格式
              const updatedUsers = migratedUsers.map(user => this.migrateUser(user))
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

  // 用户数据迁移方法（处理不同版本的数据格式）
  static migrateUser(user) {
    // 确保用户数据包含所有必要的字段
    const defaultStats = {
      totalGames: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      bestStreak: 0,
      currentStreak: 0,
      averageScore: 0,
      favoriteNumbers: []
    }

    const defaultPreferences = {
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

  // 保存用户列表
  static saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      return true
    } catch (error) {
      console.error('Failed to save users:', error)
      return false
    }
  }

  // 添加新用户
  static addUser(user) {
    const users = this.getUsers()
    users.push({
      id: Date.now().toString(),
      ...user,
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
        favoriteNumbers: []
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

  // 根据用户名查找用户
  static findUserByUsername(username) {
    const users = this.getUsers()
    return users.find(user => user.username === username)
  }

  // 根据ID查找用户
  static findUserById(userId) {
    const users = this.getUsers()
    return users.find(user => user.id === userId)
  }

  // 更新用户信息
  static updateUser(userId, updates) {
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

  // 记录游戏结果
  static recordGameResult(userId, gameData) {
    const user = this.findUserById(userId)
    if (!user) return false

    const result = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...gameData
    }

    // 只保留最近100条游戏记录
    const gameHistory = [result, ...(user.gameHistory || [])].slice(0, 100)
    
    // 更新统计数据
    const stats = {
      ...user.stats,
      totalGames: (user.stats.totalGames || 0) + 1,
      totalQuestions: (user.stats.totalQuestions || 0) + 1,
      totalCorrect: (user.stats.totalCorrect || 0) + (result.isCorrect ? 1 : 0),
      totalIncorrect: (user.stats.totalIncorrect || 0) + (result.isCorrect ? 0 : 1)
    }

    // 更新连胜记录
    if (result.isCorrect) {
      stats.currentStreak = (user.stats.currentStreak || 0) + 1
      stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak)
    } else {
      stats.currentStreak = 0
    }

    // 计算平均得分
    const averageScore = stats.totalQuestions > 0 ? Math.round(stats.totalCorrect / stats.totalQuestions * 100) : 0
    stats.averageScore = averageScore

    // 更新最后活动时间
    const lastActivity = new Date().toISOString()

    return this.updateUser(userId, {
      gameHistory,
      stats,
      lastActivity
    })
  }

  // 获取当前登录用户
  static getCurrentUser() {
    try {
      const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY)
      if (currentUserId) {
        return this.findUserById(currentUserId)
      }
      return null
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  // 设置当前登录用户
  static setCurrentUser(userId) {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, userId)
      return true
    } catch (error) {
      console.error('Failed to set current user:', error)
      return false
    }
  }

  // 清除当前登录用户
  static clearCurrentUser() {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear current user:', error)
      return false
    }
  }

  // 删除用户
  static deleteUser(userId) {
    const users = this.getUsers()
    const filteredUsers = users.filter(user => user.id !== userId)
    
    // 如果删除的是当前登录用户，清除登录状态
    if (this.getCurrentUser()?.id === userId) {
      this.clearCurrentUser()
    }

    return this.saveUsers(filteredUsers)
  }

  // 验证用户密码
  static validateUser(username, password) {
    const user = this.findUserByUsername(username)
    if (!user) return null
    
    return user.password === password ? user : null
  }

  // 获取用户统计信息
  static getUserStats(userId) {
    const user = this.findUserById(userId)
    return user?.stats || {
      totalGames: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      bestStreak: 0,
      currentStreak: 0,
      favoriteNumbers: []
    }
  }

  // 获取用户游戏历史
  static getUserGameHistory(userId) {
    const user = this.findUserById(userId)
    return user?.gameHistory || []
  }

  // 导出用户数据
  static exportUserData(userId) {
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

  // 数据备份功能
  static backupData() {
    try {
      const users = this.getUsers()
      const currentUser = this.getCurrentUser()
      
      const backupData = {
        version: this.DATA_VERSION,
        timestamp: new Date().toISOString(),
        users: users,
        currentUser: currentUser ? currentUser.id : null
      }
      
      // 备份到本地存储（可以进一步扩展到云端备份）
      localStorage.setItem(`bearMathIslandBackup_${Date.now()}`, JSON.stringify(backupData))
      
      // 只保留最近5个备份
      this.cleanupOldBackups()
      
      return backupData
    } catch (error) {
      console.error('Backup failed:', error)
      return null
    }
  }

  // 恢复数据功能
  static restoreData(backupData) {
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

  // 获取所有备份
  static getBackups() {
    try {
      const backups = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('bearMathIslandBackup_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key))
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
      
      // 按时间倒序排列
      return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
      console.error('Failed to get backups:', error)
      return []
    }
  }

  // 清理旧备份
  static cleanupOldBackups() {
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

  // 导出数据为JSON字符串
  static exportData() {
    return JSON.stringify(this.backupData(), null, 2)
  }

  // 从JSON字符串导入数据
  static importData(jsonString) {
    try {
      const backupData = JSON.parse(jsonString)
      return this.restoreData(backupData)
    } catch (error) {
      console.error('Import failed:', error)
      return false
    }
  }

  // 清除所有数据（用于调试）
  static clearAllData() {
    try {
      localStorage.removeItem(this.USERS_KEY)
      localStorage.removeItem(this.CURRENT_USER_KEY)
      
      // 清除所有备份
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('bearMathIslandBackup_')) {
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
