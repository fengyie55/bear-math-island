<template>
  <div class="parent-monitor">
    <div class="monitor-header">
      <h2>📊 家长监控系统</h2>
      <div class="monitor-date">
        <span>数据更新时间: {{ lastUpdate }}</span>
      </div>
    </div>
    
    <!-- 数据筛选 -->
    <div class="filter-section">
      <h3>🔍 数据筛选</h3>
      <div class="filter-controls">
        <div class="filter-item">
          <label>时间范围：</label>
          <select v-model="timeRange">
            <option value="7">最近7天</option>
            <option value="30">最近30天</option>
            <option value="90">最近90天</option>
            <option value="all">全部</option>
          </select>
        </div>
        <div class="filter-item">
          <label>难度级别：</label>
          <select v-model="difficultyLevel">
            <option value="all">全部</option>
            <option value="easy">简单</option>
            <option value="medium">中等</option>
            <option value="hard">困难</option>
          </select>
        </div>
        <div class="filter-item">
          <label>题型：</label>
          <select v-model="questionType">
            <option value="all">全部</option>
            <option value="addition">加法</option>
            <option value="subtraction">减法</option>
            <option value="multiplication">乘法</option>
            <option value="division">除法</option>
            <option value="comparison">比较大小</option>
            <option value="matching">数字匹配</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 学习统计 -->
    <div class="stats-section">
      <h3>📈 学习统计</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ userData.stats.totalGames || 0 }}</div>
          <div class="stat-label">完成游戏</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userData.stats.totalQuestions || 0 }}</div>
          <div class="stat-label">答题数量</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ correctRate }}%</div>
          <div class="stat-label">正确率</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userData.stats.currentStreak || 0 }}</div>
          <div class="stat-label">当前连胜</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userData.stats.bestStreak || 0 }}</div>
          <div class="stat-label">最佳连胜</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ averageScore }}</div>
          <div class="stat-label">平均得分</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalStudyTime }}分钟</div>
          <div class="stat-label">总学习时间</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userData.stats.achievements || 0 }}</div>
          <div class="stat-label">解锁成就</div>
        </div>
      </div>
    </div>
    
    <!-- 学习趋势 -->
    <div class="trend-section">
      <h3>📉 学习趋势</h3>
      <div class="trend-chart">
        <canvas id="trendChart"></canvas>
      </div>
    </div>
    
    <!-- 游戏模式分析 -->
    <div class="mode-section">
      <h3>🎮 游戏模式分析</h3>
      <div class="mode-content">
        <div class="mode-chart">
          <canvas id="modeChart"></canvas>
        </div>
        <div class="mode-analysis">
          <div class="mode-item" v-for="(mode, index) in modeAnalysis" :key="index">
            <div class="mode-name">{{ mode.name }}</div>
            <div class="mode-stats">
              <div class="mode-value">{{ mode.games }}</div>
              <div class="mode-label">游戏次数</div>
            </div>
            <div class="mode-stats">
              <div class="mode-value">{{ mode.correct }}</div>
              <div class="mode-label">正确答案</div>
            </div>
            <div class="mode-stats">
              <div class="mode-value">{{ mode.accuracy }}%</div>
              <div class="mode-label">正确率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习时间分布 -->
    <div class="time-section">
      <h3>⏰ 学习时间分布</h3>
      <div class="time-chart">
        <canvas id="timeChart"></canvas>
      </div>
    </div>
    
    <!-- 学习目标 -->
    <div class="goal-section">
      <h3>🎯 学习目标</h3>
      <div class="goal-content">
        <div class="goal-item">
          <div class="goal-title">每日学习时间</div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: dailyTimeProgress + '%' }"></div>
            </div>
            <div class="progress-text">{{ todayStudyTime }}/15分钟</div>
          </div>
        </div>
        <div class="goal-item">
          <div class="goal-title">本周答题数量</div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: weeklyQuestionProgress + '%' }"></div>
            </div>
            <div class="progress-text">{{ weeklyQuestions }}/100题</div>
          </div>
        </div>
        <div class="goal-item">
          <div class="goal-title">正确率目标</div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: correctRate + '%' }"></div>
            </div>
            <div class="progress-text">{{ correctRate }}/80%</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 技能分析 -->
    <div class="skill-section">
      <h3>🎯 技能分析</h3>
      <div class="skill-content">
        <div class="skill-item">
          <div class="skill-title">擅长领域</div>
          <div class="skill-tags">
            <span 
              class="skill-tag strong" 
              v-for="(area, index) in strongAreas" 
              :key="index"
            >
              {{ getAreaName(area) }}
            </span>
            <span v-if="strongAreas.length === 0" class="skill-tag empty">暂无数据</span>
          </div>
        </div>
        <div class="skill-item">
          <div class="skill-title">薄弱环节</div>
          <div class="skill-tags">
            <span 
              class="skill-tag weak" 
              v-for="(area, index) in weakAreas" 
              :key="index"
            >
              {{ getAreaName(area) }}
            </span>
            <span v-if="weakAreas.length === 0" class="skill-tag empty">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习建议 -->
    <div class="suggestion-section">
      <h3>💡 学习建议</h3>
      <div class="suggestions">
        <div 
          class="suggestion-item" 
          v-for="(suggestion, index) in learningSuggestions" 
          :key="index"
          :class="{ high: suggestion.priority === 'high', medium: suggestion.priority === 'medium', low: suggestion.priority === 'low' }"
        >
          <div class="suggestion-title">{{ suggestion.title }}</div>
          <div class="suggestion-content">{{ suggestion.content }}</div>
          <div class="suggestion-priority">{{ getPriorityText(suggestion.priority) }}</div>
        </div>
      </div>
    </div>
    
    <!-- 数据导出 -->
    <div class="export-section">
      <h3>📊 数据导出</h3>
      <div class="export-actions">
        <button class="btn-export" @click="exportData">📥 导出学习报告</button>
        <button class="btn-reset" @click="resetData">🔄 重置数据</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'
