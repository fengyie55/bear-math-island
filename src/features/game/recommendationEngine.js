export function appendRecentAnswer(recentAnswers = [], entry, limit = 60) {
  const next = [...(recentAnswers || []), entry]
  if (next.length <= limit) return next
  return next.slice(-limit)
}

export function pickRecommendedLevel({
  profile,
  allLevels,
  recentWindow = 20,
  minRecentSize = 8,
  minPerLevel = 3,
}) {
  const p = profile || {}
  const levels = allLevels || []

  const recent = (p.recentAnswers || []).slice(-recentWindow)
  if (recent.length >= minRecentSize) {
    const levelAgg = {}
    recent.forEach(r => {
      if (!r?.key) return
      if (!levelAgg[r.key]) levelAgg[r.key] = { total: 0, correct: 0, spentMs: 0 }
      levelAgg[r.key].total++
      if (r.correct) levelAgg[r.key].correct++
      levelAgg[r.key].spentMs += Number(r.spentMs || 0)
    })
    const candidates = Object.entries(levelAgg)
      .filter(([, s]) => s.total >= minPerLevel)
      .map(([key, s]) => ({
        key,
        acc: s.correct / s.total,
        avgMs: s.spentMs / s.total,
      }))
      .sort((a, b) => (a.acc - b.acc) || (b.avgMs - a.avgMs))

    if (candidates.length > 0) {
      return levels.find(l => l.key === candidates[0].key) || null
    }
  }

  if (!p.subjectStats || Object.keys(p.subjectStats).length === 0) {
    const byAge = { 3: 'cnt5', 4: 'add5', 5: 'mix10', 6: 'mul23' }
    const key = byAge[p.age] || 'add5'
    return levels.find(l => l.key === key) || levels[0] || null
  }

  const weak = Object.entries(p.subjectStats)
    .filter(([, s]) => s.total >= 3)
    .sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))
  if (!weak.length) return null
  const weakKey = weak[0][0]
  return levels.find(l => l.key === weakKey) || null
}
