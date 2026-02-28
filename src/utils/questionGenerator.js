// 生成加法问题
const generateAdditionQuestion = (difficulty = 1) => {
  const max = 10 * difficulty
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  const answer = a + b
  const question = `${a} + ${b} = ?`
  
  return {
    question,
    answer,
    visualAid: generateVisualAid(answer)
  }
}

// 生成减法问题
const generateSubtractionQuestion = (difficulty = 1) => {
  const max = 10 * difficulty
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * a) + 1
  const answer = a - b
  const question = `${a} - ${b} = ?`
  
  return {
    question,
    answer,
    visualAid: generateVisualAid(answer)
  }
}

// 生成乘法问题
const generateMultiplicationQuestion = (difficulty = 1) => {
  const max = 5 * difficulty
  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  const answer = a * b
  const question = `${a} × ${b} = ?`
  
  return {
    question,
    answer,
    visualAid: generateVisualAid(answer)
  }
}

// 生成除法问题
const generateDivisionQuestion = (difficulty = 1) => {
  const max = 5 * difficulty
  const b = Math.floor(Math.random() * max) + 1
  const a = b * (Math.floor(Math.random() * max) + 1)
  const answer = a / b
  const question = `${a} ÷ ${b} = ?`
  
  return {
    question,
    answer,
    visualAid: generateVisualAid(answer)
  }
}

// 生成视觉辅助
const generateVisualAid = (answer) => {
  // 这里可以返回一个基于答案的视觉辅助，比如图片 URL 或 emoji 数组
  // 暂时返回 null，实际项目中可以根据需要实现
  return null
}

// 生成问题的主函数
export const generateQuestion = (topic, difficulty = 1) => {
  switch (topic) {
    case 'addition':
      return generateAdditionQuestion(difficulty)
    case 'subtraction':
      return generateSubtractionQuestion(difficulty)
    case 'multiplication':
      return generateMultiplicationQuestion(difficulty)
    case 'division':
      return generateDivisionQuestion(difficulty)
    default:
      // 对于冒险模式的岛屿，根据岛屿 ID 生成相应难度的问题
      const islandDifficulty = parseInt(topic) || 1
      const operations = ['addition', 'subtraction', 'multiplication']
      const randomOperation = operations[Math.floor(Math.random() * operations.length)]
      
      switch (randomOperation) {
        case 'addition':
          return generateAdditionQuestion(islandDifficulty)
        case 'subtraction':
          return generateSubtractionQuestion(islandDifficulty)
        case 'multiplication':
          return generateMultiplicationQuestion(islandDifficulty)
        default:
          return generateAdditionQuestion(islandDifficulty)
      }
  }
}