import { useGameStore } from '../stores/gameStore'
import { Chart } from 'chart.js/auto'

const settings = useSettingsStore()
const game = useGameStore()

const trendChart = ref(null)
const modeChart = ref(null)
const timeChart = ref(null)
const timeRange = ref('7')
const difficultyLevel = ref('all')
const questionType = ref('all')

// 计算属性
const correctRate = computed(() => {
  return settings.overallAccuracy
})

const averageScore = computed(() => {
  return settings.averagePlayTime
})

const lastUpdate = computed(() => {
  return new Date().toLocaleString('zh-CN')
})

const modeAnalysis = computed(() => {
  const modeStats = {
    addition: { name: '加法运算', games: 0, correct: 0 },
    subtraction: { name: '减法运算', games: 0, correct: 0 },
    multiplication: { name: '乘法运算', games: 0, correct: 0 },
    division: { name: '除法运算', games: 0, correct: 0 }
  }
  
  // 这里可以根据实际的游戏历史数据进行统计
  // 暂时使用模拟数据
  Object.keys(modeStats).forEach(key => {
    modeStats[key].games = Math.floor(Math.random() * 50) + 10
    modeStats[key].correct = Math.floor(modeStats[key].games * (Math.random() * 0.5 + 0.5))
  })
  
  return Object.values(modeStats)
    .map(mode => ({
      ...mode,
      accuracy: mode.games > 0 ? Math.round((mode.correct / mode.games) * 100) : 0
    }))
    .sort((a, b) => b.games - a.games)
})

const learningSuggestions = computed(() => {
  const suggestions = []
  
  // 基于正确率的建议
  if (correctRate.value < 60) {
    suggestions.push({
      title: '需要加强基础练习',
      content: '孩子的正确率较低，建议多进行基础题目的练习，重点强化薄弱环节。',
      priority: 'high'
    })
  } else if (correctRate.value < 80) {
    suggestions.push({
      title: '继续提升正确率',
      content: '孩子的正确率还有提升空间，建议针对错题进行专项练习。',
      priority: 'medium'
    })
  }
  
  // 基于学习时间的建议
  if (settings.totalPlayTime < 120) {
    suggestions.push({
      title: '增加学习时间',
      content: '总学习时间较短，建议每天保证至少15分钟的学习时间。',
      priority: 'medium'
    })
  }
  
  // 基于游戏次数的建议
  if (settings.totalGamesPlayed < 20) {
    suggestions.push({
      title: '增加学习频率',
      content: '学习次数较少，建议每天安排15-20分钟的学习时间，循序渐进地积累知识。',
      priority: 'low'
    })
  }
  
  return suggestions
})

