import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import StorageManager from './storage'

describe('StorageManager', () => {
  beforeEach(() => {
    // 清除localStorage
    localStorage.clear()
  })

  afterEach(() => {
    // 清除localStorage
    localStorage.clear()
  })

  it('should add a new user', () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      avatar: '🐻'
    }
    
    const result = StorageManager.addUser(user)
    expect(result).toBe(true)
    
    const users = StorageManager.getUsers()
    expect(users.length).toBe(1)
    expect(users[0].username).toBe('testuser')
  })

  it('should find user by username', () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      avatar: '🐻'
    }
    
    StorageManager.addUser(user)
    const foundUser = StorageManager.findUserByUsername('testuser')
    
    expect(foundUser).toBeDefined()
    expect(foundUser?.username).toBe('testuser')
  })

  it('should validate user with correct password', () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      avatar: '🐻'
    }
    
    StorageManager.addUser(user)
    const validatedUser = StorageManager.validateUser('testuser', 'password123')
    
    expect(validatedUser).toBeDefined()
    expect(validatedUser?.username).toBe('testuser')
  })

  it('should not validate user with incorrect password', () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      avatar: '🐻'
    }
    
    StorageManager.addUser(user)
    const validatedUser = StorageManager.validateUser('testuser', 'wrongpassword')
    
    expect(validatedUser).toBeNull()
  })

  it('should set and get current user', () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      avatar: '🐻'
    }
    
    StorageManager.addUser(user)
    const users = StorageManager.getUsers()
    const userId = users[0].id
    
    const setResult = StorageManager.setCurrentUser(userId)
    expect(setResult).toBe(true)
    
    const currentUser = StorageManager.getCurrentUser()
    expect(currentUser).toBeDefined()
    expect(currentUser?.id).toBe(userId)
  })

  it('should record game result', () => {
    const user = {
      username: 'testuser',
      password: 'password123',
      avatar: '🐻'
    }
    
    StorageManager.addUser(user)
    const users = StorageManager.getUsers()
    const userId = users[0].id
    
    const gameData = {
      gameType: 'practice',
      level: '5以内加法',
      questionText: '1 + 1 = ?',
      questionItems: ['🍎', '🍎'],
      correctAnswer: 2,
      userAnswer: 2,
      isCorrect: true,
      score: 10
    }
    
    const result = StorageManager.recordGameResult(userId, gameData)
    expect(result).toBe(true)
    
    const updatedUser = StorageManager.findUserById(userId)
    expect(updatedUser?.gameHistory.length).toBe(1)
    expect(updatedUser?.stats.totalGames).toBe(1)
    expect(updatedUser?.stats.totalCorrect).toBe(1)
  })
})
