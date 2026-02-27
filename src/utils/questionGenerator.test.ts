import { describe, it, expect } from 'vitest'
import { questionGenerator } from './questionGenerator'

describe('QuestionGenerator', () => {
  it('should generate practice question for specific level', () => {
    const question = questionGenerator.generatePracticeQuestion('5以内加法')
    expect(question).toHaveProperty('text')
    expect(question).toHaveProperty('items')
    expect(question).toHaveProperty('answer')
    expect(Array.isArray(question.items)).toBe(true)
    expect(typeof question.answer).toBe('number')
  })

  it('should generate adventure question for specific area', () => {
    const question = questionGenerator.generateAdventureQuestion('orchard')
    expect(question).toHaveProperty('text')
    expect(question).toHaveProperty('items')
    expect(question).toHaveProperty('answer')
    expect(Array.isArray(question.items)).toBe(true)
    expect(typeof question.answer).toBe('number')
  })

  it('should generate random addition question', () => {
    const question = questionGenerator.generateRandomQuestion(1, 5, 'addition')
    expect(question).toHaveProperty('text')
    expect(question).toHaveProperty('items')
    expect(question).toHaveProperty('answer')
    expect(Array.isArray(question.items)).toBe(true)
    expect(typeof question.answer).toBe('number')
  })

  it('should generate random subtraction question', () => {
    const question = questionGenerator.generateRandomQuestion(1, 5, 'subtraction')
    expect(question).toHaveProperty('text')
    expect(question).toHaveProperty('items')
    expect(question).toHaveProperty('answer')
    expect(Array.isArray(question.items)).toBe(true)
    expect(typeof question.answer).toBe('number')
  })

  it('should generate random multiplication question', () => {
    const question = questionGenerator.generateRandomQuestion(1, 5, 'multiplication')
    expect(question).toHaveProperty('text')
    expect(question).toHaveProperty('items')
    expect(question).toHaveProperty('answer')
    expect(Array.isArray(question.items)).toBe(true)
    expect(typeof question.answer).toBe('number')
  })
})
