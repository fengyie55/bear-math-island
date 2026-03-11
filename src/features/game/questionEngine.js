const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = arr => arr[ri(0, arr.length - 1)]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function inferDifficulty(max) {
  if (max <= 5) return 1
  if (max <= 10) return 2
  return 3
}

export function makeOpts(ans, min = 0, max = 20, n = 4) {
  const rangeSize = max - min + 1
  const realN = Math.min(n, rangeSize)
  const s = new Set([ans])
  const ds = shuffle([-3, -2, -1, 1, 2, 3, -4, 4, -5, 5])
  for (const d of ds) {
    if (s.size >= realN) break
    const v = ans + d
    if (v >= min && v <= max) s.add(v)
  }
  let tries = 0
  while (s.size < realN && tries < 50) {
    tries++
    s.add(ri(min, max))
  }
  return shuffle([...s])
}

const SCENES = [
  { emoji: '🍎', name: '苹果', verb: '摘苹果', setting: '苹果园', icon: '🌳🍎' },
  { emoji: '🐟', name: '小鱼', verb: '钓到', setting: '小河边', icon: '🏞️🐟' },
  { emoji: '⭐', name: '星星', verb: '收集到', setting: '夜空下', icon: '🌙⭐' },
  { emoji: '🌸', name: '花朵', verb: '摘花', setting: '花园里', icon: '🌿🌸' },
  { emoji: '🍪', name: '饼干', verb: '烤了', setting: '厨房里', icon: '🏠🍪' },
  { emoji: '🦋', name: '蝴蝶', verb: '看到', setting: '草地上', icon: '🌿🦋' },
  { emoji: '🍓', name: '草莓', verb: '摘到', setting: '草莓地', icon: '🌱🍓' },
  { emoji: '🐣', name: '小鸡', verb: '孵出了', setting: '鸡窝里', icon: '🏡🐣' },
  { emoji: '🎈', name: '气球', verb: '拿到', setting: '集市上', icon: '🎪🎈' },
  { emoji: '🐠', name: '热带鱼', verb: '发现了', setting: '海底', icon: '🌊🐠' },
]

function getScene() {
  return pick(SCENES)
}

function withMeta(question, domain, difficulty, strategy) {
  return { ...question, domain, difficulty, strategy }
}

export function mkCount(max = 5) {
  const sc = getScene()
  const n = ri(1, max)
  return withMeta(
    {
      story: `${sc.setting}里有${n}个${sc.name}，数一数有几个${sc.emoji}？`,
      storyIcon: sc.icon,
      question: `数一数，有几个 ${sc.emoji}？`,
      vtype: 'count',
      items: Array(n).fill(sc.emoji),
      answer: n,
      type: 'choice',
      options: makeOpts(n, 1, max + 2, 4),
      speakText: `${sc.setting}里有${n}个${sc.name}，请数一数，有几个？`,
    },
    'count',
    inferDifficulty(max),
    'visual-counting',
  )
}

export function mkAdd(max = 10) {
  const sc = getScene()
  const a = ri(1, Math.max(1, max - 1))
  const b = ri(1, Math.max(1, max - a))
  const total = a + b
  const storyTemplates = [
    `小熊在${sc.setting}里${sc.verb}了${a}个${sc.name}，又${sc.verb}了${b}个，一共有几个${sc.emoji}？`,
    `妈妈有${a}个${sc.name}${sc.emoji}，爸爸又拿来了${b}个，放在一起有几个？`,
    `篮子里有${a}个${sc.name}${sc.emoji}，小兔子又放进去${b}个，现在有几个？`,
  ]
  return withMeta(
    {
      story: pick(storyTemplates),
      storyIcon: sc.icon,
      question: `${a} ＋ ${b} ＝ ？`,
      vtype: 'add',
      itemsA: Array(a).fill(sc.emoji),
      itemsB: Array(b).fill(sc.emoji),
      a,
      b,
      answer: total,
      type: 'choice',
      options: makeOpts(total, 1, max + 3, 4),
      speakText: `${a}个${sc.name}加上${b}个${sc.name}，一共有几个？`,
    },
    'addition',
    inferDifficulty(max),
    'merge-groups',
  )
}

export function mkSub(max = 10) {
  const sc = getScene()
  const total = ri(3, Math.max(3, max))
  const b = ri(1, total - 1)
  const keep = total - b
  const storyTemplates = [
    `${sc.setting}里有${total}个${sc.name}${sc.emoji}，小熊${sc.verb.includes('摘') ? '摘走' : '吃掉'}了${b}个，还剩几个？`,
    `篮子里有${total}个${sc.name}${sc.emoji}，小鸟叼走了${b}个，还剩几个？`,
    `树上有${total}个${sc.name}${sc.emoji}，风吹落了${b}个，还剩几个？`,
  ]
  return withMeta(
    {
      story: pick(storyTemplates),
      storyIcon: sc.icon,
      question: `${total} － ${b} ＝ ？`,
      vtype: 'sub',
      allItems: Array(total).fill(sc.emoji),
      itemEmoji: sc.name,
      keep,
      b,
      answer: keep,
      type: 'choice',
      options: makeOpts(keep, 1, max, 4),
      speakText: `${total}个${sc.name}，去掉${b}个，还剩几个？`,
    },
    'subtraction',
    inferDifficulty(max),
    'take-away',
  )
}

export function mkMix(max = 10) {
  return Math.random() > 0.5 ? mkAdd(max) : mkSub(max)
}

export function mkMul(mults = [2, 3]) {
  const sc = getScene()
  const a = pick(mults)
  const maxGroups = Math.min(4, Math.floor(12 / a))
  const b = ri(2, Math.max(2, maxGroups))
  const ans = a * b
  const storyTemplates = [
    `小熊把${sc.name}${sc.emoji}分成${b}组，每组${a}个，一共有几个${sc.emoji}？`,
    `${sc.setting}里有${b}排${sc.name}${sc.emoji}，每排${a}个，共有几个？`,
    `桌上放了${b}盘${sc.name}${sc.emoji}，每盘${a}个，总共几个？`,
  ]
  return withMeta(
    {
      story: pick(storyTemplates),
      storyIcon: sc.icon,
      question: `${b} × ${a} ＝ ？`,
      vtype: 'mul',
      groups: Array(b).fill(null).map(() => Array(a).fill(sc.emoji)),
      a,
      b,
      answer: ans,
      type: 'choice',
      options: makeOpts(ans, 2, 25, 4),
      speakText: `${b}组${sc.name}，每组${a}个，一共有几个？`,
    },
    'multiplication',
    mults.includes(5) ? 3 : 2,
    'grouped-repetition',
  )
}

export function mkCmp(max = 10) {
  const safeMax = Math.max(2, max)
  const numA = ri(0, safeMax)
  let numB = ri(0, safeMax)
  let tries = 0
  while (numB === numA && tries < 20) {
    numB = ri(0, safeMax)
    tries++
  }
  if (numB === numA) numB = numA === 0 ? 1 : numA - 1
  const ans = numA < numB ? '＜' : numA > numB ? '＞' : '＝'
  const sc = getScene()
  return withMeta(
    {
      story: `小熊有${numA}个${sc.name}${sc.emoji}，小兔有${numB}个，谁多谁少？`,
      storyIcon: sc.icon,
      question: `${numA} ○ ${numB}，填入正确符号`,
      vtype: 'compare',
      numA,
      numB,
      answer: ans,
      type: 'symbol',
      speakText: `${numA}和${numB}，哪个数更大？在中间填上小于、等于或大于号。`,
    },
    'comparison',
    inferDifficulty(max),
    'number-comparison',
  )
}
