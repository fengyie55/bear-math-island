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
        <canvas ref="trendChart"></canvas>
      </div>
    </div>
    
    <!-- 游戏模式分析 -->
    <div class="mode-section">
      <h3>🎮 游戏模式分析</h3>
      <div class="mode-content">
        <div class="mode-chart">
          <canvas ref="modeChart"></canvas>
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
        <canvas ref="timeChart"></canvas>
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

<script>
import StorageManager from '../utils/storage'
import { Chart } from 'chart.js/auto'

export default {
  name: 'ParentMonitor',
  
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      userData: null,
      trendChart: null,
      modeChart: null,
      timeChart: null,
      timeRange: '7',
      difficultyLevel: 'all',
      questionType: 'all'
    }
  },
  
  computed: {
    correctRate() {
      const totalQuestions = this.userData?.stats?.totalQuestions || 0
      const correctCount = this.userData?.stats?.totalCorrect || 0
      
      if (totalQuestions === 0) return 0
      return Math.round((correctCount / totalQuestions) * 100)
    },
    
    averageScore() {
      const totalGames = this.userData?.stats?.totalGames || 0
      const totalScore = this.userData?.stats?.totalScore || 0
      
      if (totalGames === 0) return 0
      return Math.round(totalScore / totalGames)
    },
    
    lastUpdate() {
      const lastActivity = this.userData?.lastActivity || new Date()
      return new Date(lastActivity).toLocaleString('zh-CN')
    },
    
    modeAnalysis() {
      const gameHistory = this.userData?.gameHistory || []
      
      const modeStats = {
        addition: { name: '加法运算', games: 0, correct: 0 },
        subtraction: { name: '减法运算', games: 0, correct: 0 },
        multiplication: { name: '乘法运算', games: 0, correct: 0 },
        division: { name: '除法运算', games: 0, correct: 0 },
        comparison: { name: '比较大小', games: 0, correct: 0 },
        matching: { name: '数字匹配', games: 0, correct: 0 }
      }
      
      gameHistory.forEach(game => {
        const modeKey = game.gameType || 'other'
        if (modeStats[modeKey]) {
          modeStats[modeKey].games++
          if (game.isCorrect) {
            modeStats[modeKey].correct++
          }
        }
      })
      
      return Object.values(modeStats)
        .filter(mode => mode.games > 0)
        .map(mode => ({
          ...mode,
          accuracy: mode.games > 0 ? Math.round((mode.correct / mode.games) * 100) : 0
        }))
        .sort((a, b) => b.games - a.games)
    },
    
    learningSuggestions() {
      const suggestions = []
      
      // 基于正确率的建议
      if (this.correctRate < 60) {
        suggestions.push({
          title: '需要加强基础练习',
          content: '孩子的正确率较低，建议多进行基础题目的练习，重点强化薄弱环节。',
          priority: 'high'
        })
      } else if (this.correctRate < 80) {
        suggestions.push({
          title: '继续提升正确率',
          content: '孩子的正确率还有提升空间，建议针对错题进行专项练习。',
          priority: 'medium'
        })
      }
      
      // 基于连胜记录的建议
      if (this.userData?.stats?.currentStreak < 3) {
        suggestions.push({
          title: '保持学习连续性',
          content: '当前连胜记录较短，建议鼓励孩子每天坚持学习，形成良好的学习习惯。',
          priority: 'medium'
        })
      } else if (this.userData?.stats?.currentStreak >= 7) {
        suggestions.push({
          title: '优秀的学习习惯',
          content: '孩子已经保持了良好的学习连续性，继续保持！',
          priority: 'low'
        })
      }
      
      // 基于游戏次数的建议
      if (this.userData?.stats?.totalGames < 20) {
        suggestions.push({
          title: '增加学习频率',
          content: '学习次数较少，建议每天安排15-20分钟的学习时间，循序渐进地积累知识。',
          priority: 'low'
        })
      }
      
      // 基于学习时间的建议
      if (this.totalStudyTime < 120) {
        suggestions.push({
          title: '增加学习时间',
          content: '总学习时间较短，建议每天保证至少15分钟的学习时间。',
          priority: 'medium'
        })
      }
      
      return suggestions
    },
    
    totalStudyTime() {
      return this.userData?.stats?.totalStudyTime || 0
    },
    
    todayStudyTime() {
      const today = new Date().toDateString()
      const gameHistory = this.userData?.gameHistory || []
      const todayGames = gameHistory.filter(game => {
        const gameDate = new Date(game.timestamp).toDateString()
        return gameDate === today
      })
      return todayGames.length * 5 // 假设每局游戏5分钟
    },
    
    weeklyQuestions() {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const gameHistory = this.userData?.gameHistory || []
      const weeklyGames = gameHistory.filter(game => {
        const gameDate = new Date(game.timestamp)
        return gameDate >= oneWeekAgo
      })
      return weeklyGames.length
    },
    
    dailyTimeProgress() {
      const target = 15
      const progress = (this.todayStudyTime / target) * 100
      return Math.min(progress, 100)
    },
    
    weeklyQuestionProgress() {
      const target = 100
      const progress = (this.weeklyQuestions / target) * 100
      return Math.min(progress, 100)
    }
  },
  
  created() {
    this.loadUserData()
  },
  
  mounted() {
    this.initCharts()
  },
  
  beforeUnmount() {
    if (this.trendChart) {
      this.trendChart.destroy()
    }
    if (this.modeChart) {
      this.modeChart.destroy()
    }
    if (this.timeChart) {
      this.timeChart.destroy()
    }
  },
  
  methods: {
    loadUserData() {
      this.userData = this.currentUser
    },
    
    initCharts() {
      this.initTrendChart()
      this.initModeChart()
      this.initTimeChart()
    },
    
    initTrendChart() {
      const ctx = this.$refs.trendChart?.getContext('2d')
      if (!ctx) return
      
      const weeklyData = this.getWeeklyData()
      
      this.trendChart = new Chart(ctx, {
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
    },
    
    initModeChart() {
      const ctx = this.$refs.modeChart?.getContext('2d')
      if (!ctx) return
      
      const modeData = this.modeAnalysis
      
      this.modeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: modeData.map(mode => mode.name),
          datasets: [{
            data: modeData.map(mode => mode.games),
            backgroundColor: [
              'rgba(102, 126, 234, 0.8)',
              'rgba(82, 196, 26, 0.8)',
              'rgba(255, 193, 7, 0.8)',
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 159, 64, 0.8)'
            ],
            borderColor: [
              'rgba(102, 126, 234, 1)',
              'rgba(82, 196, 26, 1)',
              'rgba(255, 193, 7, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 159, 64, 1)'
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
    },
    
    initTimeChart() {
      const ctx = this.$refs.timeChart?.getContext('2d')
      if (!ctx) return
      
      const timeData = this.getTimeDistributionData()
      
      this.timeChart = new Chart(ctx, {
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
    },
    
    getWeeklyData() {
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
        
        // 模拟数据（实际项目中应从API获取）
        const dayGames = Math.floor(Math.random() * 10)
        const dayQuestions = Math.floor(Math.random() * 50)
        const dayAccuracy = Math.floor(Math.random() * 50) + 50
        
        games.push(dayGames)
        questions.push(dayQuestions)
        accuracy.push(dayAccuracy)
      }
      
      return { labels, games, questions, accuracy }
    },
    
    getTimeDistributionData() {
      const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const data = labels.map(() => Math.floor(Math.random() * 30) + 5)
      return { labels, data }
    },
    
    getPriorityText(priority) {
      const priorityMap = {
        high: '📌 高优先级',
        medium: '⚠️ 中等优先级',
        low: 'ℹ️ 低优先级'
      }
      
      return priorityMap[priority] || 'ℹ️ 未知'
    },
    
    exportData() {
      const exportData = StorageManager.exportUserData(this.currentUser.id)
      
      const report = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        userInfo: {
          id: exportData.id,
          username: exportData.username,
          avatar: exportData.avatar,
          stats: exportData.stats,
          preferences: exportData.preferences
        },
        learningTrend: this.getWeeklyData(),
        modeAnalysis: this.modeAnalysis,
        timeDistribution: this.getTimeDistributionData(),
        suggestions: this.learningSuggestions
      }
      
      const dataStr = JSON.stringify(report, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = `学习报告_${exportData.username}_${new Date().toISOString().split('T')[0]}.json`
      downloadLink.click()
      
      URL.revokeObjectURL(url)
    },
    
    resetData() {
      if (confirm('确定要重置所有学习数据吗？此操作不可恢复！')) {
        StorageManager.clearAllData()
        this.$emit('reset-data')
      }
    }
  }
}
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
