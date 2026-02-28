<template>
  <div class="game-ui-container" :class="{ 'eye-protection': eyeProtectionEnabled }">

    <!-- ========== 主界面 ========== -->
    <div v-if="currentScreen === 'main'" class="main-screen">
      <div class="game-header">
        <div class="bear-mascot">🐻</div>
        <div class="game-title">小熊的海岛大冒险</div>
        <div class="game-subtitle">帮小熊收集魔法星星，修复海岛！✨</div>
      </div>

      <div class="mode-selection">
        <div class="mode-card" @click="selectMode('adventure')">
          <div class="mode-icon">🏝️</div>
          <div class="mode-title">冒险模式</div>
          <div class="mode-description">适合3-4岁<br/>解锁海岛，边玩边学</div>
        </div>
        <div class="mode-card" @click="selectMode('practice')">
          <div class="mode-icon">📚</div>
          <div class="mode-title">练习模式</div>
          <div class="mode-description">适合4-6岁<br/>直接答题，快速提升</div>
        </div>
      </div>

      <div class="player-stats-bar">
        <div class="stat-item">
          <span class="stat-icon">⭐</span>
          <span class="stat-value">{{ totalScore }}</span>
          <span class="stat-label">魔法星星</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🏆</span>
          <span class="stat-value">{{ completedAreas }}</span>
          <span class="stat-label">已解锁区域</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-value">{{ streakDays }}</span>
          <span class="stat-label">连续天数</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⏱️</span>
          <span class="stat-value">{{ remainingTime }}</span>
          <span class="stat-label">今日剩余</span>
        </div>
      </div>

      <div class="achievements-preview" v-if="unlockedAchievements.length > 0">
        <span class="achievements-label">我的成就：</span>
        <span v-for="a in unlockedAchievements.slice(0,6)" :key="a.id" class="ach-badge-mini">{{ a.icon }}</span>
      </div>

      <div class="main-actions">
        <div class="action-btn" @click="currentScreen = 'achievements'">🏅 成就</div>
        <div class="action-btn" @click="currentScreen = 'leaderboard'">📊 排行榜</div>
        <div class="action-btn" @click="currentScreen = 'parent'">👨‍👩‍👧 家长报告</div>
        <div class="action-btn" @click="showSettings = true">⚙️ 设置</div>
      </div>
    </div>

    <!-- ========== 冒险地图 ========== -->
    <div v-if="currentScreen === 'adventure'" class="adventure-screen">
      <div class="screen-header">
        <button class="back-btn" @click="currentScreen = 'main'">← 返回</button>
        <div class="screen-title">🏝️ 冒险模式</div>
        <div class="header-score">⭐ {{ totalScore }}</div>
      </div>
      <div class="island-map">
        <div
          class="island-area"
          v-for="area in islandMap.areas"
          :key="area.id"
          :class="{ unlocked: area.unlocked, locked: !area.unlocked, completed: area.completed }"
        >
          <div class="area-icon">{{ getAreaIcon(area.id) }}</div>
          <div class="area-name">{{ area.name }}</div>
          <div class="area-stars" v-if="area.unlocked">
            <span v-for="n in 3" :key="n">{{ n <= (area.stars || 0) ? '⭐' : '☆' }}</span>
          </div>
          <button class="start-button" v-if="area.unlocked" @click="startLevel(area.id)">
            {{ area.completed ? '再挑战 🔄' : '开始探索 🔍' }}
          </button>
          <div class="locked-text" v-else>🔒 待解锁</div>
        </div>
      </div>
    </div>

    <!-- ========== 练习选题 ========== -->
    <div v-if="currentScreen === 'practice'" class="practice-screen">
      <div class="screen-header">
        <button class="back-btn" @click="currentScreen = 'main'">← 返回</button>
        <div class="screen-title">📚 练习模式</div>
        <div class="header-score">⭐ {{ totalScore }}</div>
      </div>
      <div class="practice-categories">
        <div class="category-title">🔢 数字认识</div>
        <div class="practice-grid">
          <div class="practice-card" @click="selectPracticeLevel('数字认识1-5')">
            <div class="practice-icon">1️⃣</div>
            <div class="practice-name">认识1-5</div>
            <div class="practice-diff">⭐ 入门</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('数字认识1-10')">
            <div class="practice-icon">🔟</div>
            <div class="practice-name">认识1-10</div>
            <div class="practice-diff">⭐ 入门</div>
          </div>
        </div>

        <div class="category-title">➕ 加减法</div>
        <div class="practice-grid">
          <div class="practice-card" @click="selectPracticeLevel('5以内加法')">
            <div class="practice-icon">🍎</div>
            <div class="practice-name">5以内加法</div>
            <div class="practice-diff">⭐ 简单</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('5以内减法')">
            <div class="practice-icon">🍊</div>
            <div class="practice-name">5以内减法</div>
            <div class="practice-diff">⭐ 简单</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('5以内混合')">
            <div class="practice-icon">🍓</div>
            <div class="practice-name">5以内混合</div>
            <div class="practice-diff">⭐⭐ 中等</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('10以内加法')">
            <div class="practice-icon">🍇</div>
            <div class="practice-name">10以内加法</div>
            <div class="practice-diff">⭐⭐ 中等</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('10以内减法')">
            <div class="practice-icon">🍒</div>
            <div class="practice-name">10以内减法</div>
            <div class="practice-diff">⭐⭐ 中等</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('10以内混合')">
            <div class="practice-icon">🍉</div>
            <div class="practice-name">10以内混合</div>
            <div class="practice-diff">⭐⭐⭐ 困难</div>
          </div>
        </div>

        <div class="category-title">✖️ 乘法（进阶）</div>
        <div class="practice-grid">
          <div class="practice-card" @click="selectPracticeLevel('乘法2和3')">
            <div class="practice-icon">✖️</div>
            <div class="practice-name">2和3的乘法</div>
            <div class="practice-diff">⭐⭐⭐ 挑战</div>
          </div>
          <div class="practice-card" @click="selectPracticeLevel('乘法4和5')">
            <div class="practice-icon">🌟</div>
            <div class="practice-name">4和5的乘法</div>
            <div class="practice-diff">⭐⭐⭐ 挑战</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 游戏答题 ========== -->
    <div v-if="currentScreen === 'game'" class="game-screen">
      <div class="game-top-bar">
        <button class="back-btn" @click="backToMode">← 返回</button>
        <div class="question-counter">{{ currentQuestionIndex + 1 }} / {{ totalQuestionsPerLevel }}</div>
        <div class="current-score-display">{{ currentScore }} ⭐</div>
      </div>

      <div class="progress-track">
        <div class="progress-fill-bar" :style="{ width: progressPercentage + '%' }">
          <div class="progress-bear">🐻</div>
        </div>
      </div>

      <div class="question-card" :class="{ shake: showWrongShake }">
        <div class="question-text">{{ currentQuestion.text }}</div>

        <div class="question-visual" v-if="currentQuestion.items && currentQuestion.items.length > 0">
          <span v-for="(item, idx) in currentQuestion.items" :key="idx" class="q-item"
            :style="{ animationDelay: (idx * 0.06) + 's' }">{{ item }}</span>
        </div>

        <div class="number-display" v-if="currentQuestion.type === 'number'">
          <div class="big-number">{{ currentQuestion.displayNumber }}</div>
        </div>

        <button class="voice-btn" @click="playQuestionVoice">🔊 听一听</button>
      </div>

      <div class="answer-grid">
        <div
          v-for="(option, idx) in currentQuestion.options"
          :key="idx"
          class="answer-btn"
          :class="{
            selected: selectedOption === idx,
            'correct-ans': showFeedback && option === currentQuestion.answer,
            'wrong-ans': showFeedback && selectedOption === idx && option !== currentQuestion.answer
          }"
          @click="selectAnswer(option, idx)"
        >{{ option }}</div>
      </div>
    </div>

    <!-- ========== 反馈弹窗 ========== -->
    <transition name="pop">
      <div class="feedback-overlay" v-if="showFeedback">
        <div class="feedback-card" :class="isCorrect ? 'correct-card' : 'wrong-card'">
          <div class="feedback-emoji">{{ isCorrect ? correctEmoji : '😅' }}</div>
          <div class="feedback-title">{{ isCorrect ? correctTitle : '再想想！' }}</div>
          <div class="feedback-msg">{{ feedbackText }}</div>
          <div class="stars-earned" v-if="isCorrect">
            <span v-for="s in starsEarned" :key="s" class="star-pop">⭐</span>
          </div>
          <button class="next-btn" @click="nextQuestion">
            {{ isCorrect ? (currentQuestionIndex + 1 >= totalQuestionsPerLevel ? '查看结果 🎉' : '下一题 →') : '再试一次 💪' }}
          </button>
        </div>
      </div>
    </transition>

    <!-- ========== 完成弹窗 ========== -->
    <transition name="pop">
      <div class="completion-overlay" v-if="showCompletion">
        <div class="completion-card">
          <div class="completion-emoji">🏆</div>
          <div class="completion-title">太棒了，完成啦！</div>
          <div class="completion-stats">
            <div class="cstat">🌟 得分 <strong>{{ finalScore }}</strong></div>
            <div class="cstat">✅ 正确 <strong>{{ correctAnswers }}/{{ totalQuestionsPerLevel }}</strong></div>
            <div class="cstat">🎯 正确率 <strong>{{ Math.round((correctAnswers / totalQuestionsPerLevel) * 100) }}%</strong></div>
          </div>
          <div class="new-achievements" v-if="newlyUnlocked.length > 0">
            <div class="na-title">🎊 新成就解锁！</div>
            <div class="na-item" v-for="a in newlyUnlocked" :key="a.id">{{ a.icon }} {{ a.name }}</div>
          </div>
          <div class="completion-actions">
            <button class="action-primary" @click="continuePractice">🔄 继续练习</button>
            <button class="action-secondary" @click="backToPractice">← 返回菜单</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ========== 成就页面 ========== -->
    <div v-if="currentScreen === 'achievements'" class="achievements-screen">
      <div class="screen-header">
        <button class="back-btn" @click="currentScreen = 'main'">← 返回</button>
        <div class="screen-title">🏅 我的成就</div>
        <div>{{ unlockedAchievements.length }}/{{ allAchievements.length }}</div>
      </div>
      <div class="achievements-grid">
        <div
          class="achievement-card"
          v-for="ach in allAchievements"
          :key="ach.id"
          :class="{ unlocked: isAchievementUnlocked(ach.id), locked: !isAchievementUnlocked(ach.id) }"
        >
          <div class="ach-icon">{{ isAchievementUnlocked(ach.id) ? ach.icon : '🔒' }}</div>
          <div class="ach-name">{{ ach.name }}</div>
          <div class="ach-desc">{{ ach.desc }}</div>
        </div>
      </div>
    </div>

    <!-- ========== 排行榜 ========== -->
    <div v-if="currentScreen === 'leaderboard'" class="leaderboard-screen">
      <div class="screen-header">
        <button class="back-btn" @click="currentScreen = 'main'">← 返回</button>
        <div class="screen-title">📊 排行榜</div>
        <div></div>
      </div>
      <div class="leaderboard-list">
        <div class="lb-tabs">
          <div class="lb-tab" :class="{ active: lbTab === 'score' }" @click="lbTab = 'score'">总分榜</div>
          <div class="lb-tab" :class="{ active: lbTab === 'streak' }" @click="lbTab = 'streak'">连续天数</div>
          <div class="lb-tab" :class="{ active: lbTab === 'accuracy' }" @click="lbTab = 'accuracy'">正确率</div>
        </div>
        <div class="lb-my-rank">
          <div class="my-rank-label">⬇ 我的成绩</div>
          <div class="lb-row highlight-row">
            <div class="lb-rank">🐻</div>
            <div class="lb-name">{{ playerName }}</div>
            <div class="lb-value">{{ lbMyValue }}</div>
          </div>
        </div>
        <div class="lb-rows">
          <div class="lb-row" v-for="(entry, idx) in leaderboardData" :key="idx">
            <div class="lb-rank">{{ ['🥇','🥈','🥉'][idx] || (idx + 1) }}</div>
            <div class="lb-name">{{ entry.name }}</div>
            <div class="lb-value">{{ entry.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 家长报告 ========== -->
    <div v-if="currentScreen === 'parent'" class="parent-screen">
      <div class="screen-header">
        <button class="back-btn" @click="currentScreen = 'main'">← 返回</button>
        <div class="screen-title">👨‍👩‍👧 家长报告</div>
        <div></div>
      </div>
      <div class="parent-content">

        <div class="report-section">
          <div class="report-section-title">📈 总体概览</div>
          <div class="report-cards">
            <div class="report-card blue"><div class="rc-value">{{ totalScore }}</div><div class="rc-label">累计星星</div></div>
            <div class="report-card green"><div class="rc-value">{{ totalQuestions }}</div><div class="rc-label">累计答题</div></div>
            <div class="report-card orange"><div class="rc-value">{{ overallAccuracy }}%</div><div class="rc-label">综合正确率</div></div>
            <div class="report-card purple"><div class="rc-value">{{ streakDays }}天</div><div class="rc-label">连续学习</div></div>
          </div>
        </div>

        <div class="report-section">
          <div class="report-section-title">📅 今日学习</div>
          <div class="today-stats">
            <div class="today-row"><span>游戏时长</span><span class="today-val">{{ Math.floor(dailyPlayTime / 60) }}分{{ dailyPlayTime % 60 }}秒</span></div>
            <div class="today-row"><span>答题数量</span><span class="today-val">{{ todayQuestions }} 题</span></div>
            <div class="today-row"><span>获得星星</span><span class="today-val">⭐ {{ todayScore }}</span></div>
            <div class="today-row"><span>每日限制</span><span class="today-val">{{ dailyDurationLimit }} 分钟</span></div>
          </div>
        </div>

        <div class="report-section">
          <div class="report-section-title">📊 各模块掌握情况</div>
          <div class="subject-bars">
            <div class="subject-row" v-for="s in subjectStats" :key="s.name">
              <div class="subject-name">{{ s.name }}</div>
              <div class="subject-bar-wrap">
                <div class="subject-bar-fill" :style="{ width: s.accuracy + '%', background: s.color }"></div>
              </div>
              <div class="subject-pct">{{ s.accuracy }}%</div>
            </div>
          </div>
        </div>

        <div class="report-section">
          <div class="report-section-title">🗺️ 冒险进度</div>
          <div class="adventure-progress">
            <div class="ap-row" v-for="area in islandMap.areas" :key="area.id">
              <div class="ap-icon">{{ getAreaIcon(area.id) }}</div>
              <div class="ap-name">{{ area.name }}</div>
              <div class="ap-status">
                <span v-if="area.completed" class="status-done">✅ 完成</span>
                <span v-else-if="area.unlocked" class="status-active">🔓 进行中</span>
                <span v-else class="status-locked">🔒 未解锁</span>
              </div>
              <div class="ap-stars" v-if="area.unlocked">
                <span v-for="n in 3" :key="n">{{ n <= (area.stars || 0) ? '⭐' : '☆' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="report-section">
          <div class="report-section-title">🏅 成就统计</div>
          <div class="ach-summary">
            <div class="ach-sum-item"><div class="ach-sum-num">{{ unlockedAchievements.length }}</div><div class="ach-sum-label">已获得</div></div>
            <div class="ach-sum-divider">/</div>
            <div class="ach-sum-item"><div class="ach-sum-num">{{ allAchievements.length }}</div><div class="ach-sum-label">全部成就</div></div>
          </div>
        </div>

        <div class="report-section">
          <div class="report-section-title">💡 给家长的建议</div>
          <div class="parent-tips">
            <div class="tip-item" v-for="(tip, i) in parentTips" :key="i">{{ tip }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========== 设置弹窗 ========== -->
    <div class="settings-overlay" v-if="showSettings" @click.self="showSettings = false">
      <div class="settings-modal">
        <div class="modal-header">
          <div class="modal-title">⚙️ 设置</div>
          <div class="close-btn" @click="showSettings = false">✕</div>
        </div>
        <div class="settings-body">
          <div class="setting-row">
            <div class="setting-label">小朋友的名字</div>
            <input class="name-input" v-model="playerName" placeholder="宝贝的名字" maxlength="8" />
          </div>
          <div class="setting-row">
            <div class="setting-label">每日游戏时长</div>
            <select class="setting-select" v-model="dailyDurationLimit">
              <option :value="15">15分钟（3-4岁）</option>
              <option :value="20">20分钟（4-5岁）</option>
              <option :value="30">30分钟（5-6岁）</option>
            </select>
          </div>
          <div class="setting-row">
            <div class="setting-label">语音提示</div>
            <label class="toggle"><input type="checkbox" v-model="voiceEnabled" /><span class="toggle-slider"></span></label>
          </div>
          <div class="setting-row">
            <div class="setting-label">护眼模式（暖色）</div>
            <label class="toggle"><input type="checkbox" v-model="eyeProtectionEnabled" /><span class="toggle-slider"></span></label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="save-btn" @click="saveSettings">💾 保存设置</button>
        </div>
      </div>
    </div>

    <!-- 粒子特效 -->
    <div class="particles-layer" v-if="showParticles">
      <div class="particle" v-for="n in 12" :key="n" :style="getParticleStyle(n)">⭐</div>
    </div>

  </div>
</template>

<script>
import { reactive, toRefs, computed, ref, watch } from 'vue'

export default {
  name: 'GameUI',
  setup() {
    const state = reactive({
      currentScreen: 'main',
      selectedMode: null,
      currentLevel: '',
      currentArea: '',
      currentQuestion: { text: '', items: [], options: [], answer: 0, type: 'normal' },
      currentQuestionIndex: 0,
      currentScore: 0,
      selectedOption: null,
      showFeedback: false,
      isCorrect: false,
      feedbackText: '',
      finalScore: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestionsPerLevel: 5,
      totalScore: 0,
      totalQuestions: 0,
      todayQuestions: 0,
      todayScore: 0,
      bestScore: 0,
      showSettings: false,
      showCompletion: false,
      voiceEnabled: true,
      eyeProtectionEnabled: false,
      dailyDurationLimit: 15,
      dailyPlayTime: 0,
      streakDays: 1,
      playerName: '小宝贝',
      lbTab: 'score',
      showWrongShake: false,
      showParticles: false,
      newlyUnlocked: [],
      subjectRecord: {},
      unlockedAchievementIds: [],
      islandMap: {
        areas: [
          { id: 'orchard', name: '🍎 苹果园', unlocked: true, completed: false, stars: 0 },
          { id: 'beach', name: '🏖️ 沙滩', unlocked: false, completed: false, stars: 0 },
          { id: 'park', name: '🎢 游乐园', unlocked: false, completed: false, stars: 0 },
          { id: 'treehouse', name: '🌲 树屋', unlocked: false, completed: false, stars: 0 },
          { id: 'cave', name: '🔮 魔法山洞', unlocked: false, completed: false, stars: 0 }
        ]
      }
    })

    // ===== 成就系统 =====
    const allAchievements = [
      { id: 'first_star', icon: '🌟', name: '第一颗星', desc: '获得第一颗魔法星星' },
      { id: 'ten_stars', icon: '💫', name: '星星收集家', desc: '累计获得10颗星星' },
      { id: 'fifty_stars', icon: '🌠', name: '星海漫步', desc: '累计获得50颗星星' },
      { id: 'perfect', icon: '💯', name: '全力以赴', desc: '一关全部首次答对' },
      { id: 'speed', icon: '⚡', name: '闪电小熊', desc: '5道题全部首次答对' },
      { id: 'unlock_beach', icon: '🏖️', name: '海滩探险家', desc: '解锁沙滩区域' },
      { id: 'unlock_all', icon: '🗺️', name: '岛主', desc: '解锁所有区域' },
      { id: 'streak3', icon: '🔥', name: '学习小达人', desc: '连续学习3天' },
      { id: 'streak7', icon: '🌈', name: '坚持就是胜利', desc: '连续学习7天' },
      { id: 'hundred_q', icon: '📚', name: '小学霸', desc: '累计答题100道' },
      { id: 'multiply_first', icon: '✖️', name: '乘法初探', desc: '完成第一次乘法练习' },
      { id: 'number_master', icon: '🔢', name: '数字达人', desc: '完成数字认识练习' },
    ]

    const isAchievementUnlocked = (id) => state.unlockedAchievementIds.includes(id)

    const unlockedAchievements = computed(() =>
      allAchievements.filter(a => state.unlockedAchievementIds.includes(a.id))
    )

    const checkAchievements = () => {
      const newOnes = []
      const tryUnlock = (id, cond) => {
        if (cond && !state.unlockedAchievementIds.includes(id)) {
          state.unlockedAchievementIds.push(id)
          newOnes.push(allAchievements.find(a => a.id === id))
        }
      }
      tryUnlock('first_star', state.totalScore >= 1)
      tryUnlock('ten_stars', state.totalScore >= 10)
      tryUnlock('fifty_stars', state.totalScore >= 50)
      tryUnlock('perfect', state.wrongAnswers === 0)
      tryUnlock('speed', state.wrongAnswers === 0)
      tryUnlock('unlock_beach', state.islandMap.areas.find(a => a.id === 'beach')?.unlocked)
      tryUnlock('unlock_all', state.islandMap.areas.every(a => a.unlocked))
      tryUnlock('streak3', state.streakDays >= 3)
      tryUnlock('streak7', state.streakDays >= 7)
      tryUnlock('hundred_q', state.totalQuestions >= 100)
      tryUnlock('multiply_first', state.currentLevel.includes('乘法'))
      tryUnlock('number_master', state.currentLevel.includes('数字认识'))
      state.newlyUnlocked = newOnes
      saveProgress()
    }

    // ===== 排行榜 =====
    const leaderboardData = computed(() => {
      const mock = [
        { name: '小明', score: 320, streak: 12, accuracy: 94 },
        { name: '小红', score: 285, streak: 8, accuracy: 91 },
        { name: '豆豆', score: 210, streak: 5, accuracy: 88 },
        { name: '多多', score: 175, streak: 4, accuracy: 85 },
      ]
      const key = state.lbTab === 'score' ? 'score' : state.lbTab === 'streak' ? 'streak' : 'accuracy'
      return mock.sort((a, b) => b[key] - a[key]).map(p => ({
        name: p.name,
        value: state.lbTab === 'score' ? p.score + ' ⭐' : state.lbTab === 'streak' ? p.streak + ' 天' : p.accuracy + '%'
      }))
    })

    const lbMyValue = computed(() => {
      if (state.lbTab === 'score') return state.totalScore + ' ⭐'
      if (state.lbTab === 'streak') return state.streakDays + ' 天'
      return overallAccuracy.value + '%'
    })

    // ===== 统计 =====
    const completedAreas = computed(() => state.islandMap.areas.filter(a => a.completed).length)

    const remainingTime = computed(() => {
      const rem = Math.max(0, state.dailyDurationLimit * 60 - state.dailyPlayTime)
      return `${Math.floor(rem / 60)}:${String(rem % 60).padStart(2, '0')}`
    })

    const progressPercentage = computed(() =>
      Math.round((state.currentQuestionIndex / state.totalQuestionsPerLevel) * 100)
    )

    const overallAccuracy = computed(() => {
      let total = 0, right = 0
      Object.values(state.subjectRecord).forEach(r => { total += r.total; right += r.correct })
      return total ? Math.round((right / total) * 100) : 0
    })

    const subjectStats = computed(() => [
      { name: '数字认识', key: '数字认识', color: '#7ec8e3' },
      { name: '5以内加减', key: '5以内', color: '#a8e6cf' },
      { name: '10以内加减', key: '10以内', color: '#ffd3b6' },
      { name: '乘法', key: '乘法', color: '#ffaaa5' },
      { name: '冒险模式', key: 'adventure', color: '#c3b1e1' },
    ].map(s => {
      const rec = Object.entries(state.subjectRecord)
        .filter(([k]) => k.includes(s.key))
        .reduce((a, [, v]) => { a.total += v.total; a.correct += v.correct; return a }, { total: 0, correct: 0 })
      return { ...s, accuracy: rec.total ? Math.round((rec.correct / rec.total) * 100) : 0 }
    }))

    const parentTips = computed(() => {
      const tips = []
      const acc = overallAccuracy.value
      if (acc >= 90) tips.push('🌟 宝贝表现非常棒！正确率超过90%，可以尝试更高难度了。')
      else if (acc >= 70) tips.push(`👍 宝贝进步中！正确率已达到${acc}%，继续加油！`)
      else if (acc > 0) tips.push('💪 多鼓励宝贝，注重基础练习，先从5以内加减法开始。')
      if (state.streakDays >= 3) tips.push(`🔥 宝贝已连续学习${state.streakDays}天，请奖励一个大大的拥抱！`)
      if (state.completedAreas === 0) tips.push('🗺️ 试试冒险模式，情境化的题目更能激发宝贝的学习兴趣。')
      if (tips.length === 0) tips.push('📖 每天坚持10-15分钟的练习，效果比偶尔长时间练习更好哦！')
      return tips
    })

    // ===== 题库 =====
    const allPracticeQuestions = {
      '数字认识1-5': [
        { text: '数一数，一共有几个苹果？', items: ['🍎', '🍎'], answer: 2, options: [1, 2, 3, 4] },
        { text: '数一数，一共有几只小熊？', items: ['🐻', '🐻', '🐻', '🐻'], answer: 4, options: [2, 3, 4, 5] },
        { text: '数一数，一共有几颗星？', items: ['⭐', '⭐', '⭐'], answer: 3, options: [1, 2, 3, 5] },
        { text: '这里有几朵花？', items: ['🌸', '🌸', '🌸', '🌸', '🌸'], answer: 5, options: [3, 4, 5, 6] },
        { text: '有几只小猫？', items: ['🐱'], answer: 1, options: [0, 1, 2, 3] },
        { text: '有几颗糖？', items: ['🍬', '🍬'], answer: 2, options: [1, 2, 3, 4] },
        { text: '树上有几个苹果？', items: ['🍎', '🍎', '🍎'], answer: 3, options: [2, 3, 4, 5] },
      ],
      '数字认识1-10': [
        { text: '数一数，有几个气球？', items: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈'], answer: 6, options: [5, 6, 7, 8] },
        { text: '有几只小鸭？', items: ['🐥', '🐥', '🐥', '🐥', '🐥', '🐥', '🐥'], answer: 7, options: [6, 7, 8, 9] },
        { text: '数数看，有几颗糖？', items: ['🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬', '🍬'], answer: 8, options: [7, 8, 9, 10] },
        { text: '花园里有几朵花？', items: ['🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻', '🌻'], answer: 9, options: [7, 8, 9, 10] },
        { text: '一共有几只虫子？', items: ['🐛', '🐛', '🐛', '🐛', '🐛', '🐛', '🐛', '🐛', '🐛', '🐛'], answer: 10, options: [8, 9, 10, 11] },
        { text: '有几颗星星？', items: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐'], answer: 6, options: [5, 6, 7, 8] },
        { text: '鱼缸里有几条鱼？', items: ['🐟', '🐟', '🐟', '🐟', '🐟', '🐟', '🐟'], answer: 7, options: [5, 6, 7, 8] },
      ],
      '5以内加法': [
        { text: '1 + 1 = ?', items: ['🍎', '🍊'], answer: 2, options: [1, 2, 3, 4] },
        { text: '2 + 1 = ?', items: ['🍎', '🍎', '🍊'], answer: 3, options: [2, 3, 4, 5] },
        { text: '1 + 3 = ?', items: ['🍎', '🍊', '🍊', '🍊'], answer: 4, options: [2, 3, 4, 5] },
        { text: '2 + 3 = ?', items: ['🍎', '🍎', '🍊', '🍊', '🍊'], answer: 5, options: [3, 4, 5, 6] },
        { text: '4 + 1 = ?', items: ['🍎', '🍎', '🍎', '🍎', '🍊'], answer: 5, options: [3, 4, 5, 6] },
        { text: '0 + 4 = ?', items: ['🍊', '🍊', '🍊', '🍊'], answer: 4, options: [2, 3, 4, 5] },
        { text: '3 + 2 = ?', items: ['🍎', '🍎', '🍎', '🍊', '🍊'], answer: 5, options: [3, 4, 5, 6] },
        { text: '1 + 2 = ?', items: ['🍎', '🍊', '🍊'], answer: 3, options: [1, 2, 3, 4] },
      ],
      '5以内减法': [
        { text: '5 - 1 = ?', items: ['🍎', '🍎', '🍎', '🍎'], answer: 4, options: [2, 3, 4, 5] },
        { text: '5 - 2 = ?', items: ['🍎', '🍎', '🍎'], answer: 3, options: [1, 2, 3, 4] },
        { text: '4 - 1 = ?', items: ['🍎', '🍎', '🍎'], answer: 3, options: [2, 3, 4, 5] },
        { text: '4 - 3 = ?', items: ['🍎'], answer: 1, options: [0, 1, 2, 3] },
        { text: '3 - 2 = ?', items: ['🍎'], answer: 1, options: [0, 1, 2, 3] },
        { text: '5 - 5 = ?', items: [], answer: 0, options: [0, 1, 2, 3] },
        { text: '3 - 0 = ?', items: ['🍎', '🍎', '🍎'], answer: 3, options: [2, 3, 4, 5] },
        { text: '4 - 2 = ?', items: ['🍎', '🍎'], answer: 2, options: [1, 2, 3, 4] },
      ],
      '5以内混合': [
        { text: '2 + 2 = ?', items: ['🍎', '🍎', '🍊', '🍊'], answer: 4, options: [2, 3, 4, 5] },
        { text: '5 - 3 = ?', items: ['🍎', '🍎'], answer: 2, options: [1, 2, 3, 4] },
        { text: '1 + 4 = ?', items: ['🍎', '🍊', '🍊', '🍊', '🍊'], answer: 5, options: [3, 4, 5, 6] },
        { text: '4 - 2 = ?', items: ['🍎', '🍎'], answer: 2, options: [1, 2, 3, 4] },
        { text: '2 + 1 = ?', items: ['🍎', '🍎', '🍊'], answer: 3, options: [2, 3, 4, 5] },
        { text: '3 - 1 = ?', items: ['🍎', '🍎'], answer: 2, options: [1, 2, 3, 4] },
        { text: '0 + 5 = ?', items: ['🍊', '🍊', '🍊', '🍊', '🍊'], answer: 5, options: [3, 4, 5, 6] },
        { text: '5 - 4 = ?', items: ['🍎'], answer: 1, options: [0, 1, 2, 3] },
      ],
      '10以内加法': [
        { text: '5 + 3 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍊','🍊','🍊'], answer: 8, options: [6, 7, 8, 9] },
        { text: '6 + 4 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍊','🍊','🍊','🍊'], answer: 10, options: [8, 9, 10, 11] },
        { text: '7 + 2 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍊','🍊'], answer: 9, options: [7, 8, 9, 10] },
        { text: '4 + 5 = ?', items: ['🍎','🍎','🍎','🍎','🍊','🍊','🍊','🍊','🍊'], answer: 9, options: [7, 8, 9, 10] },
        { text: '3 + 6 = ?', items: ['🍎','🍎','🍎','🍊','🍊','🍊','🍊','🍊','🍊'], answer: 9, options: [7, 8, 9, 10] },
        { text: '5 + 5 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍊','🍊','🍊','🍊','🍊'], answer: 10, options: [8, 9, 10, 11] },
        { text: '2 + 7 = ?', items: ['🍎','🍎','🍊','🍊','🍊','🍊','🍊','🍊','🍊'], answer: 9, options: [7, 8, 9, 10] },
        { text: '8 + 1 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍊'], answer: 9, options: [7, 8, 9, 10] },
      ],
      '10以内减法': [
        { text: '10 - 2 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍎','🍎'], answer: 8, options: [6, 7, 8, 9] },
        { text: '9 - 4 = ?', items: ['🍎','🍎','🍎','🍎','🍎'], answer: 5, options: [3, 4, 5, 6] },
        { text: '8 - 3 = ?', items: ['🍎','🍎','🍎','🍎','🍎'], answer: 5, options: [4, 5, 6, 7] },
        { text: '7 - 5 = ?', items: ['🍎','🍎'], answer: 2, options: [1, 2, 3, 4] },
        { text: '10 - 6 = ?', items: ['🍎','🍎','🍎','🍎'], answer: 4, options: [3, 4, 5, 6] },
        { text: '9 - 3 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎'], answer: 6, options: [4, 5, 6, 7] },
        { text: '6 - 2 = ?', items: ['🍎','🍎','🍎','🍎'], answer: 4, options: [3, 4, 5, 6] },
        { text: '10 - 7 = ?', items: ['🍎','🍎','🍎'], answer: 3, options: [2, 3, 4, 5] },
      ],
      '10以内混合': [
        { text: '5 + 4 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍊','🍊','🍊','🍊'], answer: 9, options: [7, 8, 9, 10] },
        { text: '9 - 5 = ?', items: ['🍎','🍎','🍎','🍎'], answer: 4, options: [3, 4, 5, 6] },
        { text: '6 + 3 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎','🍊','🍊','🍊'], answer: 9, options: [7, 8, 9, 10] },
        { text: '10 - 4 = ?', items: ['🍎','🍎','🍎','🍎','🍎','🍎'], answer: 6, options: [4, 5, 6, 7] },
        { text: '3 + 7 = ?', items: ['🍎','🍎','🍎','🍊','🍊','🍊','🍊','🍊','🍊','🍊'], answer: 10, options: [8, 9, 10, 11] },
        { text: '8 - 5 = ?', items: ['🍎','🍎','🍎'], answer: 3, options: [2, 3, 4, 5] },
        { text: '4 + 6 = ?', items: ['🍎','🍎','🍎','🍎','🍊','🍊','🍊','🍊','🍊','🍊'], answer: 10, options: [8, 9, 10, 11] },
        { text: '7 - 4 = ?', items: ['🍎','🍎','🍎'], answer: 3, options: [2, 3, 4, 5] },
      ],
      '乘法2和3': [
        { text: '2 × 1 = ?', items: ['🌟','🌟'], answer: 2, options: [1, 2, 3, 4] },
        { text: '2 × 2 = ?', items: ['🌟','🌟','🌟','🌟'], answer: 4, options: [2, 3, 4, 5] },
        { text: '2 × 3 = ?', items: ['🌟','🌟','🌟','🌟','🌟','🌟'], answer: 6, options: [4, 5, 6, 7] },
        { text: '3 × 2 = ?', items: ['⭐','⭐','⭐','⭐','⭐','⭐'], answer: 6, options: [4, 5, 6, 7] },
        { text: '3 × 3 = ?', items: ['⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐','⭐'], answer: 9, options: [6, 7, 8, 9] },
        { text: '2 × 4 = ?', items: ['🌟','🌟','🌟','🌟','🌟','🌟','🌟','🌟'], answer: 8, options: [6, 7, 8, 9] },
        { text: '3 × 1 = ?', items: ['⭐','⭐','⭐'], answer: 3, options: [2, 3, 4, 5] },
        { text: '2 × 5 = ?', items: [], answer: 10, options: [8, 9, 10, 11] },
      ],
      '乘法4和5': [
        { text: '4 × 1 = ?', items: ['💎','💎','💎','💎'], answer: 4, options: [3, 4, 5, 6] },
        { text: '4 × 2 = ?', items: ['💎','💎','💎','💎','💎','💎','💎','💎'], answer: 8, options: [6, 7, 8, 9] },
        { text: '5 × 1 = ?', items: ['🏅','🏅','🏅','🏅','🏅'], answer: 5, options: [3, 4, 5, 6] },
        { text: '5 × 2 = ?', items: ['🏅','🏅','🏅','🏅','🏅','🏅','🏅','🏅','🏅','🏅'], answer: 10, options: [8, 9, 10, 11] },
        { text: '4 × 3 = ?', items: [], answer: 12, options: [10, 11, 12, 13] },
        { text: '5 × 3 = ?', items: [], answer: 15, options: [12, 13, 14, 15] },
        { text: '4 × 4 = ?', items: [], answer: 16, options: [14, 15, 16, 17] },
        { text: '5 × 4 = ?', items: [], answer: 20, options: [18, 19, 20, 21] },
      ],
    }

    const adventureQuestions = {
      orchard: [
        { text: '小熊的篮子里有1个苹果，小刺猬又送了1个，现在有几个？', items: ['🍎', '🍎'], answer: 2 },
        { text: '小熊有3个苹果，吃掉1个，还剩几个？', items: ['🍎', '🍎', '🍎'], answer: 2 },
        { text: '树上有4个苹果，掉下来2个，还剩几个？', items: ['🍎', '🍎'], answer: 2 },
        { text: '小熊采了2个苹果，松鼠又送了3个，现在有几个？', items: ['🍎','🍎','🍎','🍎','🍎'], answer: 5 },
        { text: '小熊有5个苹果，分给小兔子3个，还剩几个？', items: ['🍎', '🍎'], answer: 2 },
        { text: '篮子里有0个苹果，摘了4个，有几个？', items: ['🍎','🍎','🍎','🍎'], answer: 4 },
      ],
      beach: [
        { text: '沙滩上有2个贝壳，又找到了3个，一共有几个？', items: ['🐚','🐚','🐚','🐚','🐚'], answer: 5 },
        { text: '小熊堆了5个沙堡，被海浪冲垮2个，还剩几个？', items: ['🏰','🏰','🏰'], answer: 3 },
        { text: '海边有4只螃蟹，跑走了2只，还剩几只？', items: ['🦀','🦀'], answer: 2 },
        { text: '发现了3颗珍珠，又找到了2颗，一共有几颗？', items: ['💎','💎','💎','💎','💎'], answer: 5 },
        { text: '沙滩上有6只海鸥，飞走了3只，还剩几只？', items: ['🐦','🐦','🐦'], answer: 3 },
      ],
      park: [
        { text: '游乐园里有3个小朋友，又来了2个，一共有几个？', items: ['👶','👶','👶','👶','👶'], answer: 5 },
        { text: '有8个气球，飞走2个，还剩几个？', items: ['🎈','🎈','🎈','🎈','🎈','🎈'], answer: 6 },
        { text: '旋转木马上有4匹马，又加了1匹，现在有几匹？', items: ['🐴','🐴','🐴','🐴','🐴'], answer: 5 },
        { text: '买了7朵棉花糖，吃了3朵，还剩几朵？', items: ['☁️','☁️','☁️','☁️'], answer: 4 },
        { text: '排队坐过山车有5个人，走了2个，还剩几个？', items: ['👧','👧','👧'], answer: 3 },
      ],
      treehouse: [
        { text: '树屋上有4只小鸟，飞走了1只，还剩几只？', items: ['🐦','🐦','🐦'], answer: 3 },
        { text: '树上有3个松果，掉了1个，还有几个？', items: ['🌰','🌰'], answer: 2 },
        { text: '树洞里有2只松鼠，又搬进来3只，有几只？', items: ['🐿️','🐿️','🐿️','🐿️','🐿️'], answer: 5 },
        { text: '摘了5个果子，给了小熊3个，还剩几个？', items: ['🍊','🍊'], answer: 2 },
        { text: '树枝上停了3只蝴蝶，飞走1只，还剩几只？', items: ['🦋','🦋'], answer: 2 },
      ],
      cave: [
        { text: '山洞里有5个萤火虫，飞出3个，还剩几个？', items: ['✨','✨'], answer: 2 },
        { text: '发现了4个宝藏，又找到了3个，一共有几个？', items: ['💎','💎','💎','💎','💎','💎','💎'], answer: 7 },
        { text: '洞里有3只蝙蝠，又飞来了2只，一共有几只？', items: ['🦇','🦇','🦇','🦇','🦇'], answer: 5 },
        { text: '魔法石有8颗，用了5颗，还剩几颗？', items: ['💠','💠','💠'], answer: 3 },
        { text: '发光蘑菇有6个，摘了2个，还剩几个？', items: ['🍄','🍄','🍄','🍄'], answer: 4 },
      ],
    }

    // ===== 题目池（乱序不重复）=====
    const questionPool = ref([])

    const shufflePool = (arr) => {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
      }
      questionPool.value = a
    }

    const pickQuestion = () => questionPool.value.shift() || null

    // ===== 游戏控制 =====
    const starsEarned = ref(1)
    const correctEmoji = ref('🎉')
    const correctTitle = ref('太棒了！')

    const selectMode = (mode) => { state.currentScreen = mode }

    const backToMode = () => {
      state.currentScreen = state.selectedMode === 'adventure' ? 'adventure' : state.selectedMode === 'practice' ? 'practice' : 'main'
      state.selectedMode = null
      state.showFeedback = false
      state.showCompletion = false
    }

    const startLevel = (areaId) => {
      state.currentArea = areaId
      state.currentScreen = 'game'
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.showFeedback = false
      state.selectedMode = 'adventure'
      shufflePool(adventureQuestions[areaId] || adventureQuestions.orchard)
      state.currentQuestion = prepQ(pickQuestion())
    }

    const selectPracticeLevel = (level) => {
      state.currentLevel = level
      state.currentScreen = 'game'
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.showFeedback = false
      state.selectedMode = 'practice'
      shufflePool(allPracticeQuestions[level] || allPracticeQuestions['5以内加法'])
      state.currentQuestion = prepQ(pickQuestion())
    }

    const prepQ = (raw) => {
      if (!raw) return { text: '题目加载中...', items: [], options: [1, 2, 3, 4], answer: 1, type: 'normal' }
      return { type: 'normal', displayNumber: '', ...raw }
    }

    // ===== 答题 =====
    const selectAnswer = (option, idx) => {
      if (state.showFeedback) return
      const ok = option === state.currentQuestion.answer
      state.isCorrect = ok
      state.selectedOption = idx
      state.showFeedback = true

      if (ok) {
        state.correctAnswers++
        state.currentScore += 10
        state.todayScore += 10
        starsEarned.value = state.wrongAnswers === 0 ? 2 : 1
        correctEmoji.value = ['🎉','🥳','🌟','✨','🚀'][Math.floor(Math.random() * 5)]
        correctTitle.value = ['太棒了！','答对了！','真厉害！','好聪明！','超级棒！'][Math.floor(Math.random() * 5)]
        state.feedbackText = '小熊给你点赞！继续加油！🐻'
        state.showParticles = true
        setTimeout(() => { state.showParticles = false }, 1200)
        if (state.voiceEnabled) speak('答对了，太棒了！')
      } else {
        state.wrongAnswers++
        state.feedbackText = `正确答案是 ${state.currentQuestion.answer}，没关系，再试试！😊`
        state.showWrongShake = true
        setTimeout(() => { state.showWrongShake = false }, 600)
        if (state.voiceEnabled) speak('没关系，再想想！')
      }

      // 记录统计
      const key = state.selectedMode === 'adventure' ? 'adventure' : state.currentLevel
      if (!state.subjectRecord[key]) state.subjectRecord[key] = { total: 0, correct: 0 }
      state.subjectRecord[key].total++
      if (ok) state.subjectRecord[key].correct++
    }

    const nextQuestion = () => {
      if (!state.isCorrect) {
        // Bug修复：答错后关闭弹窗让用户重新选择，不推进题目
        state.showFeedback = false
        state.selectedOption = null
        return
      }
      state.showFeedback = false
      state.selectedOption = null
      state.currentQuestionIndex++
      state.todayQuestions++
      state.totalQuestions++

      if (state.currentQuestionIndex < state.totalQuestionsPerLevel) {
        const next = pickQuestion()
        if (next) state.currentQuestion = prepQ(next)
      } else {
        // 完成
        state.finalScore = state.currentScore
        state.totalScore += state.currentScore
        state.bestScore = Math.max(state.bestScore, state.currentScore)
        checkAchievements()

        if (state.selectedMode === 'adventure') {
          const acc = state.correctAnswers / state.totalQuestionsPerLevel
          const stars = acc >= 1 ? 3 : acc >= 0.8 ? 2 : 1
          const idx = state.islandMap.areas.findIndex(a => a.id === state.currentArea)
          if (idx >= 0) {
            state.islandMap.areas[idx].completed = true
            state.islandMap.areas[idx].stars = Math.max(state.islandMap.areas[idx].stars, stars)
            if (idx < state.islandMap.areas.length - 1) state.islandMap.areas[idx + 1].unlocked = true
          }
        }
        state.showCompletion = true
        if (state.voiceEnabled) speak('恭喜完成，太厉害了！')
      }
    }

    const continuePractice = () => {
      state.showCompletion = false
      state.currentQuestionIndex = 0
      state.currentScore = 0
      state.correctAnswers = 0
      state.wrongAnswers = 0
      state.selectedOption = null
      state.showFeedback = false
      state.newlyUnlocked = []
      shufflePool(allPracticeQuestions[state.currentLevel] || allPracticeQuestions['5以内加法'])
      state.currentQuestion = prepQ(pickQuestion())
    }

    const backToPractice = () => {
      state.currentScreen = 'practice'
      state.selectedMode = null
      state.showCompletion = false
      state.showFeedback = false
      state.newlyUnlocked = []
    }

    // ===== 工具 =====
    const getAreaIcon = (id) => ({ orchard: '🍎', beach: '🏖️', park: '🎢', treehouse: '🌲', cave: '🔮' }[id] || '📦')

    const speak = (text) => {
      if (!state.voiceEnabled) return
      try { const u = new SpeechSynthesisUtterance(text); u.lang = 'zh-CN'; u.pitch = 1.3; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch (e) {}
    }

    const playQuestionVoice = () => speak(state.currentQuestion.text)

    const getParticleStyle = (n) => ({
      left: (10 + Math.random() * 80) + '%',
      top: (10 + Math.random() * 80) + '%',
      animationDelay: (n * 0.08) + 's',
      fontSize: (1 + Math.random() * 0.8) + 'rem'
    })

    // ===== 存档 =====
    const saveSettings = () => {
      try { localStorage.setItem('bearMathSettings', JSON.stringify({ voiceEnabled: state.voiceEnabled, eyeProtectionEnabled: state.eyeProtectionEnabled, dailyDurationLimit: state.dailyDurationLimit, playerName: state.playerName })) } catch (e) {}
      state.showSettings = false
    }

    const saveProgress = () => {
      try { localStorage.setItem('bearMathProgress', JSON.stringify({ totalScore: state.totalScore, totalQuestions: state.totalQuestions, bestScore: state.bestScore, streakDays: state.streakDays, unlockedAchievementIds: state.unlockedAchievementIds, subjectRecord: state.subjectRecord, islandAreas: state.islandMap.areas })) } catch (e) {}
    }

    const loadAll = () => {
      try {
        const s = localStorage.getItem('bearMathSettings')
        if (s) { const d = JSON.parse(s); state.voiceEnabled = d.voiceEnabled !== false; state.eyeProtectionEnabled = !!d.eyeProtectionEnabled; state.dailyDurationLimit = d.dailyDurationLimit || 15; state.playerName = d.playerName || '小宝贝' }
        const p = localStorage.getItem('bearMathProgress')
        if (p) { const d = JSON.parse(p); state.totalScore = d.totalScore || 0; state.totalQuestions = d.totalQuestions || 0; state.bestScore = d.bestScore || 0; state.streakDays = d.streakDays || 1; state.unlockedAchievementIds = d.unlockedAchievementIds || []; state.subjectRecord = d.subjectRecord || {}; if (d.islandAreas) state.islandMap.areas = d.islandAreas }
      } catch (e) {}
    }

    loadAll()
    watch(() => state.totalScore, saveProgress)

    return {
      ...toRefs(state),
      completedAreas, remainingTime, progressPercentage, overallAccuracy, subjectStats, parentTips,
      starsEarned, correctEmoji, correctTitle, leaderboardData, lbMyValue,
      allAchievements, unlockedAchievements, isAchievementUnlocked,
      getAreaIcon, selectMode, startLevel, selectPracticeLevel, selectAnswer, nextQuestion,
      playQuestionVoice, saveSettings, continuePractice, backToPractice, backToMode, getParticleStyle,
    }
  }
}
</script>

