import { describe, expect, it } from 'vitest'
import { appendRecentAnswer, pickRecommendedLevel } from './recommendationEngine'

const LEVELS = [
  { key: 'cnt5', name: '数一数（1-5）' },
  { key: 'add5', name: '5以内加法' },
  { key: 'sub5', name: '5以内减法' },
  { key: 'mix10', name: '混合练习（10内）' },
  { key: 'mul23', name: '2和3的乘法' },
]

describe('recommendationEngine', () => {
  it('appendRecentAnswer should cap list size', () => {
    const base = Array.from({ length: 60 }, (_, i) => ({ key: `k${i}` }))
    const out = appendRecentAnswer(base, { key: 'last' }, 60)
    expect(out.length).toBe(60)
    expect(out[out.length - 1].key).toBe('last')
  })

  it('pickRecommendedLevel should use age fallback without history', () => {
    const rec = pickRecommendedLevel({ profile: { age: 4 }, allLevels: LEVELS })
    expect(rec?.key).toBe('add5')
  })

  it('pickRecommendedLevel should use weakest subjectStats when recent not enough', () => {
    const profile = {
      age: 5,
      subjectStats: {
        add5: { total: 5, correct: 4 },
        sub5: { total: 5, correct: 1 },
      },
      recentAnswers: [{ key: 'add5', correct: true, spentMs: 1000 }],
    }
    const rec = pickRecommendedLevel({ profile, allLevels: LEVELS })
    expect(rec?.key).toBe('sub5')
  })

  it('pickRecommendedLevel should prioritize recent weak performance', () => {
    const profile = {
      age: 5,
      subjectStats: {
        add5: { total: 10, correct: 2 },
        sub5: { total: 10, correct: 8 },
      },
      recentAnswers: [
        { key: 'add5', correct: true, spentMs: 1200 },
        { key: 'add5', correct: true, spentMs: 1300 },
        { key: 'add5', correct: true, spentMs: 1100 },
        { key: 'sub5', correct: false, spentMs: 3000 },
        { key: 'sub5', correct: false, spentMs: 3200 },
        { key: 'sub5', correct: true, spentMs: 2800 },
        { key: 'sub5', correct: false, spentMs: 3500 },
        { key: 'sub5', correct: false, spentMs: 3300 },
      ],
    }
    const rec = pickRecommendedLevel({ profile, allLevels: LEVELS })
    expect(rec?.key).toBe('sub5')
  })
})
