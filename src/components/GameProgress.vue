<template>
  <div class="game-progress">
    <div class="progress-header">
      <h3>学习进度</h3>
      <div class="progress-info">
        <span>当前阶段: {{ currentStage }}</span>
        <span>完成度: {{ completionRate }}%</span>
      </div>
    </div>
    
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        :style="{ width: completionRate + '%' }"
        :class="{ 'completed': completionRate >= 100 }"
      >
        <div class="progress-fill"></div>
      </div>
    </div>
    
    <div class="milestones">
      <div 
        v-for="milestone in milestones" 
        :key="milestone.id"
        class="milestone"
        :class="{ 'completed': milestone.completed, 'active': milestone.active }"
      >
        <div class="milestone-icon">{{ milestone.icon }}</div>
        <div class="milestone-title">{{ milestone.title }}</div>
        <div class="milestone-progress">
          <div 
            class="milestone-progress-bar"
            :style="{ width: milestone.progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameProgress',
  
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  
  computed: {
    currentStage() {
      const completedGames = this.currentUser.stats?.totalGames || 0
      
      if (completedGames < 10) return '启蒙阶段'
      if (completedGames < 30) return '初级阶段'
      if (completedGames < 60) return '中级阶段'
      if (completedGames < 100) return '高级阶段'
      return '大师阶段'
    },
    
    completionRate() {
      const completedGames = this.currentUser.stats?.totalGames || 0
      const totalQuestions = this.currentUser.stats?.totalQuestions || 0
      
      const gameRate = Math.min((completedGames / 100) * 100, 100)
      const questionRate = totalQuestions > 0 ? Math.min((totalQuestions / 500) * 100, 100) : 0
      
      return Math.round((gameRate + questionRate) / 2)
    },
    
    milestones() {
      const completedGames = this.currentUser.stats?.totalGames || 0
      const currentStreak = this.currentUser.stats?.currentStreak || 0
      
      return [
        {
          id: 1,
          title: '启蒙学习',
          icon: '🎓',
          progress: Math.min(completedGames * 10, 100),
          completed: completedGames >= 10,
          active: completedGames < 10
        },
        {
          id: 2,
          title: '初级挑战',
          icon: '🏆',
          progress: completedGames >= 10 ? Math.min((completedGames - 10) * 3.33, 100) : 0,
          completed: completedGames >= 30,
          active: completedGames >= 10 && completedGames < 30
        },
        {
          id: 3,
          title: '中级精通',
          icon: '🌟',
          progress: completedGames >= 30 ? Math.min((completedGames - 30) * 2.5, 100) : 0,
          completed: completedGames >= 60,
          active: completedGames >= 30 && completedGames < 60
        },
        {
          id: 4,
          title: '高级专家',
          icon: '👑',
          progress: completedGames >= 60 ? Math.min((completedGames - 60) * 2.5, 100) : 0,
          completed: completedGames >= 100,
          active: completedGames >= 60 && completedGames < 100
        },
        {
          id: 5,
          title: '数学大师',
          icon: '💎',
          progress: completedGames >= 100 ? Math.min((completedGames - 100) * 2, 100) : 0,
          completed: completedGames >= 150,
          active: completedGames >= 100 && completedGames < 150
        }
      ]
    }
  }
}
</script>

<style scoped>
.game-progress {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.progress-header h3 {
  font-size: 1.5rem;
  color: #667eea;
  margin: 0;
}

.progress-info {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #666;
}

.progress-bar-container {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 25px;
  height: 20px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: width 0.5s ease;
}

.progress-bar.completed {
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.milestones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.milestone {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.milestone:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
}

.milestone.active {
  background: rgba(102, 126, 234, 0.1);
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.milestone.completed {
  background: rgba(82, 196, 26, 0.05);
  border: 2px solid rgba(82, 196, 26, 0.3);
}

.milestone-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.milestone-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.milestone-progress {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  height: 8px;
  overflow: hidden;
}

.milestone-progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.milestone.completed .milestone-progress-bar {
  background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
}

@media (max-width: 768px) {
  .milestones {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .milestone {
    padding: 10px;
  }
  
  .milestone-icon {
    font-size: 1.5rem;
  }
  
  .milestone-title {
    font-size: 0.8rem;
  }
}
</style>
