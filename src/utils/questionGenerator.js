// 题目生成器模块
export class QuestionGenerator {
  constructor() {
    this.questions = {
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

    this.adventureQuestions = {
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
  }

  // 生成练习模式题目
  generatePracticeQuestion(level) {
    const levelQuestions = this.questions[level] || this.questions['5以内加法']
    const randomQuestion = levelQuestions[Math.floor(Math.random() * levelQuestions.length)]
    
    return {
      text: randomQuestion.text,
      items: randomQuestion.items,
      answer: randomQuestion.answer,
      options: this.generateOptions(randomQuestion.answer)
    }
  }

  // 生成冒险模式题目
  generateAdventureQuestion(areaId) {
    const areaQuestions = this.adventureQuestions[areaId] || this.adventureQuestions['orchard']
    const randomQuestion = areaQuestions[Math.floor(Math.random() * areaQuestions.length)]
    
    return {
      text: randomQuestion.text,
      items: randomQuestion.items,
      answer: randomQuestion.answer,
      options: this.generateOptions(randomQuestion.answer)
    }
  }

  // 生成选项
  generateOptions(correctAnswer) {
    const options = [correctAnswer]
    while (options.length < 4) {
      let randomNum
      if (correctAnswer > 10) {
        // 对于较大的数字，生成更接近的选项
        randomNum = Math.floor(Math.random() * 10) + (correctAnswer - 5)
      } else {
        randomNum = Math.floor(Math.random() * 10)
      }
      if (!options.includes(randomNum)) {
        options.push(randomNum)
      }
    }
    return options.sort((a, b) => a - b)
  }

  // 获取所有练习模式类型
  getPracticeLevels() {
    return Object.keys(this.questions)
  }

  // 获取冒险模式区域
  getAdventureAreas() {
    return Object.keys(this.adventureQuestions)
  }

  // 动态生成题目（根据难度）
  generateDynamicQuestion(difficulty) {
    let level
    switch (difficulty) {
      case 'easy':
        level = '5以内加法'
        break
      case 'medium':
        level = '10以内加法'
        break
      case 'hard':
        level = '10以内混合运算'
        break
      default:
        level = '5以内加法'
    }
    return this.generatePracticeQuestion(level)
  }
}

// 导出单例
export const questionGenerator = new QuestionGenerator()