const totalStudyTime = computed(() => {
  return settings.totalPlayTime
})

const todayStudyTime = computed(() => {
  return settings.todayPlayTime
})

const weeklyQuestions = computed(() => {
  // 这里可以根据实际的游戏历史数据进行统计
  // 暂时使用模拟数据
  return Math.floor(Math.random() * 100) + 50
})

const dailyTimeProgress = computed(() => {
  const target = 15
  const progress = (todayStudyTime.value / target) * 100
  return Math.min(progress, 100)
})

const weeklyQuestionProgress = computed(() => {
  const target = 100
  const progress = (weeklyQuestions.value / target) * 100
  return Math.min(progress, 100)
})

// 方法
const initCharts = () => {
  initTrendChart()
  initModeChart()
  initTimeChart()
}

const initTrendChart = () => {
  const ctx = document.getElementById('trendChart')?.getContext('2d')
  if (!ctx) return
  
  const weeklyData = getWeeklyData()
  
  trendChart.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weeklyData.labels,
      datasets: [
        {
          label: '每日游戏次数',
          data: weeklyData.games,
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: '每日答题数量',
          data: weeklyData.questions,
          borderColor: 'rgb(82, 196, 26)',
          backgroundColor: 'rgba(82, 196, 26, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        },
        {
          label: '每日正确率',
          data: weeklyData.accuracy,
          borderColor: 'rgb(255, 193, 7)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5,
          yAxisID: 'y2'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: '最近7天学习趋势',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '数量'
          }
        },
        y2: {
          beginAtZero: true,
          position: 'right',
          title: {
            display: true,
            text: '正确率 (%)'
          },
          max: 100
        },
        x: {
          title: {
            display: true,
            text: '日期'
          }
        }
      }
    }
  })
}

const initModeChart = () => {
  const ctx = document.getElementById('modeChart')?.getContext('2d')
  if (!ctx) return
  
  const modeData = modeAnalysis.value
  
  modeChart.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: modeData.map(mode => mode.name),
      datasets: [{
        data: modeData.map(mode => mode.games),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(82, 196, 26, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(82, 196, 26, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '游戏模式分布',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

const initTimeChart = () => {
  const ctx = document.getElementById('timeChart')?.getContext('2d')
  if (!ctx) return
  
  const timeData = getTimeDistributionData()
  
  timeChart.value = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: timeData.labels,
      datasets: [{
        label: '学习时间（分钟）',
        data: timeData.data,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '每日学习时间分布',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: '时间（分钟）'
          }
        },
        x: {
          title: {
            display: true,
            text: '星期'
          }
        }
      }
    }
  })
}

const getWeeklyData = () => {
  const labels = []
  const games = []
  const questions = []
  const accuracy = []
  
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    const dateStr = date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
    
    labels.push(dateStr)
    
    // 模拟数据
    const dayGames = Math.floor(Math.random() * 10)
    const dayQuestions = Math.floor(Math.random() * 50)
    const dayAccuracy = Math.floor(Math.random() * 50) + 50
    
    games.push(dayGames)
    questions.push(dayQuestions)
    accuracy.push(dayAccuracy)
  }
  
  return { labels, games, questions, accuracy }
}

const getTimeDistributionData = () => {
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const data = labels.map(() => Math.floor(Math.random() * 30) + 5)
  return { labels, data }
}

const getPriorityText = (priority) => {
  const priorityMap = {
    high: '📌 高优先级',
    medium: '⚠️ 中等优先级',
    low: 'ℹ️ 低优先级'
  }
  
  return priorityMap[priority] || 'ℹ️ 未知'
}

