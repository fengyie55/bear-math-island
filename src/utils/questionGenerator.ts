interface QuestionData {
  text: string
  items: string[]
  answer: number
}

interface PracticeQuestions {
  [key: string]: QuestionData[]
}

interface AdventureQuestions {
  [key: string]: QuestionData[]
}

class QuestionGenerator {
  private practiceQuestions: PracticeQuestions = {
    '5以内加法': [
      { text: '1 + 1 = ?', items: ['🍎', '🍎'], answer: 2 },
      { text: '2 + 3 = ?', items: ['🍎', '🍎', '🍊', '🍊', '🍊'], answer: 5 },
      { text: '4 + 1 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍊'], answer: 5 },
      { text: '3 + 2 = ?', items: ['🍎', '🍎', '🍎', '🍊', '🍊'], answer: 5 },
      { text: '0 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 }
    ],
    '5以内减法': [
      { text: '5 - 1 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
      { text: '3 - 2 = ?', items: ['🍎'], answer: 1 },
      { text: '4 - 3 = ?', items: ['🍎'], answer: 1 },
      { text: '2 - 1 = ?', items: ['🍎'], answer: 1 },
      { text: '5 - 5 = ?', items: [], answer: 0 }
    ],
    '5以内混合运算': [
      { text: '1 + 1 = ?', items: ['🍎', '🍎'], answer: 2 },
      { text: '3 - 1 = ?', items: ['🍎', '🍎'], answer: 2 },
      { text: '2 + 3 = ?', items: ['🍎', '🍎', '🍊', '🍊', '🍊'], answer: 5 },
      { text: '4 - 2 = ?', items: ['🍎', '🍎'], answer: 2 },
      { text: '0 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 }
    ],
    '10以内加法': [
      { text: '5 + 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊'], answer: 8 },
      { text: '6 + 4 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊'], answer: 10 },
      { text: '7 + 2 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊'], answer: 9 },
      { text: '8 + 1 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊'], answer: 9 },
      { text: '5 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊', '🍊'], answer: 10 }
    ],
    '10以内减法': [
      { text: '10 - 2 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], answer: 8 },
      { text: '8 - 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 },
      { text: '9 - 5 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
      { text: '7 - 4 = ?', items: ['🍎', '🍎', '🍎'], answer: 3 },
      { text: '6 - 3 = ?', items: ['🍎', '🍎', '🍎'], answer: 3 }
    ],
    '10以内混合运算': [
      { text: '5 + 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊'], answer: 8 },
      { text: '8 - 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 5 },
      { text: '6 + 4 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊'], answer: 10 },
      { text: '9 - 5 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
      { text: '5 + 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍊', '🍊', '🍊', '🍊', '🍊'], answer: 10 }
    ],
    '乘法表': [
      { text: '2 × 2 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4 },
      { text: '3 × 4 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], answer: 12 },
      { text: '5 × 5 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], answer: 25 },
      { text: '7 × 3 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], answer: 21 },
      { text: '9 × 2 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎'], answer: 18 }
    ],
    '数字认识': [
      { text: '图中有几个苹果？', items: ['🍎', '🍎', '🍎'], answer: 3 },
      { text: '图中有几个橙子？', items: ['🍊', '🍊', '🍊', '🍊'], answer: 4 },
      { text: '图中有几个草莓？', items: ['🍓', '🍓', '🍓', '🍓', '🍓'], answer: 5 },
      { text: '图中有几个葡萄？', items: ['🍇', '🍇', '🍇', '🍇', '🍇', '🍇'], answer: 6 },
      { text: '图中有几个樱桃？', items: ['🍒', '🍒', '🍒', '🍒', '🍒', '🍒', '🍒'], answer: 7 }
    ],
    '比较大小': [
      { text: '3 和 5，哪个大？', items: ['3', '5'], answer: 5 },
      { text: '8 和 2，哪个大？', items: ['8', '2'], answer: 8 },
      { text: '4 和 4，哪个大？', items: ['4', '4'], answer: 4 },
      { text: '7 和 9，哪个大？', items: ['7', '9'], answer: 9 },
      { text: '1 和 10，哪个大？', items: ['1', '10'], answer: 10 }
    ]
  }

  private adventureQuestions: AdventureQuestions = {
    orchard: [
      { text: '小熊的篮子里有1个苹果，小刺猬又送了1个，现在有几个？', items: ['🍎', '🍎'], answer: 2 },
      { text: '小熊有2个苹果，吃掉1个，还剩几个？', items: ['🍎', '🍎'], answer: 1 },
      { text: '树上有3个苹果，掉下来2个，还剩几个？', items: ['🍎', '🍎', '🍎'], answer: 1 },
      { text: '小熊采了4个苹果，松鼠又送了1个，现在有几个？', items: ['🍎', '🍎', '🍎', '🍎'], answer: 5 },
      { text: '小熊有5个苹果，分给小兔子3个，还剩几个？', items: ['🍎', '🍎', '🍎', '🍎', '🍎'], answer: 2 }
    ],
    beach: [
      { text: '沙滩上有2个贝壳，又找到了3个，一共有几个？', items: ['🐚', '🐚'], answer: 5 },
      { text: '小熊堆了4个沙堡，被海浪冲垮2个，还剩几个？', items: ['🏰', '🏰', '🏰', '🏰'], answer: 2 }
    ],
    park: [
      { text: '游乐园里有3个小朋友，又来了2个，一共有几个？', items: ['👶', '👶', '👶'], answer: 5 },
      { text: '有5个气球，飞走2个，还剩几个？', items: ['🎈', '🎈', '🎈', '🎈', '🎈'], answer: 3 }
    ],
    treehouse: [
      { text: '树屋上有4只小鸟，飞走1只，还剩几只？', items: ['🐦', '🐦', '🐦', '🐦'], answer: 3 },
      { text: '小熊爬树，爬了3米，又爬了2米，一共爬了几米？', items: ['🌲', '🌲', '🌲'], answer: 5 }
    ],
    cave: [
      { text: '山洞里有5个萤火虫，飞出3个，还剩几个？', items: ['✨', '✨', '✨', '✨', '✨'], answer: 2 },
      { text: '发现了4个宝藏，又找到了1个，一共有几个？', items: ['💎', '💎', '💎', '💎'], answer: 5 }
    ]
  }

  generatePracticeQuestion(level: string): QuestionData {
    const levelQuestions = this.practiceQuestions[level] || this.practiceQuestions['5以内加法']
    const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
    return randomQuestion
  }

  generateAdventureQuestion(areaId: string): QuestionData {
    const areaQuestions = this.adventureQuestions[areaId] || this.adventureQuestions['orchard']
    const randomQuestion = areaQuestions[Math.floor(Math.random() * areaQuestions.length)]
    return randomQuestion
  }

  generateRandomQuestion(min: number, max: number, operation: 'addition' | 'subtraction' | 'multiplication'): QuestionData {
    let a: number, b: number, answer: number, text: string, items: string[] = []

    switch (operation) {
      case 'addition':
        a = Math.floor(Math.random() * (max - min + 1)) + min
        b = Math.floor(Math.random() * (max - a + 1)) + min
        answer = a + b
        text = `${a} + ${b} = ?`
        break
      case 'subtraction':
        a = Math.floor(Math.random() * (max - min + 1)) + min
        b = Math.floor(Math.random() * (a - min + 1)) + min
        answer = a - b
        text = `${a} - ${b} = ?`
        break
      case 'multiplication':
        a = Math.floor(Math.random() * (max - min + 1)) + min
        b = Math.floor(Math.random() * (max - min + 1)) + min
        answer = a * b
        text = `${a} × ${b} = ?`
        break
      default:
        a = 1, b = 1, answer = 2, text = '1 + 1 = ?'
    }

    // 生成可视化项目
    for (let i = 0; i < answer; i++) {
      const emojis = ['🍎', '🍊', '🍓', '🍇', '🍒']
      items.push(emojis[Math.floor(Math.random() * emojis.length)])
    }

    return { text, items, answer }
  }
}

export const questionGenerator = new QuestionGenerator()