<template>
  <div class="practice-screen">
    <div class="mode-content-header">
      <div class="back-button" @click="backToMain">← 返回首页</div>
      <div class="mode-content-title">📚 练习模式</div>
      <div class="empty-space"></div>
    </div>

    <div class="practice-level-selection">
      <div class="practice-level" @click="selectPracticeLevel('5以内加法')">
        <div class="practice-level-icon">🍎</div>
        <div class="practice-level-title">5以内加法</div>
        <div class="practice-level-difficulty">⭐ 简单</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('5以内减法')">
        <div class="practice-level-icon">🍊</div>
        <div class="practice-level-title">5以内减法</div>
        <div class="practice-level-difficulty">⭐ 简单</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('5以内混合运算')">
        <div class="practice-level-icon">🍓</div>
        <div class="practice-level-title">5以内混合运算</div>
        <div class="practice-level-difficulty">⭐⭐ 中等</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('10以内加法')">
        <div class="practice-level-icon">🍇</div>
        <div class="practice-level-title">10以内加法</div>
        <div class="practice-level-difficulty">⭐⭐ 中等</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('10以内减法')">
        <div class="practice-level-icon">🍒</div>
        <div class="practice-level-title">10以内减法</div>
        <div class="practice-level-difficulty">⭐⭐ 中等</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('10以内混合运算')">
        <div class="practice-level-icon">🍉</div>
        <div class="practice-level-title">10以内混合运算</div>
        <div class="practice-level-difficulty">⭐⭐⭐ 困难</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('乘法表')">
        <div class="practice-level-icon">✖️</div>
        <div class="practice-level-title">乘法表</div>
        <div class="practice-level-difficulty">⭐⭐ 中等</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('数字认识')">
        <div class="practice-level-icon">🔢</div>
        <div class="practice-level-title">数字认识</div>
        <div class="practice-level-difficulty">⭐ 简单</div>
      </div>
      
      <div class="practice-level" @click="selectPracticeLevel('比较大小')">
        <div class="practice-level-icon">📏</div>
        <div class="practice-level-title">比较大小</div>
        <div class="practice-level-difficulty">⭐⭐ 中等</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PracticeScreen',
  emits: ['back-to-main', 'select-practice-level'],
  setup(props, { emit }) {
    const backToMain = () => {
      emit('back-to-main')
    }

    const selectPracticeLevel = (level) => {
      emit('select-practice-level', level)
    }

    return {
      backToMain,
      selectPracticeLevel
    }
  }
}
</script>

<style scoped>
.practice-screen {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.practice-screen .mode-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 0 20px;
}

.practice-screen .mode-content-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.back-button {
  background: rgba(255,255,255,0.1);
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-button:hover {
  background: rgba(255,255,255,0.2);
}

.empty-space {
  width: 80px; /* 占位空间，使标题居中 */
}

.practice-level-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.practice-level {
  background: rgba(255,255,255,0.1);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.practice-level:hover {
  background: rgba(255,255,255,0.15);
  transform: translateY(-5px);
}

.practice-level-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.practice-level-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.practice-level-difficulty {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
  background: rgba(255,255,255,0.1);
  padding: 5px 15px;
  border-radius: 15px;
  display: inline-block;
}

@media (max-width: 768px) {
  .practice-level-selection {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}
</style>