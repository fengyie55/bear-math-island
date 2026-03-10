import { describe, expect, it } from 'vitest'
import { makeOpts, mkAdd, mkSub, mkMul, mkCmp, mkCount } from './questionEngine'

function assertMeta(q) {
  expect(typeof q.domain).toBe('string')
  expect(typeof q.difficulty).toBe('number')
  expect(typeof q.strategy).toBe('string')
}

describe('questionEngine', () => {
  it('makeOpts should include answer and keep values unique/in-range', () => {
    const ans = 7
    const opts = makeOpts(ans, 1, 10, 4)
    expect(opts).toContain(ans)
    expect(new Set(opts).size).toBe(opts.length)
    expect(opts.every(v => v >= 1 && v <= 10)).toBe(true)
  })

  it('makeOpts should cap option size to range size', () => {
    const opts = makeOpts(2, 1, 3, 10)
    expect(opts.length).toBe(3)
  })

  it('mkAdd should produce consistent answer with metadata', () => {
    const q = mkAdd(10)
    expect(q.answer).toBe(q.a + q.b)
    expect(q.options).toContain(q.answer)
    expect(q.domain).toBe('addition')
    assertMeta(q)
  })

  it('mkSub should produce consistent keep/result with metadata', () => {
    const q = mkSub(10)
    expect(q.answer).toBe(q.keep)
    expect(q.keep).toBeGreaterThan(0)
    expect(q.options).toContain(q.answer)
    expect(q.domain).toBe('subtraction')
    assertMeta(q)
  })

  it('mkMul should keep total visual items <= 12', () => {
    const q = mkMul([2, 3, 4])
    const count = q.groups.reduce((sum, g) => sum + g.length, 0)
    expect(count).toBeLessThanOrEqual(12)
    expect(q.answer).toBe(q.a * q.b)
    expect(q.domain).toBe('multiplication')
    assertMeta(q)
  })

  it('mkCmp should not generate equal pair and answer should match', () => {
    const q = mkCmp(10)
    expect(q.numA).not.toBe(q.numB)
    const expected = q.numA < q.numB ? '＜' : '＞'
    expect(q.answer).toBe(expected)
    expect(q.domain).toBe('comparison')
    assertMeta(q)
  })

  it('mkCount should keep answer aligned with rendered items', () => {
    const q = mkCount(10)
    expect(q.answer).toBe(q.items.length)
    expect(q.options).toContain(q.answer)
    expect(q.domain).toBe('count')
    assertMeta(q)
  })
})