const exportData = () => {
  const report = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    userInfo: {
      stats: {
        totalPlayTime: settings.totalPlayTime,
        totalGamesPlayed: settings.totalGamesPlayed,
        totalCorrectAnswers: settings.totalCorrectAnswers,
        totalQuestionsAnswered: settings.totalQuestionsAnswered,
        overallAccuracy: settings.overallAccuracy
      }
    },
    learningTrend: getWeeklyData(),
    modeAnalysis: modeAnalysis.value,
    timeDistribution: getTimeDistributionData(),
    suggestions: learningSuggestions.value
  }
  
  const dataStr = JSON.stringify(report, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = `学习报告_${new Date().toISOString().split('T')[0]}.json`
  downloadLink.click()
  
  URL.revokeObjectURL(url)
}

const resetData = () => {
  if (confirm('确定要重置所有学习数据吗？此操作不可恢复！')) {
    settings.resetSettings()
    game.resetGame()
  }
}

// 生命周期钩子
onMounted(() => {
  initCharts()
})

onBeforeUnmount(() => {
  if (trendChart.value) {
    trendChart.value.destroy()
  }
  if (modeChart.value) {
    modeChart.value.destroy()
  }
  if (timeChart.value) {
    timeChart.value.destroy()
  }
})
</script>

<style scoped>
.parent-monitor {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.monitor-header h2 {
  font-size: 1.5rem;
  color: #667eea;
  margin: 0;
}

.monitor-date {
  font-size: 0.9rem;
  color: #666;
}

.filter-section,
.stats-section,
.trend-section,
.mode-section,
.time-section,
.goal-section,
.skill-section,
.suggestion-section,
.export-section {
  margin-bottom: 30px;
}

.filter-section h3,
.stats-section h3,
.trend-section h3,
.mode-section h3,
.time-section h3,
.goal-section h3,
.skill-section h3,
.suggestion-section h3,
.export-section h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-controls {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  background: rgba(102, 126, 234, 0.05);
  padding: 15px;
  border-radius: 12px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 0.9rem;
  color: #666;
}

.filter-item select {
  padding: 8px 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-card {
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.trend-chart {
  height: 300px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 10px;
}

.mode-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.mode-chart {
  height: 300px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 10px;
}

.mode-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.mode-item {
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
}

.mode-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.mode-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.mode-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.mode-value {
  font-weight: 700;
  color: #667eea;
}

.mode-label {
  font-size: 0.8rem;
  color: #666;
}

.time-chart {
  height: 300px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 10px;
}

.goal-content {
  display: grid;
  gap: 15px;
}

.goal-item {
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 15px;
}

.goal-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  min-width: 100px;
  text-align: right;
}

.suggestions {
  display: grid;
  gap: 15px;
}

.suggestion-item {
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 15px;
  transition: all 0.3s ease;
  border-left: 4px solid #667eea;
}

.suggestion-item.high {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.3);
  border-left-color: #ef4444;
}

.suggestion-item.medium {
  background: rgba(255, 193, 7, 0.05);
  border-color: rgba(255, 193, 7, 0.3);
  border-left-color: #ffc107;
}

.suggestion-item.low {
  background: rgba(82, 196, 26, 0.05);
  border-color: rgba(82, 196, 26, 0.3);
  border-left-color: #52c41a;
}

.suggestion-item:hover {
  transform: translateX(2px);
}

.suggestion-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.suggestion-content {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.4;
}

.suggestion-priority {
  font-size: 0.8rem;
  color: #666;
}

.export-actions {
  display: flex;
  gap: 15px;
}

.btn-export,
.btn-reset {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-export {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-export:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-reset {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-reset:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.skill-content {
  display: grid;
  gap: 20px;
}

.skill-item {
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 15px;
}

.skill-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
}

.skill-tag.strong {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
  border: 1px solid rgba(82, 196, 26, 0.2);
}

.skill-tag.weak {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.skill-tag.empty {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.2);
}

@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }
  
  .mode-content {
    grid-template-columns: 1fr;
  }
  
  .mode-analysis {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .goal-progress {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .progress-text {
    text-align: left;
  }
  
  .export-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .btn-export,
  .btn-reset {
    width: 100%;
  }
}
</style>
