import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import StorageManager from './storage'

const createLocalStorageMock = () => {
  const store = new Map<string, string>()

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value)
    },
    removeItem: (key: string) => {
      store.delete(key)
    },
    clear: () => {
      store.clear()
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size
    }
  }
}

describe('StorageManager', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: createLocalStorageMock(),
      configurable: true,
      writable: true
    })
  })

  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
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

  it('should clear all backup keys without skipping any entries', () => {
    // 交错插入数据，覆盖“删除时遍历”最容易漏删的场景
    localStorage.setItem('bearMathIslandBackup_1', JSON.stringify({ version: '1.0' }))
    localStorage.setItem('unrelated_key', 'keep-me')
    localStorage.setItem('bearMathIslandUsers_v1', JSON.stringify([{ username: 'testuser' }]))
    localStorage.setItem('bearMathIslandBackup_2', JSON.stringify({ version: '1.0' }))
    localStorage.setItem('bearMathIslandCurrentUser_v1', 'user-id-1')
    localStorage.setItem('bearMathIslandBackup_3', JSON.stringify({ version: '1.0' }))

    const result = StorageManager.clearAllData()

    expect(result).toBe(true)
    expect(localStorage.getItem('bearMathIslandUsers_v1')).toBeNull()
    expect(localStorage.getItem('bearMathIslandCurrentUser_v1')).toBeNull()
    expect(localStorage.getItem('bearMathIslandBackup_1')).toBeNull()
    expect(localStorage.getItem('bearMathIslandBackup_2')).toBeNull()
    expect(localStorage.getItem('bearMathIslandBackup_3')).toBeNull()
    expect(localStorage.getItem('unrelated_key')).toBe('keep-me')
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