<style scoped>
.game-ui-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow-x: hidden;
}
.game-ui-container.eye-protection {
  background: linear-gradient(135deg, #b8a96a 0%, #8b7355 100%);
}

/* 公共头部 */
.screen-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: rgba(0,0,0,0.15); }
.screen-title { font-size: 1.2rem; font-weight: bold; }
.header-score { font-size: 1rem; font-weight: bold; }

.back-btn {
  background: rgba(255,255,255,0.2); border: none; color: white;
  padding: 8px 14px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s;
}
.back-btn:hover { background: rgba(255,255,255,0.35); }

/* 主界面 */
.main-screen { max-width: 680px; margin: 0 auto; padding: 16px; text-align: center; }
.game-header { padding: 16px 0 10px; }
.bear-mascot { font-size: 3.5rem; animation: bear-bounce 2s infinite ease-in-out; }
@keyframes bear-bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
.game-title { font-size: 1.8rem; font-weight: 900; text-shadow: 0 2px 8px rgba(0,0,0,0.3); margin: 6px 0 4px; }
.game-subtitle { font-size: 0.95rem; opacity: 0.85; margin-bottom: 16px; }

.mode-selection { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.mode-card { background: rgba(255,255,255,0.12); border-radius: 18px; padding: 22px 14px; cursor: pointer; transition: all 0.3s; border: 2px solid rgba(255,255,255,0.2); }
.mode-card:hover { transform: translateY(-4px) scale(1.02); background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.5); }
.mode-icon { font-size: 2.8rem; margin-bottom: 8px; }
.mode-title { font-size: 1.2rem; font-weight: bold; margin-bottom: 4px; }
.mode-description { font-size: 0.82rem; opacity: 0.8; line-height: 1.4; }

.player-stats-bar { display: flex; justify-content: space-around; background: rgba(0,0,0,0.18); border-radius: 14px; padding: 12px 6px; margin-bottom: 12px; }
.stat-item { text-align: center; }
.stat-icon { font-size: 1.2rem; display: block; }
.stat-value { font-size: 1.1rem; font-weight: bold; display: block; }
.stat-label { font-size: 0.65rem; opacity: 0.7; }

.achievements-preview { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.achievements-label { font-size: 0.82rem; opacity: 0.8; }
.ach-badge-mini { font-size: 1.4rem; }

.main-actions { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.action-btn { background: rgba(255,255,255,0.14); border-radius: 12px; padding: 10px 4px; cursor: pointer; font-size: 0.78rem; text-align: center; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.2); }
.action-btn:hover { background: rgba(255,255,255,0.26); transform: scale(1.05); }

/* 冒险地图 */
.adventure-screen { min-height: 100vh; }
.island-map { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; padding: 14px; max-width: 680px; margin: 0 auto; }
.island-area { background: rgba(255,255,255,0.1); border-radius: 14px; padding: 14px 8px; text-align: center; transition: all 0.3s; border: 2px solid rgba(255,255,255,0.15); }
.island-area.unlocked { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }
.island-area.completed { background: rgba(100,200,100,0.2); border-color: rgba(100,255,100,0.4); }
.island-area.locked { opacity: 0.5; }
.area-icon { font-size: 2.4rem; margin-bottom: 6px; }
.area-name { font-size: 0.82rem; font-weight: bold; margin-bottom: 6px; }
.area-stars { margin-bottom: 8px; font-size: 0.9rem; }
.start-button { background: linear-gradient(45deg,#FF9A9E,#FAD0C4); color: #333; border-radius: 18px; padding: 6px 10px; font-size: 0.78rem; font-weight: bold; cursor: pointer; border: none; transition: transform 0.2s; }
.start-button:hover { transform: scale(1.07); }
.locked-text { font-size: 0.78rem; opacity: 0.7; }

/* 练习选题 */
.practice-screen { min-height: 100vh; overflow-y: auto; }
.practice-categories { padding: 10px 14px 60px; max-width: 680px; margin: 0 auto; }
.category-title { font-size: 0.95rem; font-weight: bold; margin: 14px 0 8px; opacity: 0.9; border-left: 4px solid rgba(255,255,255,0.6); padding-left: 8px; }
.practice-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.practice-card { background: rgba(255,255,255,0.12); border-radius: 14px; padding: 14px 8px; text-align: center; cursor: pointer; transition: all 0.25s; border: 1px solid rgba(255,255,255,0.2); }
.practice-card:hover { background: rgba(255,255,255,0.24); transform: scale(1.04); }
.practice-icon { font-size: 2rem; margin-bottom: 6px; }
.practice-name { font-size: 0.8rem; font-weight: bold; margin-bottom: 4px; }
.practice-diff { font-size: 0.7rem; opacity: 0.75; }

/* 游戏界面 */
.game-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 0 14px 20px; }
.game-top-bar { width: 100%; max-width: 580px; display: flex; align-items: center; justify-content: space-between; padding: 12px 0 10px; }
.question-counter { font-size: 0.95rem; font-weight: bold; opacity: 0.85; }
.current-score-display { font-size: 1rem; font-weight: bold; }

.progress-track { width: 100%; max-width: 580px; height: 16px; background: rgba(255,255,255,0.2); border-radius: 8px; margin-bottom: 16px; position: relative; overflow: visible; }
.progress-fill-bar { height: 100%; background: linear-gradient(90deg,#FFD700,#FF6B6B); border-radius: 8px; transition: width 0.5s ease; position: relative; min-width: 24px; }
.progress-bear { position: absolute; right: -8px; top: -7px; font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }

.question-card { width: 100%; max-width: 580px; background: rgba(255,255,255,0.15); border-radius: 22px; padding: 20px 18px 14px; backdrop-filter: blur(10px); margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.3); }
.question-card.shake { animation: shake 0.5s ease; }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
.question-text { font-size: 1.1rem; font-weight: bold; text-align: center; margin-bottom: 12px; line-height: 1.5; }
.question-visual { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-bottom: 12px; min-height: 28px; }
.q-item { font-size: 1.7rem; animation: pop-in 0.3s ease both; }
@keyframes pop-in { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
.number-display { text-align: center; margin-bottom: 12px; }
.big-number { font-size: 5rem; font-weight: 900; text-shadow: 0 4px 16px rgba(0,0,0,0.3); }
.voice-btn { background: rgba(255,255,255,0.2); border: none; color: white; padding: 6px 18px; border-radius: 18px; cursor: pointer; font-size: 0.88rem; display: block; margin: 0 auto; transition: background 0.2s; }
.voice-btn:hover { background: rgba(255,255,255,0.35); }

.answer-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; width: 100%; max-width: 580px; }
.answer-btn { background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.35); border-radius: 16px; padding: 18px 8px; font-size: 1.8rem; font-weight: bold; color: white; cursor: pointer; text-align: center; transition: all 0.25s; user-select: none; }
.answer-btn:hover { background: rgba(255,255,255,0.32); transform: scale(1.04); }
.answer-btn.selected { background: rgba(255,255,100,0.3); border-color: #FFD700; }
.answer-btn.correct-ans { background: rgba(80,200,80,0.5) !important; border-color: #4ade80 !important; }
.answer-btn.wrong-ans { background: rgba(255,80,80,0.4) !important; border-color: #f87171 !important; }

/* 反馈弹窗 */
.feedback-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
.feedback-card { background: white; color: #333; border-radius: 24px; padding: 28px 24px; text-align: center; max-width: 340px; width: 90%; animation: card-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes card-pop { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
.correct-card { background: linear-gradient(135deg,#d4fc79,#96e6a1); }
.wrong-card { background: linear-gradient(135deg,#ffecd2,#fcb69f); }
.feedback-emoji { font-size: 3.5rem; margin-bottom: 8px; }
.feedback-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 6px; }
.feedback-msg { font-size: 0.95rem; margin-bottom: 12px; line-height: 1.4; }
.stars-earned { margin-bottom: 12px; }
.star-pop { font-size: 1.8rem; display: inline-block; animation: star-bounce 0.5s ease both; margin: 0 2px; }
@keyframes star-bounce { 0%{transform:scale(0) rotate(-20deg)} 70%{transform:scale(1.3) rotate(10deg)} 100%{transform:scale(1) rotate(0)} }
.next-btn { background: linear-gradient(45deg,#667eea,#764ba2); color: white; border: none; border-radius: 22px; padding: 12px 26px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
.next-btn:hover { transform: scale(1.06); }

/* 完成弹窗 */
.completion-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
.completion-card { background: linear-gradient(135deg,#a8edea,#fed6e3); color: #333; border-radius: 26px; padding: 28px 22px; text-align: center; max-width: 360px; width: 92%; animation: card-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
.completion-emoji { font-size: 4.5rem; animation: bear-bounce 1s infinite; }
.completion-title { font-size: 1.6rem; font-weight: bold; margin: 8px 0 14px; }
.completion-stats { display: flex; justify-content: space-around; margin-bottom: 14px; }
.cstat { font-size: 0.88rem; }
.new-achievements { background: rgba(255,255,255,0.5); border-radius: 10px; padding: 8px 12px; margin-bottom: 14px; }
.na-title { font-weight: bold; margin-bottom: 4px; font-size: 0.9rem; }
.na-item { font-size: 0.88rem; margin: 3px 0; }
.completion-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.action-primary { background: linear-gradient(45deg,#FF9A9E,#FAD0C4); color: #333; border: none; border-radius: 20px; padding: 11px 20px; font-size: 0.95rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
.action-secondary { background: rgba(255,255,255,0.6); color: #444; border: none; border-radius: 20px; padding: 11px 20px; font-size: 0.95rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
.action-primary:hover, .action-secondary:hover { transform: scale(1.06); }

/* 成就 */
.achievements-screen { min-height: 100vh; }
.achievements-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; padding: 14px; max-width: 680px; margin: 0 auto; }
.achievement-card { border-radius: 14px; padding: 14px 8px; text-align: center; transition: transform 0.2s; }
.achievement-card.unlocked { background: rgba(255,255,255,0.2); border: 2px solid rgba(255,215,0,0.6); }
.achievement-card.locked { background: rgba(0,0,0,0.2); opacity: 0.5; }
.ach-icon { font-size: 2.2rem; margin-bottom: 5px; }
.ach-name { font-size: 0.8rem; font-weight: bold; margin-bottom: 3px; }
.ach-desc { font-size: 0.68rem; opacity: 0.75; line-height: 1.3; }

/* 排行榜 */
.leaderboard-screen { min-height: 100vh; }
.leaderboard-list { max-width: 580px; margin: 0 auto; padding: 14px; }
.lb-tabs { display: flex; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 3px; margin-bottom: 14px; }
.lb-tab { flex: 1; text-align: center; padding: 8px; border-radius: 9px; cursor: pointer; font-size: 0.88rem; transition: all 0.2s; }
.lb-tab.active { background: rgba(255,255,255,0.25); font-weight: bold; }
.lb-my-rank { margin-bottom: 12px; }
.my-rank-label { font-size: 0.78rem; opacity: 0.7; margin-bottom: 5px; }
.lb-rows { display: flex; flex-direction: column; gap: 7px; }
.lb-row { display: flex; align-items: center; background: rgba(255,255,255,0.12); border-radius: 10px; padding: 11px 14px; gap: 10px; }
.lb-row.highlight-row { background: rgba(255,215,0,0.25); border: 1px solid rgba(255,215,0,0.5); }
.lb-rank { font-size: 1.2rem; width: 2rem; text-align: center; }
.lb-name { flex: 1; font-weight: bold; font-size: 0.95rem; }
.lb-value { font-size: 1rem; font-weight: bold; }

/* 家长报告 */
.parent-screen { min-height: 100vh; overflow-y: auto; }
.parent-content { max-width: 680px; margin: 0 auto; padding: 14px 14px 70px; }
.report-section { background: rgba(255,255,255,0.1); border-radius: 16px; padding: 14px; margin-bottom: 12px; }
.report-section-title { font-size: 0.95rem; font-weight: bold; margin-bottom: 10px; border-left: 4px solid rgba(255,255,255,0.7); padding-left: 8px; }
.report-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.report-card { border-radius: 10px; padding: 10px 6px; text-align: center; }
.report-card.blue{background:rgba(100,160,255,0.35)} .report-card.green{background:rgba(100,220,100,0.35)} .report-card.orange{background:rgba(255,160,80,0.35)} .report-card.purple{background:rgba(180,100,255,0.35)}
.rc-value { font-size: 1.3rem; font-weight: bold; }
.rc-label { font-size: 0.65rem; opacity: 0.8; margin-top: 3px; }
.today-stats { display: flex; flex-direction: column; gap: 8px; }
.today-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.15); font-size: 0.88rem; }
.today-val { font-weight: bold; }
.subject-bars { display: flex; flex-direction: column; gap: 8px; }
.subject-row { display: flex; align-items: center; gap: 8px; }
.subject-name { font-size: 0.78rem; width: 80px; flex-shrink: 0; }
.subject-bar-wrap { flex: 1; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; overflow: hidden; }
.subject-bar-fill { height: 100%; border-radius: 5px; transition: width 0.8s ease; }
.subject-pct { font-size: 0.78rem; width: 32px; text-align: right; font-weight: bold; }
.adventure-progress { display: flex; flex-direction: column; gap: 8px; }
.ap-row { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 10px; }
.ap-icon { font-size: 1.3rem; }
.ap-name { flex: 1; font-size: 0.88rem; font-weight: bold; }
.ap-status { font-size: 0.78rem; }
.ap-stars { font-size: 0.85rem; }
.status-done{color:#86efac} .status-active{color:#fde68a} .status-locked{opacity:.6}
.ach-summary { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 8px; }
.ach-sum-item { text-align: center; }
.ach-sum-num { font-size: 2.2rem; font-weight: bold; }
.ach-sum-label { font-size: 0.78rem; opacity: 0.75; }
.ach-sum-divider { font-size: 1.8rem; opacity: 0.4; }
.parent-tips { display: flex; flex-direction: column; gap: 7px; }
.tip-item { background: rgba(255,255,255,0.12); border-radius: 8px; padding: 9px 10px; font-size: 0.85rem; line-height: 1.5; }

/* 设置弹窗 */
.settings-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; }
.settings-modal { background: white; color: #333; border-radius: 22px; max-width: 380px; width: 92%; overflow: hidden; animation: card-pop 0.3s ease; }
.modal-header { background: linear-gradient(135deg,#667eea,#764ba2); color: white; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; }
.modal-title { font-size: 1.1rem; font-weight: bold; }
.close-btn { cursor: pointer; font-size: 1.2rem; opacity: 0.8; transition: opacity 0.2s; }
.close-btn:hover { opacity: 1; }
.settings-body { padding: 14px 18px; }
.setting-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid #eee; }
.setting-label { font-size: 0.92rem; color: #555; }
.name-input { border: 1px solid #ddd; border-radius: 8px; padding: 5px 9px; font-size: 0.88rem; width: 110px; text-align: center; }
.setting-select { border: 1px solid #ddd; border-radius: 8px; padding: 5px 7px; font-size: 0.82rem; }
.toggle { position: relative; width: 50px; height: 26px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; inset: 0; background: #ccc; border-radius: 26px; cursor: pointer; transition: 0.3s; }
.toggle-slider:before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
.toggle input:checked + .toggle-slider { background: #667eea; }
.toggle input:checked + .toggle-slider:before { transform: translateX(24px); }
.modal-footer { padding: 10px 18px 18px; text-align: center; }
.save-btn { background: linear-gradient(45deg,#4CAF50,#8BC34A); color: white; border: none; border-radius: 20px; padding: 11px 26px; font-size: 0.95rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
.save-btn:hover { transform: scale(1.05); }

/* 粒子 */
.particles-layer { position: fixed; inset: 0; pointer-events: none; z-index: 300; }
.particle { position: absolute; animation: particle-fly 1s ease forwards; }
@keyframes particle-fly { 0%{transform:scale(0) rotate(0);opacity:1} 50%{transform:scale(1.5) rotate(180deg);opacity:1} 100%{transform:scale(0) translateY(-70px) rotate(360deg);opacity:0} }

/* 过渡 */
.pop-enter-active,.pop-leave-active { transition: all 0.3s ease; }
.pop-enter-from,.pop-leave-to { opacity: 0; transform: scale(0.8); }

/* 响应式 */
@media (max-width: 500px) {
  .game-title { font-size: 1.4rem; }
  .island-map { grid-template-columns: repeat(2,1fr); }
  .practice-grid { grid-template-columns: repeat(2,1fr); }
  .report-cards { grid-template-columns: repeat(2,1fr); }
  .achievements-grid { grid-template-columns: repeat(2,1fr); }
  .main-actions { grid-template-columns: repeat(2,1fr); }
  .answer-btn { font-size: 1.5rem; padding: 14px 6px; }
  .question-text { font-size: 1rem; }
  .mode-selection { gap: 10px; }
}
</style>
