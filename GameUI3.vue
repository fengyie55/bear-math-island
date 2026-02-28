<template>
  <div class="app-root" :class="{ 'warm-mode': settings.eyeProtection }">

    <!-- ══════════════════════════════════════ 儿童选择界面 ══════════════════════════════════════ -->
    <transition name="screen-fade">
    <div v-if="screen === 'child-select'" class="child-select-screen">
      <div class="clouds">
        <div class="cloud c1">☁️</div>
        <div class="cloud c2">☁️</div>
        <div class="cloud c3">⛅</div>
      </div>
      <div class="cs-hero">
        <div class="hero-bear">🐻</div>
        <h1 class="hero-title">小熊海岛</h1>
        <p class="hero-sub">数学大冒险</p>
      </div>
      <div class="cs-prompt">小朋友，点击你的头像开始！</div>
      <div class="profiles-row">
        <div
          v-for="profile in profiles"
          :key="profile.id"
          class="profile-card"
          @click="selectProfile(profile)"
        >
          <div class="profile-avatar">{{ profile.avatar }}</div>
          <div class="profile-name">{{ profile.name }}</div>
          <div class="profile-stars">⭐ {{ profile.totalScore }}</div>
        </div>
        <div class="profile-card add-card" @click="showAddProfile = true" v-if="profiles.length < 4">
          <div class="profile-avatar">➕</div>
          <div class="profile-name">新小朋友</div>
        </div>
      </div>
      <div class="parent-entry" @click="screen = 'parent'">👨‍👩‍👧 家长报告</div>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 新建用户弹窗 ══════════════════════════════════════ -->
    <div class="modal-backdrop" v-if="showAddProfile" @click.self="showAddProfile = false">
      <div class="add-profile-modal">
        <h2>创建小朋友的账号</h2>
        <div class="avatar-picker">
          <div
            v-for="av in avatarOptions" :key="av"
            class="av-opt"
            :class="{ selected: newProfile.avatar === av }"
            @click="newProfile.avatar = av"
          >{{ av }}</div>
        </div>
        <input
          class="name-input"
          v-model="newProfile.name"
          placeholder="输入名字（最多5个字）"
          maxlength="5"
        />
        <div class="age-row">
          <span>年龄：</span>
          <div class="age-btn" v-for="a in [3,4,5,6]" :key="a"
            :class="{ active: newProfile.age === a }"
            @click="newProfile.age = a">{{ a }}岁</div>
        </div>
        <button class="confirm-btn" @click="createProfile" :disabled="!newProfile.name.trim()">
          🎉 出发！
        </button>
      </div>
    </div>

    <!-- ══════════════════════════════════════ 主页 ══════════════════════════════════════ -->
    <transition name="screen-fade">
    <div v-if="screen === 'main'" class="main-screen">
      <!-- 天空背景 -->
      <div class="sky-bg">
        <div class="sun">☀️</div>
        <div class="cloud mc1">☁️</div>
        <div class="cloud mc2">⛅</div>
        <div class="birds">🐦 🐦</div>
      </div>

      <!-- 顶部栏 -->
      <div class="main-topbar">
        <div class="player-chip" @click="screen = 'child-select'">
          <span class="chip-av">{{ currentProfile.avatar }}</span>
          <span class="chip-name">{{ currentProfile.name }}</span>
        </div>
        <div class="topbar-stats">
          <span class="ts-item">⭐ {{ currentProfile.totalScore }}</span>
          <span class="ts-item">🔥 {{ currentProfile.streakDays }}天</span>
          <span class="ts-item time-chip" :class="{ urgent: remainingSeconds < 120 }">
            ⏰ {{ remainingTimeStr }}
          </span>
        </div>
        <button class="icon-btn" @click="showSettings = true">⚙️</button>
      </div>

      <!-- 海岛全景 -->
      <div class="island-panorama">
        <div class="island-scene">
          <!-- 各个区域作为场景元素 -->
          <div
            v-for="area in islandAreas"
            :key="area.id"
            class="scene-spot"
            :class="[`spot-${area.id}`, { 'spot-locked': !area.unlocked, 'spot-done': area.completed }]"
            @click="area.unlocked ? enterArea(area) : null"
          >
            <div class="spot-bubble">
              <div class="spot-emoji">{{ area.emoji }}</div>
              <div class="spot-name">{{ area.name }}</div>
              <div class="spot-stars" v-if="area.unlocked">
                <span v-for="n in 3" :key="n">{{ n <= area.stars ? '⭐' : '✦' }}</span>
              </div>
              <div class="spot-lock" v-if="!area.unlocked">🔒</div>
              <div class="spot-cta" v-if="area.unlocked">
                {{ area.completed ? '再玩！' : '出发！' }}
              </div>
            </div>
          </div>

          <!-- 小熊角色 -->
          <div class="bear-character" :class="{ 'bear-walk': bearWalking }">🐻</div>
          <!-- 装饰 -->
          <div class="deco-tree t1">🌴</div>
          <div class="deco-tree t2">🌳</div>
          <div class="deco-tree t3">🌲</div>
          <div class="deco-flower f1">🌸</div>
          <div class="deco-flower f2">🌺</div>
          <div class="deco-ocean">🌊🌊🌊🌊🌊</div>
        </div>
      </div>

      <!-- 底部导航 -->
      <div class="bottom-nav">
        <div class="nav-item active">
          <div class="nav-icon">🏝️</div>
          <div class="nav-label">海岛</div>
        </div>
        <div class="nav-item" @click="screen = 'practice'">
          <div class="nav-icon">📚</div>
          <div class="nav-label">练习</div>
        </div>
        <div class="nav-item" @click="screen = 'achievements'">
          <div class="nav-icon">🏅</div>
          <div class="nav-label">成就</div>
        </div>
        <div class="nav-item" @click="screen = 'parent'">
          <div class="nav-icon">👨‍👩‍👧</div>
          <div class="nav-label">报告</div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 练习模式 ══════════════════════════════════════ -->
    <transition name="screen-fade">
    <div v-if="screen === 'practice'" class="practice-screen">
      <div class="page-header">
        <button class="back-btn" @click="screen = 'main'">◀ 返回</button>
        <h2>📚 练习题库</h2>
        <div class="header-score">⭐ {{ currentProfile.totalScore }}</div>
      </div>

      <div class="practice-scroll">
        <div class="practice-category" v-for="cat in practiceCategories" :key="cat.title">
          <div class="cat-header">
            <span class="cat-emoji">{{ cat.emoji }}</span>
            <span class="cat-title">{{ cat.title }}</span>
            <span class="cat-age">{{ cat.ageHint }}</span>
          </div>
          <div class="cat-levels">
            <div
              class="level-card"
              v-for="level in cat.levels"
              :key="level.key"
              @click="startPractice(level)"
            >
              <div class="level-icon">{{ level.icon }}</div>
              <div class="level-info">
                <div class="level-name">{{ level.name }}</div>
                <div class="level-desc">{{ level.desc }}</div>
              </div>
              <div class="level-stars">
                <span v-for="n in 3" :key="n">{{ n <= (currentProfile.levelStars?.[level.key] || 0) ? '⭐' : '✦' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 游戏答题 ══════════════════════════════════════ -->
    <transition name="screen-fade">
    <div v-if="screen === 'game'" class="game-screen" :style="{ background: gameBg }">

      <!-- 顶部 -->
      <div class="game-header">
        <button class="back-btn ghost" @click="confirmExit">◀</button>
        <div class="game-progress-wrap">
          <div class="gp-label">{{ currentGameMode === 'adventure' ? currentAreaName : currentLevelName }}</div>
          <div class="gp-bar">
            <div class="gp-fill" :style="{ width: gameProgress + '%' }"></div>
            <div class="gp-bear" :style="{ left: Math.max(0, gameProgress - 4) + '%' }">🐻</div>
          </div>
          <div class="gp-count">{{ qIndex + 1 }}/{{ totalQ }}</div>
        </div>
        <div class="game-score-chip">⭐ {{ gameScore }}</div>
      </div>

      <!-- 题目卡 -->
      <div class="question-zone">
        <transition name="q-slide" mode="out-in">
        <div class="question-card" :key="qKey" :class="{ shake: shaking }">

          <!-- 故事情境（冒险模式） -->
          <div class="story-context" v-if="currentQ.story">
            <div class="story-scene">{{ currentQ.storyScene }}</div>
            <div class="story-text">{{ currentQ.story }}</div>
          </div>

          <!-- 题目文字 -->
          <div class="q-text">{{ currentQ.displayText || currentQ.text }}</div>

          <!-- 视觉辅助区 -->
          <div class="q-visual" v-if="currentQ.visual">

            <!-- 数数类：可数的物品展示 -->
            <div class="count-visual" v-if="currentQ.visual === 'count'">
              <transition-group name="item-pop" tag="div" class="items-grid">
                <span
                  v-for="(item, i) in currentQ.items"
                  :key="i"
                  class="count-item"
                  :style="{ animationDelay: i * 0.08 + 's' }"
                >{{ item }}</span>
              </transition-group>
            </div>

            <!-- 加法：两组物品 -->
            <div class="add-visual" v-else-if="currentQ.visual === 'add'">
              <div class="add-group">
                <span v-for="(it, i) in currentQ.itemsA" :key="'a'+i" class="count-item">{{ it }}</span>
              </div>
              <div class="plus-sign">➕</div>
              <div class="add-group">
                <span v-for="(it, i) in currentQ.itemsB" :key="'b'+i" class="count-item">{{ it }}</span>
              </div>
              <div class="equals-sign">＝</div>
              <div class="q-mark">？</div>
            </div>

            <!-- 减法：划掉 -->
            <div class="sub-visual" v-else-if="currentQ.visual === 'sub'">
              <div class="sub-group">
                <span
                  v-for="(it, i) in currentQ.allItems"
                  :key="i"
                  class="count-item"
                  :class="{ crossed: i >= currentQ.answer }"
                >{{ it }}</span>
              </div>
              <div class="sub-hint">（去掉了 {{ currentQ.b }} 个）</div>
            </div>

            <!-- 乘法：分组展示 "几个几" -->
            <div class="mul-visual" v-else-if="currentQ.visual === 'mul'">
              <div class="mul-row" v-for="(grp, gi) in currentQ.groups" :key="gi">
                <div class="mul-group">
                  <span v-for="(it, ii) in grp" :key="ii" class="count-item">{{ it }}</span>
                </div>
                <div class="mul-sep" v-if="gi < currentQ.groups.length - 1">│</div>
              </div>
              <div class="mul-desc">{{ currentQ.mulDesc }}</div>
            </div>

            <!-- 数字认识：大数字配物品 -->
            <div class="number-visual" v-else-if="currentQ.visual === 'number'">
              <div class="big-number">{{ currentQ.displayNumber }}</div>
              <div class="number-items">
                <span v-for="(it, i) in currentQ.items" :key="i" class="count-item sm">{{ it }}</span>
              </div>
            </div>

            <!-- 比大小 -->
            <div class="compare-visual" v-else-if="currentQ.visual === 'compare'">
              <div class="cmp-num">{{ currentQ.numA }}</div>
              <div class="cmp-mid">___</div>
              <div class="cmp-num">{{ currentQ.numB }}</div>
            </div>

          </div><!-- end visual -->

          <!-- 语音按钮 -->
          <button class="voice-fab" @click="speakQuestion">🔊</button>
        </div>
        </transition>
      </div>

      <!-- 答案区 -->
      <div class="answer-zone">
        <!-- 选择类答案 -->
        <div class="choice-grid" v-if="currentQ.type === 'choice'">
          <button
            v-for="(opt, i) in currentQ.options"
            :key="i"
            class="choice-btn"
            :class="{
              'chosen': chosen === i,
              'correct': answered && opt === currentQ.answer,
              'wrong': answered && chosen === i && opt !== currentQ.answer
            }"
            @click="pickAnswer(opt, i)"
            :disabled="answered"
          >
            <span class="choice-emoji" v-if="opt.emoji">{{ opt.emoji }}</span>
            <span class="choice-val">{{ typeof opt === 'object' ? opt.label : opt }}</span>
          </button>
        </div>

        <!-- 排序类（比大小用符号选择） -->
        <div class="symbol-choice" v-if="currentQ.type === 'symbol'">
          <button
            v-for="sym in ['＜', '＝', '＞']"
            :key="sym"
            class="sym-btn"
            :class="{ chosen: chosen === sym, correct: answered && sym === currentQ.answer, wrong: answered && chosen === sym && sym !== currentQ.answer }"
            @click="pickSymbol(sym)"
            :disabled="answered"
          >{{ sym }}</button>
        </div>
      </div>

      <!-- 答题后反馈 -->
      <transition name="pop">
      <div class="feedback-bar" v-if="answered" :class="lastCorrect ? 'fb-correct' : 'fb-wrong'">
        <div class="fb-emoji">{{ lastCorrect ? feedbackEmoji : '🤔' }}</div>
        <div class="fb-msg">{{ lastCorrect ? feedbackMsg : wrongMsg }}</div>
        <button class="fb-next" @click="doNext">
          {{ qIndex + 1 >= totalQ ? '🎉 看结果' : (lastCorrect ? '下一题 ▶' : '再试试 💪') }}
        </button>
      </div>
      </transition>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 关卡结算 ══════════════════════════════════════ -->
    <transition name="pop">
    <div class="result-overlay" v-if="screen === 'result'">
      <div class="result-card">
        <div class="result-confetti">
          <span v-for="n in 20" :key="n" class="confetti-piece" :style="getConfettiStyle(n)">
            {{ ['⭐','🎉','✨','🎊','💫'][n%5] }}
          </span>
        </div>
        <div class="result-bear">{{ resultBear }}</div>
        <h2 class="result-title">{{ resultTitle }}</h2>
        <div class="result-stars">
          <span
            v-for="n in 3"
            :key="n"
            class="result-star"
            :class="{ lit: n <= resultStars }"
            :style="{ animationDelay: n * 0.3 + 's' }"
          >⭐</span>
        </div>
        <div class="result-stats">
          <div class="rs-item"><span class="rs-label">答对</span><span class="rs-val green">{{ correctCount }}/{{ totalQ }}</span></div>
          <div class="rs-item"><span class="rs-label">得分</span><span class="rs-val yellow">+{{ gameScore }}⭐</span></div>
          <div class="rs-item"><span class="rs-label">正确率</span><span class="rs-val blue">{{ Math.round(correctCount/totalQ*100) }}%</span></div>
        </div>
        <!-- 新成就 -->
        <div class="new-ach" v-if="newAchievements.length > 0">
          <div class="na-title">🎊 新成就！</div>
          <div class="na-badges">
            <div class="na-badge" v-for="a in newAchievements" :key="a.id">{{ a.icon }} {{ a.name }}</div>
          </div>
        </div>
        <div class="result-actions">
          <button class="ra-btn primary" @click="playAgain">🔄 再玩一次</button>
          <button class="ra-btn secondary" @click="returnHome">🏠 回主页</button>
        </div>
      </div>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 成就 ══════════════════════════════════════ -->
    <transition name="screen-fade">
    <div v-if="screen === 'achievements'" class="achievements-screen">
      <div class="page-header">
        <button class="back-btn" @click="screen = 'main'">◀ 返回</button>
        <h2>🏅 成就</h2>
        <div class="ach-count">{{ unlockedCount }}/{{ allAchievements.length }}</div>
      </div>
      <div class="ach-grid">
        <div
          class="ach-card"
          v-for="a in allAchievements"
          :key="a.id"
          :class="{ unlocked: isUnlocked(a.id), locked: !isUnlocked(a.id) }"
        >
          <div class="ach-icon-big">{{ isUnlocked(a.id) ? a.icon : '🔒' }}</div>
          <div class="ach-name">{{ a.name }}</div>
          <div class="ach-desc">{{ a.desc }}</div>
          <div class="ach-unlocked-at" v-if="isUnlocked(a.id)">✅ 已获得</div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 家长报告 ══════════════════════════════════════ -->
    <transition name="screen-fade">
    <div v-if="screen === 'parent'" class="parent-screen">
      <div class="page-header">
        <button class="back-btn" @click="screen = prevScreen || 'main'">◀ 返回</button>
        <h2>👨‍👩‍👧 家长报告</h2>
        <div></div>
      </div>

      <!-- 选择哪个小朋友 -->
      <div class="parent-profile-tabs">
        <div
          class="ppt"
          v-for="p in profiles"
          :key="p.id"
          :class="{ active: parentViewId === p.id }"
          @click="parentViewId = p.id"
        >{{ p.avatar }} {{ p.name }}</div>
      </div>

      <div class="parent-content" v-if="parentProfile">
        <div class="pr-section">
          <div class="pr-title">📈 总体数据</div>
          <div class="pr-cards">
            <div class="prc blue"><div class="prc-v">{{ parentProfile.totalScore }}</div><div class="prc-l">⭐ 星星</div></div>
            <div class="prc green"><div class="prc-v">{{ parentProfile.totalAnswered || 0 }}</div><div class="prc-l">📝 答题数</div></div>
            <div class="prc orange"><div class="prc-v">{{ parentAccuracy }}%</div><div class="prc-l">🎯 正确率</div></div>
            <div class="prc purple"><div class="prc-v">{{ parentProfile.streakDays || 1 }}天</div><div class="prc-l">🔥 连续</div></div>
          </div>
        </div>

        <div class="pr-section">
          <div class="pr-title">📊 各模块掌握</div>
          <div class="skill-bars">
            <div class="sk-row" v-for="sk in parentSkills" :key="sk.name">
              <div class="sk-label">{{ sk.icon }} {{ sk.name }}</div>
              <div class="sk-bar-wrap">
                <div class="sk-bar" :style="{ width: sk.pct + '%', background: sk.color }"></div>
              </div>
              <div class="sk-pct">{{ sk.pct }}%</div>
            </div>
          </div>
        </div>

        <div class="pr-section">
          <div class="pr-title">🗺️ 冒险进度</div>
          <div class="adv-progress">
            <div class="adp-row" v-for="area in parentProfile.areaProgress || islandAreas" :key="area.id || area.name">
              <div class="adp-emoji">{{ area.emoji }}</div>
              <div class="adp-name">{{ area.name }}</div>
              <div class="adp-status">
                <span v-if="area.completed" class="s-done">✅ 完成</span>
                <span v-else-if="area.unlocked" class="s-active">🔓 进行中</span>
                <span v-else class="s-locked">🔒</span>
              </div>
              <div class="adp-stars" v-if="area.unlocked">
                <span v-for="n in 3" :key="n">{{ n <= area.stars ? '⭐' : '✦' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pr-section tips-section">
          <div class="pr-title">💡 给家长的建议</div>
          <div class="tip-list">
            <div class="tip" v-for="(t,i) in parentTips" :key="i">{{ t }}</div>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ══════════════════════════════════════ 设置弹窗 ══════════════════════════════════════ -->
    <div class="modal-backdrop" v-if="showSettings" @click.self="showSettings = false">
      <div class="settings-modal">
        <div class="sm-header">⚙️ 设置</div>
        <div class="sm-body">
          <div class="sm-row">
            <span>每日时长</span>
            <select v-model="settings.dailyMinutes" class="sm-select">
              <option :value="10">10分钟（3岁）</option>
              <option :value="15">15分钟（4岁）</option>
              <option :value="20">20分钟（5岁）</option>
              <option :value="30">30分钟（6岁）</option>
            </select>
          </div>
          <div class="sm-row">
            <span>语音朗读</span>
            <label class="toggle"><input type="checkbox" v-model="settings.voice"/><span class="slider"></span></label>
          </div>
          <div class="sm-row">
            <span>护眼暖色</span>
            <label class="toggle"><input type="checkbox" v-model="settings.eyeProtection"/><span class="slider"></span></label>
          </div>
          <div class="sm-row">
            <span>音效反馈</span>
            <label class="toggle"><input type="checkbox" v-model="settings.soundEffect"/><span class="slider"></span></label>
          </div>
        </div>
        <button class="sm-save" @click="saveSettings">保存 ✓</button>
      </div>
    </div>

    <!-- 粒子爆炸 -->
    <div class="burst-layer" v-if="showBurst">
      <div
        class="burst-star"
        v-for="n in 16"
        :key="n"
        :style="getBurstStyle(n)"
      >{{ ['⭐','✨','🎉','💫'][n%4] }}</div>
    </div>

  </div>
</template>

<script>
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'

// ──────── 题目生成引擎 ────────
const EMOJIS = {
  fruits: ['🍎','🍊','🍋','🍇','🍓','🍒','🍑','🫐','🍉','🍌'],
  animals: ['🐱','🐶','🐰','🐻','🐼','🐨','🦊','🐸','🐮','🦁'],
  stars: ['⭐','🌟','💫','✨','🌙'],
  flowers: ['🌸','🌺','🌻','🌼','🌷'],
  cookies: ['🍪','🧁','🎂','🍩','🍰'],
  toys: ['🎈','🎀','🎁','🎠','🎪'],
  sea: ['🐟','🦀','🐚','🌊','🦋'],
}

function randEmoji(set = 'fruits') {
  const arr = EMOJIS[set] || EMOJIS.fruits
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeOptions(answer, min = 0, max = 20, count = 4) {
  const opts = new Set([answer])
  const deltas = shuffle([-3,-2,-1,1,2,3,4,-4])
  for (const d of deltas) {
    if (opts.size >= count) break
    const v = answer + d
    if (v >= min && v <= max && v !== answer) opts.add(v)
  }
  while (opts.size < count) {
    const v = randInt(min, Math.min(max, answer + 5))
    if (!opts.has(v)) opts.add(v)
  }
  return shuffle([...opts])
}

// ──────── 题型生成函数 ────────

// 数字认识（3岁）
function genCountQ(max = 5) {
  const emojiSet = shuffle(Object.keys(EMOJIS))[0]
  const emoji = randEmoji(emojiSet)
  const n = randInt(1, max)
  const items = Array(n).fill(emoji)
  const storyTexts = [
    `海滩上有几个贝壳？`,
    `树上有几个果子？`,
    `花园里有几朵花？`,
    `篮子里有几个苹果？`,
    `小熊的朋友有几个？`,
  ]
  return {
    text: storyTexts[randInt(0, storyTexts.length - 1)],
    displayText: `数一数，有几个 ${emoji}？`,
    visual: 'count',
    items,
    answer: n,
    type: 'choice',
    options: makeOptions(n, 1, max + 2, 4),
  }
}

// 加法
function genAddQ(max = 10) {
  const half = Math.floor(max / 2)
  const a = randInt(0, max - 1)
  const b = randInt(1, max - a)
  if (a + b > max) return genAddQ(max)
  const emojiA = randEmoji('fruits')
  const emojiB = a === b ? randEmoji('animals') : randEmoji('fruits')
  const stories = [
    { story: `小熊有 ${a} 个苹果，妈妈又给了 ${b} 个。`, storyScene: '🏠🍎', a, b },
    { story: `池塘里游来 ${a} 只鸭子，又游来 ${b} 只。`, storyScene: '🌊🦆', a, b },
    { story: `花园里有 ${a} 朵花，又开了 ${b} 朵。`, storyScene: '🌻🌸', a, b },
    { story: `碗里有 ${a} 颗糖，小兔又放了 ${b} 颗。`, storyScene: '🐰🍬', a, b },
  ]
  const s = stories[randInt(0, stories.length - 1)]
  return {
    text: `${a} ＋ ${b} ＝ ？`,
    displayText: `${a} ＋ ${b} ＝ ？`,
    story: s.story,
    storyScene: s.storyScene,
    visual: 'add',
    itemsA: Array(a).fill(emojiA),
    itemsB: Array(b).fill(emojiB),
    answer: a + b,
    a, b,
    type: 'choice',
    options: makeOptions(a + b, 0, max + 2, 4),
  }
}

// 减法
function genSubQ(max = 10) {
  const total = randInt(2, max)
  const b = randInt(1, total)
  const answer = total - b
  const emoji = randEmoji('fruits')
  const stories = [
    { story: `小熊有 ${total} 个苹果，吃掉了 ${b} 个，还剩几个？`, storyScene: '🐻🍎' },
    { story: `树上有 ${total} 只小鸟，飞走了 ${b} 只，还剩几只？`, storyScene: '🌳🐦' },
    { story: `盘子里有 ${total} 块饼干，小狗吃了 ${b} 块，还剩几块？`, storyScene: '🐶🍪' },
    { story: `花瓶里有 ${total} 朵花，掉落了 ${b} 朵，还剩几朵？`, storyScene: '🌸💧' },
  ]
  const s = stories[randInt(0, stories.length - 1)]
  return {
    text: `${total} － ${b} ＝ ？`,
    displayText: `${total} － ${b} ＝ ？`,
    story: s.story,
    storyScene: s.storyScene,
    visual: 'sub',
    allItems: Array(total).fill(emoji),
    answer,
    b,
    type: 'choice',
    options: makeOptions(answer, 0, max, 4),
  }
}

// 混合（加减混合随机出）
function genMixQ(max = 10) {
  return Math.random() > 0.5 ? genAddQ(max) : genSubQ(max)
}

// 乘法（直观"几个几"方式展示，用于5-6岁）
function genMulQ(multipliers = [2, 3]) {
  const a = multipliers[randInt(0, multipliers.length - 1)]
  const b = randInt(1, 5)
  const answer = a * b
  const emoji = randEmoji(shuffle(Object.keys(EMOJIS))[0])
  const groups = Array(b).fill(null).map(() => Array(a).fill(emoji))
  const mulDescTemplates = [
    `${b} 组，每组 ${a} 个，一共有几个？`,
    `${b} 排，每排 ${a} 朵，共有几朵？`,
    `${b} 筐，每筐 ${a} 个，总共多少？`,
  ]
  const stories = [
    { story: `小熊把${emoji}分成 ${b} 组，每组 ${a} 个，一共有几个？`, storyScene: '🐻' + emoji },
    { story: `花园里有 ${b} 排花，每排 ${a} 朵，共有几朵花？`, storyScene: '🌻' },
    { story: `桌上有 ${b} 盘${emoji}，每盘 ${a} 个，共几个？`, storyScene: '🍽️' + emoji },
  ]
  const s = stories[randInt(0, stories.length - 1)]
  return {
    text: `${b} 个 ${a} ＝ ？`,
    displayText: `${b} × ${a} ＝ ？`,
    story: s.story,
    storyScene: s.storyScene,
    visual: 'mul',
    groups,
    mulDesc: mulDescTemplates[randInt(0, mulDescTemplates.length - 1)],
    answer,
    type: 'choice',
    options: makeOptions(answer, 1, 30, 4),
  }
}

// 比大小（5-6岁）
function genCompareQ(max = 10) {
  const a = randInt(0, max)
  let b = randInt(0, max)
  while (b === a) b = randInt(0, max)
  const answer = a < b ? '＜' : a > b ? '＞' : '＝'
  return {
    text: `${a} ○ ${b}`,
    displayText: `${a} ○ ${b}，填入正确的符号`,
    visual: 'compare',
    numA: a,
    numB: b,
    answer,
    type: 'symbol',
  }
}

// ──────── 关卡配置 ────────
const PRACTICE_CATEGORIES = [
  {
    title: '数数认知',
    emoji: '🔢',
    ageHint: '3-4岁',
    levels: [
      { key: 'count5', name: '数一数（1-5）', desc: '认识1到5个物品', icon: '🍎', gen: () => genCountQ(5), age: 3 },
      { key: 'count10', name: '数一数（1-10）', desc: '认识1到10个物品', icon: '🔟', gen: () => genCountQ(10), age: 4 },
    ]
  },
  {
    title: '加法',
    emoji: '➕',
    ageHint: '4-5岁',
    levels: [
      { key: 'add5', name: '5以内加法', desc: '小数目的加法', icon: '🍊', gen: () => genAddQ(5), age: 4 },
      { key: 'add10', name: '10以内加法', desc: '10以内加法', icon: '🍇', gen: () => genAddQ(10), age: 5 },
    ]
  },
  {
    title: '减法',
    emoji: '➖',
    ageHint: '4-5岁',
    levels: [
      { key: 'sub5', name: '5以内减法', desc: '小数目的减法', icon: '🍓', gen: () => genSubQ(5), age: 4 },
      { key: 'sub10', name: '10以内减法', desc: '10以内减法', icon: '🍒', gen: () => genSubQ(10), age: 5 },
    ]
  },
  {
    title: '混合练习',
    emoji: '🔀',
    ageHint: '5岁',
    levels: [
      { key: 'mix5', name: '5以内混合', desc: '加减法混合', icon: '🌈', gen: () => genMixQ(5), age: 5 },
      { key: 'mix10', name: '10以内混合', desc: '加减法混合', icon: '🌟', gen: () => genMixQ(10), age: 5 },
    ]
  },
  {
    title: '乘法入门',
    emoji: '✖️',
    ageHint: '5-6岁',
    levels: [
      { key: 'mul23', name: '2和3的乘法', desc: '直观理解几个几', icon: '✖️', gen: () => genMulQ([2,3]), age: 5 },
      { key: 'mul45', name: '4和5的乘法', desc: '分组计数乘法', icon: '🌠', gen: () => genMulQ([4,5]), age: 6 },
    ]
  },
  {
    title: '比大小',
    emoji: '⚖️',
    ageHint: '5-6岁',
    levels: [
      { key: 'cmp5', name: '比大小（1-5）', desc: '填＜＝＞', icon: '🏆', gen: () => genCompareQ(5), age: 5 },
      { key: 'cmp10', name: '比大小（1-10）', desc: '填＜＝＞', icon: '🎯', gen: () => genCompareQ(10), age: 6 },
    ]
  },
]

// ──────── 冒险模式区域配置 ────────
const ISLAND_AREAS = [
  {
    id: 'orchard', name: '苹果园', emoji: '🍎',
    bg: 'linear-gradient(160deg, #a8edea 0%, #fed6e3 100%)',
    unlocked: true, completed: false, stars: 0,
    genQ: () => genMixQ(5),
    stories: ['帮小熊采苹果！', '苹果树上有好多苹果！', '把苹果装进篮子里！'],
    minAge: 3,
  },
  {
    id: 'beach', name: '阳光沙滩', emoji: '🏖️',
    bg: 'linear-gradient(160deg, #f6d365 0%, #fda085 100%)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => genMixQ(8),
    stories: ['沙滩上找贝壳！', '帮小鸟计数！', '海浪来了！'],
    minAge: 4,
  },
  {
    id: 'park', name: '欢乐游乐园', emoji: '🎢',
    bg: 'linear-gradient(160deg, #89f7fe 0%, #66a6ff 100%)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => genMixQ(10),
    stories: ['旋转木马来了！', '气球飞起来啦！', '排队玩滑梯！'],
    minAge: 4,
  },
  {
    id: 'treehouse', name: '神奇树屋', emoji: '🌲',
    bg: 'linear-gradient(160deg, #d4fc79 0%, #96e6a1 100%)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => { return Math.random() > 0.3 ? genMixQ(10) : genMulQ([2,3]) },
    stories: ['爬上大树！', '松鼠在藏果子！', '鸟儿在唱歌！'],
    minAge: 5,
  },
  {
    id: 'cave', name: '魔法水晶洞', emoji: '🔮',
    bg: 'linear-gradient(160deg, #c3cfe2 0%, #c3cfe2 100%)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => { return Math.random() > 0.4 ? genMixQ(15) : genMulQ([2,3,4]) },
    stories: ['发现魔法水晶！', '洞里藏着宝藏！', '萤火虫飞来啦！'],
    minAge: 5,
  },
  {
    id: 'volcano', name: '彩虹火山', emoji: '🌋',
    bg: 'linear-gradient(160deg, #f093fb 0%, #f5576c 100%)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => { return Math.random() > 0.5 ? genMixQ(20) : genMulQ([2,3,4,5]) },
    stories: ['彩虹从火山升起！', '神秘宝石在哪里？', '最后的挑战！'],
    minAge: 6,
  },
]

// ──────── 成就配置 ────────
const ACHIEVEMENTS = [
  { id: 'first_answer', icon: '🌱', name: '第一步', desc: '完成第一道题' },
  { id: 'first_perfect', icon: '💯', name: '完美！', desc: '一关全部答对' },
  { id: 'score10', icon: '🌟', name: '小星星', desc: '累计10颗星星' },
  { id: 'score50', icon: '⭐', name: '星星收集家', desc: '累计50颗星星' },
  { id: 'score100', icon: '🌠', name: '星际旅行者', desc: '累计100颗星星' },
  { id: 'streak3', icon: '🔥', name: '坚持小达人', desc: '连续3天学习' },
  { id: 'streak7', icon: '🌈', name: '学习超人', desc: '连续7天学习' },
  { id: 'unlock_beach', icon: '🏖️', name: '探险家', desc: '解锁沙滩' },
  { id: 'unlock_all', icon: '🗺️', name: '岛主', desc: '解锁所有区域' },
  { id: 'mul_first', icon: '✖️', name: '乘法初体验', desc: '完成乘法练习' },
  { id: 'compare_first', icon: '⚖️', name: '大小高手', desc: '完成比大小练习' },
  { id: 'answered100', icon: '📚', name: '小学霸', desc: '累计答题100道' },
  { id: 'no_wrong', icon: '🏅', name: '零失误', desc: '一关没有错误' },
  { id: 'speed', icon: '⚡', name: '小闪电', desc: '10题全对' },
]

// ──────── 本地存储工具 ────────
const STORAGE_KEY = 'bearMath_v3'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

// ──────── 默认 profile ────────
function makeDefaultProfile(id, name, avatar, age) {
  return {
    id,
    name,
    avatar,
    age,
    totalScore: 0,
    streakDays: 1,
    totalAnswered: 0,
    totalCorrect: 0,
    lastPlayDate: '',
    unlockedAchievements: [],
    levelStars: {},
    subjectStats: {},
    areaProgress: JSON.parse(JSON.stringify(ISLAND_AREAS)).map(a => ({
      id: a.id, name: a.name, emoji: a.emoji,
      unlocked: a.id === 'orchard', completed: false, stars: 0
    })),
  }
}

export default {
  name: 'GameUI',
  setup() {
    // ── 应用状态 ──
    const screen = ref('child-select')
    const prevScreen = ref('')
    const showSettings = ref(false)
    const showAddProfile = ref(false)
    const showBurst = ref(false)
    const bearWalking = ref(false)

    const settings = reactive({
      dailyMinutes: 15,
      voice: true,
      eyeProtection: false,
      soundEffect: true,
    })

    // ── 用户数据 ──
    const appData = reactive({ profiles: [], settings: {} })

    const profiles = computed(() => appData.profiles)
    const currentProfileId = ref(null)
    const currentProfile = computed(() =>
      appData.profiles.find(p => p.id === currentProfileId.value) || appData.profiles[0] || makeDefaultProfile('default','小朋友','🐻',4)
    )

    const avatarOptions = ['🐻','🐼','🐱','🐶','🐰','🦊','🐸','🦁','🐮','🐧','🦄','🐯']

    const newProfile = reactive({ name: '', avatar: '🐻', age: 4 })

    function createProfile() {
      if (!newProfile.name.trim()) return
      const id = 'p_' + Date.now()
      const p = makeDefaultProfile(id, newProfile.name.trim(), newProfile.avatar, newProfile.age)
      appData.profiles.push(p)
      saveAppData()
      showAddProfile.value = false
      newProfile.name = ''
      newProfile.avatar = '🐻'
      newProfile.age = 4
    }

    function selectProfile(profile) {
      currentProfileId.value = profile.id
      updateStreak(profile)
      screen.value = 'main'
      animateBear()
    }

    function updateStreak(profile) {
      const today = new Date().toDateString()
      if (profile.lastPlayDate === today) return
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (profile.lastPlayDate === yesterday) {
        profile.streakDays = (profile.streakDays || 1) + 1
      } else if (profile.lastPlayDate !== today) {
        profile.streakDays = 1
      }
      profile.lastPlayDate = today
      saveAppData()
    }

    function animateBear() {
      bearWalking.value = true
      setTimeout(() => { bearWalking.value = false }, 2000)
    }

    // ── 岛屿地图（每个profile独立） ──
    const islandAreas = computed(() => {
      if (!currentProfile.value) return ISLAND_AREAS
      return currentProfile.value.areaProgress || ISLAND_AREAS
    })

    // ── 计时 ──
    const remainingSeconds = ref(0)
    let timerInterval = null

    function startTimer() {
      remainingSeconds.value = (settings.dailyMinutes || 15) * 60
      clearInterval(timerInterval)
      timerInterval = setInterval(() => {
        if (remainingSeconds.value > 0) remainingSeconds.value--
      }, 1000)
    }

    const remainingTimeStr = computed(() => {
      const m = Math.floor(remainingSeconds.value / 60)
      const s = remainingSeconds.value % 60
      return `${m}:${String(s).padStart(2,'0')}`
    })

    // ── 游戏状态 ──
    const currentGameMode = ref('practice') // 'adventure' | 'practice'
    const currentAreaId = ref('')
    const currentLevelKey = ref('')
    const currentLevelName = ref('')
    const currentAreaName = ref('')
    const gameBg = ref('linear-gradient(160deg,#a8edea 0%,#fed6e3 100%)')

    const questions = ref([])
    const qIndex = ref(0)
    const totalQ = ref(10)
    const gameScore = ref(0)
    const correctCount = ref(0)
    const wrongCount = ref(0)
    const answered = ref(false)
    const chosen = ref(null)
    const lastCorrect = ref(false)
    const shaking = ref(false)
    const qKey = ref(0)

    const currentQ = computed(() => questions.value[qIndex.value] || {})
    const gameProgress = computed(() => Math.round((qIndex.value / totalQ.value) * 100))

    // 完成结果
    const resultStars = ref(0)
    const resultTitle = ref('')
    const resultBear = ref('🐻')
    const newAchievements = ref([])

    const feedbackEmoji = ref('🎉')
    const feedbackMsg = ref('太棒了！')
    const wrongMsg = computed(() => {
      const ans = currentQ.value?.answer
      if (currentQ.value?.type === 'symbol') return `正确答案是「${ans}」，再试试！`
      return `正确答案是 ${ans}，没关系，再来！😊`
    })

    const CORRECT_MSGS = [
      ['🎉','真厉害！答对了！'],
      ['🌟','好聪明！加油！'],
      ['✨','棒棒哒！继续！'],
      ['🚀','超厉害！太棒了！'],
      ['💯','完美！你最棒！'],
    ]

    function genQuestions(genFn, count = 10) {
      const qs = []
      for (let i = 0; i < count; i++) qs.push(genFn())
      return qs
    }

    function startPractice(level) {
      currentGameMode.value = 'practice'
      currentLevelKey.value = level.key
      currentLevelName.value = level.name
      gameBg.value = 'linear-gradient(160deg,#667eea 0%,#764ba2 100%)'
      questions.value = genQuestions(level.gen, 10)
      resetGameState()
      screen.value = 'game'
      speakText('开始练习！加油！')
    }

    function enterArea(area) {
      const areaConfig = ISLAND_AREAS.find(a => a.id === area.id)
      if (!areaConfig) return
      currentGameMode.value = 'adventure'
      currentAreaId.value = area.id
      currentAreaName.value = area.name
      gameBg.value = areaConfig.bg
      questions.value = genQuestions(areaConfig.genQ, 8)
      // 给冒险故事加上area的故事配置
      questions.value = questions.value.map((q, i) => ({
        ...q,
        story: q.story || areaConfig.stories[i % areaConfig.stories.length],
        storyScene: q.storyScene || areaConfig.emoji,
      }))
      resetGameState()
      screen.value = 'game'
      animateBear()
      speakText(`进入${area.name}，开始冒险！`)
    }

    function resetGameState() {
      qIndex.value = 0
      totalQ.value = questions.value.length
      gameScore.value = 0
      correctCount.value = 0
      wrongCount.value = 0
      answered.value = false
      chosen.value = null
      lastCorrect.value = false
      shaking.value = false
      qKey.value++
    }

    function pickAnswer(opt, idx) {
      if (answered.value) return
      chosen.value = idx
      answered.value = true
      const correct = (typeof opt === 'object' ? opt.value : opt) === currentQ.value.answer
      lastCorrect.value = correct

      if (correct) {
        correctCount.value++
        gameScore.value += wrongCount.value === 0 ? 15 : 10
        const [em, msg] = CORRECT_MSGS[randInt(0, CORRECT_MSGS.length - 1)]
        feedbackEmoji.value = em
        feedbackMsg.value = msg
        triggerBurst()
        speakText(msg)
      } else {
        wrongCount.value++
        shaking.value = true
        setTimeout(() => { shaking.value = false }, 600)
        speakText('没关系，再想想！')
      }

      // 记录统计
      recordStat(currentLevelKey.value || currentAreaId.value, correct)
    }

    function pickSymbol(sym) {
      if (answered.value) return
      chosen.value = sym
      answered.value = true
      const correct = sym === currentQ.value.answer
      lastCorrect.value = correct

      if (correct) {
        correctCount.value++
        gameScore.value += 10
        const [em, msg] = CORRECT_MSGS[randInt(0, CORRECT_MSGS.length - 1)]
        feedbackEmoji.value = em
        feedbackMsg.value = msg
        triggerBurst()
        speakText(msg)
      } else {
        wrongCount.value++
        shaking.value = true
        setTimeout(() => { shaking.value = false }, 600)
        speakText('再试试！')
      }
      recordStat(currentLevelKey.value, correct)
    }

    function doNext() {
      if (!lastCorrect.value) {
        // 答错：关闭反馈，重答
        answered.value = false
        chosen.value = null
        return
      }
      answered.value = false
      chosen.value = null
      if (qIndex.value + 1 >= totalQ.value) {
        finishGame()
      } else {
        qIndex.value++
        qKey.value++
        speakQuestion()
      }
    }

    function finishGame() {
      const acc = correctCount.value / totalQ.value
      resultStars.value = acc >= 1 ? 3 : acc >= 0.7 ? 2 : 1
      resultTitle.value = acc >= 1 ? '完美通关！🎊' : acc >= 0.7 ? '非常棒！🌟' : '继续加油！💪'
      resultBear.value = acc >= 1 ? '🥳' : acc >= 0.7 ? '😄' : '🐻'

      // 更新分数
      const p = currentProfile.value
      p.totalScore += gameScore.value
      p.totalAnswered = (p.totalAnswered || 0) + totalQ.value
      p.totalCorrect = (p.totalCorrect || 0) + correctCount.value

      // 更新冒险进度
      if (currentGameMode.value === 'adventure') {
        const area = p.areaProgress.find(a => a.id === currentAreaId.value)
        if (area) {
          area.completed = true
          area.stars = Math.max(area.stars || 0, resultStars.value)
          // 解锁下一关
          const idx = p.areaProgress.findIndex(a => a.id === currentAreaId.value)
          if (idx >= 0 && idx < p.areaProgress.length - 1) {
            p.areaProgress[idx + 1].unlocked = true
          }
        }
      }

      // 更新练习星级
      if (currentGameMode.value === 'practice' && currentLevelKey.value) {
        if (!p.levelStars) p.levelStars = {}
        p.levelStars[currentLevelKey.value] = Math.max(p.levelStars[currentLevelKey.value] || 0, resultStars.value)
      }

      // 检查成就
      newAchievements.value = checkAchievements(p)

      saveAppData()
      screen.value = 'result'
      speakText(resultTitle.value)
    }

    function playAgain() {
      if (currentGameMode.value === 'adventure') {
        const areaConfig = ISLAND_AREAS.find(a => a.id === currentAreaId.value)
        if (areaConfig) {
          questions.value = genQuestions(areaConfig.genQ, 8)
          questions.value = questions.value.map((q, i) => ({
            ...q,
            story: q.story || areaConfig.stories[i % areaConfig.stories.length],
          }))
        }
      } else {
        const level = PRACTICE_CATEGORIES.flatMap(c => c.levels).find(l => l.key === currentLevelKey.value)
        if (level) questions.value = genQuestions(level.gen, 10)
      }
      resetGameState()
      screen.value = 'game'
    }

    function returnHome() {
      newAchievements.value = []
      screen.value = 'main'
      animateBear()
    }

    function confirmExit() {
      screen.value = currentGameMode.value === 'practice' ? 'practice' : 'main'
    }

    // ── 成就系统 ──
    const allAchievements = ACHIEVEMENTS

    function isUnlocked(id) {
      return currentProfile.value?.unlockedAchievements?.includes(id)
    }

    const unlockedCount = computed(() =>
      currentProfile.value?.unlockedAchievements?.length || 0
    )

    function checkAchievements(p) {
      if (!p.unlockedAchievements) p.unlockedAchievements = []
      const newly = []
      const tryUnlock = (id, cond) => {
        if (cond && !p.unlockedAchievements.includes(id)) {
          p.unlockedAchievements.push(id)
          newly.push(ACHIEVEMENTS.find(a => a.id === id))
        }
      }
      tryUnlock('first_answer', (p.totalAnswered || 0) >= 1)
      tryUnlock('first_perfect', correctCount.value === totalQ.value)
      tryUnlock('no_wrong', wrongCount.value === 0)
      tryUnlock('score10', p.totalScore >= 10)
      tryUnlock('score50', p.totalScore >= 50)
      tryUnlock('score100', p.totalScore >= 100)
      tryUnlock('streak3', p.streakDays >= 3)
      tryUnlock('streak7', p.streakDays >= 7)
      tryUnlock('answered100', p.totalAnswered >= 100)
      tryUnlock('unlock_beach', p.areaProgress?.find(a => a.id === 'beach')?.unlocked)
      tryUnlock('unlock_all', p.areaProgress?.every(a => a.unlocked))
      tryUnlock('mul_first', currentLevelKey.value.includes('mul'))
      tryUnlock('compare_first', currentLevelKey.value.includes('cmp'))
      tryUnlock('speed', correctCount.value >= 10 && wrongCount.value === 0)
      return newly.filter(Boolean)
    }

    // ── 统计记录 ──
    function recordStat(key, correct) {
      const p = currentProfile.value
      if (!p.subjectStats) p.subjectStats = {}
      if (!p.subjectStats[key]) p.subjectStats[key] = { total: 0, correct: 0 }
      p.subjectStats[key].total++
      if (correct) p.subjectStats[key].correct++
    }

    // ── 家长报告 ──
    const parentViewId = ref(null)
    const parentProfile = computed(() =>
      appData.profiles.find(p => p.id === parentViewId.value) || appData.profiles[0]
    )

    const parentAccuracy = computed(() => {
      const p = parentProfile.value
      if (!p || !p.totalAnswered) return 0
      return Math.round((p.totalCorrect || 0) / p.totalAnswered * 100)
    })

    const parentSkills = computed(() => {
      const p = parentProfile.value
      if (!p?.subjectStats) return []
      const map = {
        count5: { name: '数数1-5', icon: '🔢', color: '#7ec8e3' },
        count10: { name: '数数1-10', icon: '🔟', color: '#a8e6cf' },
        add5: { name: '加法5内', icon: '➕', color: '#ffd3b6' },
        add10: { name: '加法10内', icon: '➕', color: '#fdbd74' },
        sub5: { name: '减法5内', icon: '➖', color: '#ffaaa5' },
        sub10: { name: '减法10内', icon: '➖', color: '#ff8b94' },
        mix5: { name: '混合5内', icon: '🔀', color: '#c3b1e1' },
        mix10: { name: '混合10内', icon: '🔀', color: '#a29bfe' },
        mul23: { name: '乘法2/3', icon: '✖️', color: '#ffeaa7' },
        mul45: { name: '乘法4/5', icon: '✖️', color: '#fab1a0' },
        cmp5: { name: '比大小', icon: '⚖️', color: '#81ecec' },
      }
      return Object.entries(p.subjectStats).map(([key, stat]) => {
        const info = map[key] || { name: key, icon: '📝', color: '#ccc' }
        return {
          ...info,
          pct: stat.total ? Math.round((stat.correct / stat.total) * 100) : 0
        }
      }).filter(s => s.pct > 0)
    })

    const parentTips = computed(() => {
      const p = parentProfile.value
      if (!p) return []
      const tips = []
      const acc = parentAccuracy.value
      if (!p.totalAnswered) {
        tips.push('🌱 宝贝还没开始答题哦，从冒险模式开始吧！')
        return tips
      }
      if (acc >= 90) tips.push(`🌟 ${p.name}的正确率高达${acc}%，表现出色！可以尝试更难的题目了。`)
      else if (acc >= 70) tips.push(`👍 ${p.name}正确率${acc}%，稳步进步中！`)
      else tips.push(`💪 正确率${acc}%，建议从5以内加减法开始，打好基础。`)
      if (p.streakDays >= 3) tips.push(`🔥 已连续学习${p.streakDays}天，坚持得非常好！值得表扬！`)
      if (!p.areaProgress?.find(a => a.id === 'beach')?.unlocked) tips.push('🗺️ 试试完成苹果园区域，解锁沙滩冒险！')
      const subStats = p.subjectStats || {}
      const weakKeys = Object.entries(subStats).filter(([, s]) => s.total >= 5 && s.correct/s.total < 0.6)
      if (weakKeys.length > 0) tips.push(`📖 建议多练练这些模块：${weakKeys.map(([k])=>k).join('、')}。`)
      tips.push('⏰ 建议每天学习时间不超过20分钟，避免疲劳。')
      return tips
    })

    // ── 语音 ──
    function speakText(text) {
      if (!settings.voice) return
      try {
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'zh-CN'; u.pitch = 1.4; u.rate = 0.85
        speechSynthesis.cancel()
        speechSynthesis.speak(u)
      } catch {}
    }

    function speakQuestion() {
      if (!settings.voice) return
      const q = currentQ.value
      speakText(q.story || q.displayText || q.text || '')
    }

    // ── 粒子特效 ──
    function triggerBurst() {
      showBurst.value = true
      setTimeout(() => { showBurst.value = false }, 1000)
    }

    function getBurstStyle(n) {
      const angle = (n / 16) * 360
      const dist = 60 + Math.random() * 80
      const x = 50 + Math.cos(angle * Math.PI / 180) * dist * 0.6
      const y = 40 + Math.sin(angle * Math.PI / 180) * dist * 0.4
      return {
        left: x + '%',
        top: y + '%',
        animationDelay: (n * 0.04) + 's',
        fontSize: (1.2 + Math.random() * 0.8) + 'rem',
      }
    }

    function getConfettiStyle(n) {
      return {
        left: (5 + Math.random() * 90) + '%',
        top: (5 + Math.random() * 80) + '%',
        animationDelay: (n * 0.06) + 's',
        fontSize: (1 + Math.random() * 0.8) + 'rem',
        transform: `rotate(${Math.random() * 360}deg)`,
      }
    }

    // ── 设置 ──
    function saveSettings() {
      appData.settings = { ...settings }
      saveAppData()
      startTimer()
      showSettings.value = false
    }

    // ── 数据持久化（所有用户在同一个key下，按profile.id区分） ──
    function saveAppData() {
      saveData({ profiles: appData.profiles, settings: appData.settings })
    }

    function loadAppData() {
      const d = loadData()
      if (d) {
        if (d.profiles) appData.profiles = d.profiles
        if (d.settings) {
          Object.assign(settings, d.settings)
        }
      }
      // 兼容：如果没有profiles，创建默认
      if (!appData.profiles.length) {
        // 不自动创建，让用户自己创建
      }
    }

    // ── 练习分类 ──
    const practiceCategories = PRACTICE_CATEGORIES

    // ── 初始化 ──
    onMounted(() => {
      loadAppData()
      startTimer()
    })

    onUnmounted(() => {
      clearInterval(timerInterval)
    })

    // 进入家长报告时设置默认查看的profile
    watch(screen, (val) => {
      if (val === 'parent') {
        prevScreen.value = 'main'
        if (!parentViewId.value && appData.profiles.length > 0) {
          parentViewId.value = appData.profiles[0].id
        }
      }
    })

    return {
      screen, prevScreen, showSettings, showAddProfile, showBurst, bearWalking,
      settings, profiles, currentProfile, currentProfileId,
      avatarOptions, newProfile,
      islandAreas, remainingSeconds, remainingTimeStr,
      currentGameMode, currentAreaName, currentLevelName, gameBg,
      questions, qIndex, totalQ, gameScore, correctCount, wrongCount,
      answered, chosen, lastCorrect, shaking, qKey,
      currentQ, gameProgress,
      resultStars, resultTitle, resultBear, newAchievements,
      feedbackEmoji, feedbackMsg, wrongMsg,
      allAchievements, unlockedCount,
      parentViewId, parentProfile, parentAccuracy, parentSkills, parentTips,
      practiceCategories,

      selectProfile, createProfile,
      startPractice, enterArea, pickAnswer, pickSymbol, doNext,
      finishGame, playAgain, returnHome, confirmExit,
      isUnlocked, speakQuestion,
      getBurstStyle, getConfettiStyle, saveSettings,
    }
  }
}
</script>

<style scoped>
/* ════════ 全局基础 ════════ */
.app-root {
  min-height: 100vh;
  width: 100%;
  font-family: 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow-x: hidden;
  position: relative;
}

.app-root.warm-mode {
  filter: sepia(20%) brightness(0.95);
}

/* ════════ 过渡 ════════ */
.screen-fade-enter-active, .screen-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.screen-fade-enter-from { opacity: 0; transform: translateY(20px); }
.screen-fade-leave-to { opacity: 0; transform: translateY(-10px); }

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.7); }

.q-slide-enter-active, .q-slide-leave-active { transition: all 0.35s ease; }
.q-slide-enter-from { opacity: 0; transform: translateX(40px) scale(0.95); }
.q-slide-leave-to { opacity: 0; transform: translateX(-30px) scale(0.95); }

/* ════════ 儿童选择界面 ════════ */
.child-select-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  background: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
  overflow: hidden;
}

/* 云朵装饰 */
.clouds { position: absolute; top: 0; left: 0; right: 0; pointer-events: none; }
.cloud { position: absolute; font-size: 2.5rem; animation: cloudFloat 8s ease-in-out infinite; opacity: 0.7; }
.c1 { left: 5%; top: 8%; animation-delay: 0s; }
.c2 { right: 8%; top: 12%; animation-delay: 3s; }
.c3 { left: 40%; top: 5%; animation-delay: 1.5s; font-size: 2rem; }
@keyframes cloudFloat { 0%,100%{transform:translateX(0)} 50%{transform:translateX(15px)} }

.cs-hero { text-align: center; margin-bottom: 24px; }
.hero-bear { font-size: 5rem; animation: bearBounce 2s ease-in-out infinite; display: block; margin-bottom: 10px; }
@keyframes bearBounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.05)} }
.hero-title { font-size: 2.6rem; font-weight: 900; text-shadow: 0 4px 12px rgba(0,0,0,0.2); margin: 0; letter-spacing: 2px; }
.hero-sub { font-size: 1.1rem; opacity: 0.85; margin: 6px 0 0; }

.cs-prompt { font-size: 1.05rem; opacity: 0.85; margin-bottom: 18px; }

.profiles-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 30px;
}

.profile-card {
  background: rgba(255,255,255,0.25);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 18px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  border: 2px solid rgba(255,255,255,0.4);
  min-width: 110px;
}
.profile-card:hover { transform: translateY(-6px) scale(1.06); background: rgba(255,255,255,0.4); }
.add-card { border-style: dashed; opacity: 0.75; }
.add-card:hover { opacity: 1; }

.profile-avatar { font-size: 3rem; display: block; margin-bottom: 8px; }
.profile-name { font-size: 1rem; font-weight: bold; margin-bottom: 4px; }
.profile-stars { font-size: 0.82rem; opacity: 0.85; }

.parent-entry {
  position: absolute;
  bottom: 20px;
  font-size: 0.9rem;
  opacity: 0.7;
  cursor: pointer;
  padding: 8px 16px;
  background: rgba(255,255,255,0.15);
  border-radius: 20px;
  transition: opacity 0.2s;
}
.parent-entry:hover { opacity: 1; }

/* ════════ 新建Profile弹窗 ════════ */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  backdrop-filter: blur(4px);
}

.add-profile-modal {
  background: white;
  color: #333;
  border-radius: 28px;
  padding: 28px 24px;
  max-width: 380px;
  width: 92%;
  animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }

.add-profile-modal h2 { font-size: 1.3rem; margin: 0 0 16px; text-align: center; }

.avatar-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 16px;
}
.av-opt {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  background: #f5f5f5;
}
.av-opt:hover { background: #e8e8ff; transform: scale(1.1); }
.av-opt.selected { border-color: #667eea; background: #e8e8ff; transform: scale(1.15); }

.name-input {
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 1rem;
  margin-bottom: 14px;
  box-sizing: border-box;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}
.name-input:focus { border-color: #667eea; }

.age-row {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-bottom: 18px;
  font-size: 0.95rem;
}
.age-btn {
  padding: 7px 16px;
  border-radius: 20px;
  cursor: pointer;
  background: #f0f0f0;
  font-size: 0.9rem;
  transition: all 0.2s;
  border: 2px solid transparent;
}
.age-btn.active { background: #667eea; color: white; border-color: #667eea; }
.age-btn:hover { transform: scale(1.05); }

.confirm-btn {
  width: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 22px;
  padding: 14px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}
.confirm-btn:hover:not(:disabled) { transform: scale(1.04); }
.confirm-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ════════ 主页 ════════ */
.main-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #87CEEB 0%, #98E4FF 30%, #B8F0B0 60%, #7DD56F 100%);
}

/* 天空 */
.sky-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 200px;
  pointer-events: none;
  overflow: hidden;
}
.sun { position: absolute; top: 15px; right: 20px; font-size: 2.8rem; animation: sunSpin 20s linear infinite; }
@keyframes sunSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.cloud.mc1 { position: absolute; left: 10%; top: 30px; font-size: 2rem; animation: cloudFloat 10s ease-in-out infinite; color: white; opacity: 0.9; }
.cloud.mc2 { position: absolute; left: 55%; top: 20px; font-size: 1.6rem; animation: cloudFloat 7s ease-in-out infinite 2s; color: white; opacity: 0.8; }
.birds { position: absolute; left: 35%; top: 45px; font-size: 0.9rem; animation: birdFly 12s linear infinite; opacity: 0.7; }
@keyframes birdFly { from{transform:translateX(-40px) translateY(0)} 50%{transform:translateX(20px) translateY(-8px)} to{transform:translateX(-40px) translateY(0)} }

/* 顶栏 */
.main-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: relative;
  z-index: 10;
}

.player-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(255,255,255,0.5);
}
.player-chip:hover { background: rgba(255,255,255,0.5); }
.chip-av { font-size: 1.4rem; }
.chip-name { font-size: 0.9rem; font-weight: bold; color: #333; }

.topbar-stats { display: flex; gap: 8px; }
.ts-item {
  background: rgba(255,255,255,0.35);
  backdrop-filter: blur(8px);
  border-radius: 14px;
  padding: 5px 10px;
  font-size: 0.82rem;
  font-weight: bold;
  color: #333;
  border: 1px solid rgba(255,255,255,0.5);
}
.ts-item.time-chip { color: #333; }
.ts-item.urgent { background: rgba(255,80,80,0.4); color: white; animation: urgentPulse 1s ease-in-out infinite; }
@keyframes urgentPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

.icon-btn {
  background: rgba(255,255,255,0.35);
  border: none;
  border-radius: 50%;
  width: 38px; height: 38px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-btn:hover { background: rgba(255,255,255,0.55); transform: rotate(20deg); }

/* 海岛全景 */
.island-panorama {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.island-scene {
  width: 100%;
  min-height: 340px;
  position: relative;
  padding-bottom: 10px;
}

/* 区域泡泡 */
.scene-spot {
  position: absolute;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.scene-spot:hover:not(.spot-locked) { transform: scale(1.08); }
.scene-spot.spot-locked { opacity: 0.55; cursor: not-allowed; }

/* 各区域位置 */
.spot-orchard { left: 8%; top: 20px; }
.spot-beach { left: 35%; top: 10px; }
.spot-park { right: 8%; top: 25px; }
.spot-treehouse { left: 18%; top: 140px; }
.spot-cave { right: 20%; top: 145px; }
.spot-volcano { left: 42%; top: 155px; }

.spot-bubble {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 12px 14px;
  text-align: center;
  min-width: 90px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  border: 2px solid rgba(255,255,255,0.8);
  position: relative;
  color: #333;
}
.spot-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top: 10px solid rgba(255,255,255,0.9);
}

.spot-done .spot-bubble { border-color: #4ade80; background: rgba(220,255,220,0.95); }

.spot-emoji { font-size: 2rem; display: block; margin-bottom: 4px; }
.spot-name { font-size: 0.78rem; font-weight: bold; color: #444; margin-bottom: 4px; }
.spot-stars { font-size: 0.75rem; margin-bottom: 6px; }
.spot-lock { font-size: 1.1rem; }
.spot-cta {
  background: linear-gradient(45deg,#ff9a9e,#fecfef);
  color: #333;
  border-radius: 10px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  cursor: pointer;
}

/* 装饰 */
.bear-character {
  position: absolute;
  bottom: 60px; left: 45%;
  font-size: 2.5rem;
  transition: all 1s ease;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}
.bear-character.bear-walk { animation: bearWalk 1.5s ease-in-out; }
@keyframes bearWalk { 0%{transform:translateX(0)} 25%{transform:translateX(-20px) rotate(-5deg)} 75%{transform:translateX(20px) rotate(5deg)} 100%{transform:translateX(0)} }

.deco-tree { position: absolute; font-size: 2.5rem; pointer-events: none; }
.t1 { left: 2%; bottom: 60px; font-size: 2rem; }
.t2 { right: 3%; bottom: 50px; }
.t3 { left: 52%; bottom: 40px; font-size: 2.2rem; }

.deco-flower { position: absolute; pointer-events: none; font-size: 1.4rem; animation: flowerSway 4s ease-in-out infinite; }
.f1 { left: 25%; bottom: 50px; }
.f2 { right: 32%; bottom: 58px; animation-delay: 2s; }
@keyframes flowerSway { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }

.deco-ocean {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  font-size: 1.8rem;
  text-align: center;
  letter-spacing: 8px;
  animation: oceanWave 3s ease-in-out infinite;
  opacity: 0.8;
}
@keyframes oceanWave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

/* 底部导航 */
.bottom-nav {
  display: flex;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255,255,255,0.5);
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
}
.nav-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 6px;
  transition: all 0.2s;
  border-radius: 10px;
  margin: 0 4px;
}
.nav-item:hover { background: rgba(102,126,234,0.12); }
.nav-item.active .nav-icon { filter: none; }
.nav-item.active .nav-label { color: #667eea; font-weight: bold; }
.nav-icon { font-size: 1.5rem; }
.nav-label { font-size: 0.7rem; color: #888; margin-top: 2px; }

/* ════════ 练习模式 ════════ */
.practice-screen { min-height: 100vh; display: flex; flex-direction: column; }
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
}
.page-header h2 { font-size: 1.2rem; margin: 0; }

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.back-btn:hover { background: rgba(255,255,255,0.35); }
.back-btn.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.4); }

.header-score { font-size: 1rem; font-weight: bold; }
.ach-count { font-size: 0.9rem; font-weight: bold; opacity: 0.85; }

.practice-scroll { flex: 1; overflow-y: auto; padding: 14px 14px 80px; }

.practice-category { margin-bottom: 20px; }
.cat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.cat-emoji { font-size: 1.3rem; }
.cat-title { font-size: 1rem; font-weight: bold; }
.cat-age { font-size: 0.75rem; background: rgba(255,255,255,0.2); border-radius: 10px; padding: 2px 8px; opacity: 0.8; }

.cat-levels { display: flex; flex-direction: column; gap: 8px; }
.level-card {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.25s;
  border: 1px solid rgba(255,255,255,0.25);
  gap: 12px;
}
.level-card:hover { background: rgba(255,255,255,0.28); transform: translateX(4px); }
.level-icon { font-size: 2rem; flex-shrink: 0; }
.level-info { flex: 1; }
.level-name { font-size: 1rem; font-weight: bold; margin-bottom: 3px; }
.level-desc { font-size: 0.78rem; opacity: 0.75; }
.level-stars { font-size: 0.9rem; flex-shrink: 0; }

/* ════════ 游戏界面 ════════ */
.game-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: background 0.5s ease;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(10px);
}

.game-progress-wrap { flex: 1; }
.gp-label { font-size: 0.82rem; opacity: 0.85; margin-bottom: 4px; }
.gp-bar {
  height: 16px;
  background: rgba(255,255,255,0.25);
  border-radius: 8px;
  position: relative;
  overflow: visible;
}
.gp-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FF6B6B);
  border-radius: 8px;
  transition: width 0.5s ease;
}
.gp-bear {
  position: absolute;
  top: -5px;
  font-size: 1.4rem;
  transition: left 0.5s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.gp-count { font-size: 0.75rem; opacity: 0.8; margin-top: 3px; text-align: right; }
.game-score-chip { background: rgba(255,215,0,0.3); border-radius: 16px; padding: 6px 12px; font-size: 1rem; font-weight: bold; border: 1px solid rgba(255,215,0,0.5); white-space: nowrap; }

/* 题目区 */
.question-zone { flex: 1; display: flex; align-items: flex-start; justify-content: center; padding: 14px 14px 0; }

.question-card {
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(14px);
  border-radius: 26px;
  padding: 20px;
  width: 100%;
  max-width: 600px;
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  position: relative;
}
.question-card.shake { animation: shake 0.55s ease; }
@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }

/* 故事情境 */
.story-context {
  background: rgba(255,255,255,0.15);
  border-radius: 14px;
  padding: 10px 14px;
  margin-bottom: 12px;
}
.story-scene { font-size: 1.6rem; margin-bottom: 4px; }
.story-text { font-size: 0.95rem; line-height: 1.5; opacity: 0.95; }

.q-text {
  font-size: 1.8rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 14px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

/* 视觉辅助 */
.q-visual { margin-bottom: 10px; }

.count-visual .items-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
}
.count-item {
  font-size: 2rem;
  animation: itemPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  display: inline-block;
}
.count-item.sm { font-size: 1.4rem; }
@keyframes itemPop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }

.item-pop-enter-active { animation: itemPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }

/* 加法可视化 */
.add-visual { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
.add-group { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; max-width: 120px; background: rgba(255,255,255,0.15); border-radius: 12px; padding: 8px; }
.plus-sign, .equals-sign { font-size: 1.6rem; font-weight: bold; }
.q-mark { font-size: 2rem; font-weight: 900; background: rgba(255,215,0,0.3); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; }

/* 减法可视化 */
.sub-visual { text-align: center; }
.sub-group { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-bottom: 8px; }
.count-item.crossed { opacity: 0.25; position: relative; text-decoration: line-through; filter: grayscale(1); }
.sub-hint { font-size: 0.88rem; opacity: 0.8; background: rgba(255,100,100,0.2); border-radius: 10px; padding: 4px 10px; display: inline-block; }

/* 乘法可视化 */
.mul-visual { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.mul-row { display: flex; align-items: center; gap: 6px; }
.mul-group { display: flex; gap: 4px; background: rgba(255,255,255,0.15); border-radius: 10px; padding: 6px 10px; }
.mul-sep { font-size: 1.2rem; opacity: 0.4; }
.mul-desc { font-size: 0.88rem; opacity: 0.85; background: rgba(255,255,255,0.15); border-radius: 10px; padding: 4px 12px; margin-top: 4px; text-align: center; }

/* 数字认识 */
.number-visual { text-align: center; }
.big-number { font-size: 6rem; font-weight: 900; text-shadow: 0 4px 20px rgba(0,0,0,0.2); line-height: 1; margin-bottom: 10px; }
.number-items { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; }

/* 比大小 */
.compare-visual { display: flex; align-items: center; justify-content: center; gap: 20px; }
.cmp-num { font-size: 3.5rem; font-weight: 900; background: rgba(255,255,255,0.2); border-radius: 16px; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; }
.cmp-mid { font-size: 2rem; opacity: 0.5; }

.voice-fab {
  position: absolute;
  bottom: 14px; right: 14px;
  background: rgba(255,255,255,0.25);
  border: none;
  border-radius: 50%;
  width: 38px; height: 38px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.voice-fab:hover { background: rgba(255,255,255,0.45); transform: scale(1.1); }

/* 答案区 */
.answer-zone { padding: 14px; }

.choice-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; max-width: 600px; margin: 0 auto; }
.choice-btn {
  background: rgba(255,255,255,0.22);
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 18px;
  padding: 18px 12px;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.choice-btn:hover:not(:disabled) { background: rgba(255,255,255,0.38); transform: scale(1.05); }
.choice-btn.chosen { background: rgba(255,255,100,0.3); border-color: #FFD700; transform: scale(1.04); }
.choice-btn.correct { background: rgba(80,200,80,0.6) !important; border-color: #4ade80 !important; animation: correctPop 0.5s ease; }
.choice-btn.wrong { background: rgba(255,80,80,0.5) !important; border-color: #f87171 !important; }
@keyframes correctPop { 0%{transform:scale(1)} 50%{transform:scale(1.12)} 100%{transform:scale(1.05)} }
.choice-btn:disabled { cursor: default; }
.choice-emoji { font-size: 1.2rem; }
.choice-val { font-size: 2rem; }

/* 符号选择 */
.symbol-choice { display: flex; gap: 16px; justify-content: center; }
.sym-btn {
  background: rgba(255,255,255,0.22);
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 18px;
  width: 80px; height: 80px;
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  display: flex; align-items: center; justify-content: center;
}
.sym-btn:hover:not(:disabled) { background: rgba(255,255,255,0.38); transform: scale(1.1); }
.sym-btn.chosen { background: rgba(255,255,100,0.3); border-color: #FFD700; }
.sym-btn.correct { background: rgba(80,200,80,0.6) !important; border-color: #4ade80 !important; }
.sym-btn.wrong { background: rgba(255,80,80,0.5) !important; border-color: #f87171 !important; }

/* 反馈栏 */
.feedback-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 20px;
  margin: 10px 14px 14px;
  backdrop-filter: blur(10px);
}
.fb-correct { background: rgba(80,200,80,0.35); border: 1px solid rgba(80,200,80,0.5); }
.fb-wrong { background: rgba(255,120,80,0.35); border: 1px solid rgba(255,120,80,0.5); }
.fb-emoji { font-size: 2.2rem; flex-shrink: 0; }
.fb-msg { flex: 1; font-size: 0.95rem; font-weight: bold; line-height: 1.4; }
.fb-next {
  background: white;
  color: #333;
  border: none;
  border-radius: 16px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  white-space: nowrap;
}
.fb-next:hover { transform: scale(1.06); }

/* ════════ 结算 ════════ */
.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(6px);
}

.result-card {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  border-radius: 30px;
  padding: 30px 24px;
  max-width: 400px;
  width: 92%;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1);
}

.result-confetti { position: absolute; inset: 0; pointer-events: none; }
.confetti-piece { position: absolute; animation: confettiFall 2s ease forwards; }
@keyframes confettiFall { 0%{opacity:1;transform:translateY(-20px) scale(0)} 50%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(20px) scale(0.5)} }

.result-bear { font-size: 4.5rem; display: block; animation: bearBounce 1s infinite; }
.result-card h2 { font-size: 1.6rem; font-weight: 900; margin: 8px 0 16px; }

.result-stars { margin-bottom: 16px; }
.result-star {
  font-size: 2.8rem;
  display: inline-block;
  margin: 0 4px;
  opacity: 0.2;
  transform: scale(0.6);
  transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
.result-star.lit { opacity: 1; transform: scale(1.2); animation: starLit 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
@keyframes starLit { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1.1)} }

.result-stats { display: flex; justify-content: space-around; margin-bottom: 16px; background: rgba(255,255,255,0.4); border-radius: 16px; padding: 12px; }
.rs-item { text-align: center; }
.rs-label { font-size: 0.75rem; opacity: 0.7; display: block; margin-bottom: 3px; }
.rs-val { font-size: 1.3rem; font-weight: 900; display: block; }
.rs-val.green { color: #22c55e; }
.rs-val.yellow { color: #f59e0b; }
.rs-val.blue { color: #3b82f6; }

.new-ach { background: rgba(255,215,0,0.3); border-radius: 14px; padding: 10px; margin-bottom: 14px; }
.na-title { font-weight: bold; font-size: 0.92rem; margin-bottom: 6px; }
.na-badges { display: flex; flex-direction: column; gap: 4px; }
.na-badge { font-size: 0.88rem; background: rgba(255,255,255,0.4); border-radius: 8px; padding: 4px 10px; }

.result-actions { display: flex; gap: 10px; justify-content: center; }
.ra-btn { border: none; border-radius: 22px; padding: 12px 22px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
.ra-btn.primary { background: linear-gradient(45deg,#FF9A9E,#FAD0C4); color: #333; }
.ra-btn.secondary { background: rgba(255,255,255,0.6); color: #444; }
.ra-btn:hover { transform: scale(1.06); }

/* ════════ 成就 ════════ */
.achievements-screen { min-height: 100vh; }
.ach-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; padding: 14px; }
.ach-card { border-radius: 16px; padding: 14px 10px; text-align: center; }
.ach-card.unlocked { background: rgba(255,255,255,0.2); border: 2px solid rgba(255,215,0,0.6); }
.ach-card.locked { background: rgba(0,0,0,0.2); opacity: 0.5; }
.ach-icon-big { font-size: 2.2rem; margin-bottom: 6px; }
.ach-name { font-size: 0.8rem; font-weight: bold; margin-bottom: 3px; }
.ach-desc { font-size: 0.68rem; opacity: 0.75; line-height: 1.3; margin-bottom: 4px; }
.ach-unlocked-at { font-size: 0.68rem; color: #86efac; }

/* ════════ 家长报告 ════════ */
.parent-screen { min-height: 100vh; overflow-y: auto; }
.parent-profile-tabs { display: flex; gap: 8px; padding: 12px 16px 0; flex-wrap: wrap; }
.ppt {
  background: rgba(255,255,255,0.15);
  border-radius: 14px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 0.88rem;
  transition: all 0.2s;
  border: 1px solid rgba(255,255,255,0.2);
}
.ppt.active { background: rgba(255,255,255,0.35); border-color: rgba(255,255,255,0.6); font-weight: bold; }
.ppt:hover { background: rgba(255,255,255,0.25); }

.parent-content { padding: 14px 14px 80px; max-width: 700px; margin: 0 auto; }
.pr-section { background: rgba(255,255,255,0.12); border-radius: 18px; padding: 16px; margin-bottom: 12px; }
.pr-title { font-size: 0.95rem; font-weight: bold; margin-bottom: 12px; border-left: 4px solid rgba(255,255,255,0.7); padding-left: 8px; }
.pr-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
.prc { border-radius: 12px; padding: 10px 6px; text-align: center; }
.prc.blue{background:rgba(100,160,255,0.35)} .prc.green{background:rgba(100,220,100,0.35)} .prc.orange{background:rgba(255,160,80,0.35)} .prc.purple{background:rgba(180,100,255,0.35)}
.prc-v { font-size: 1.3rem; font-weight: bold; }
.prc-l { font-size: 0.65rem; opacity: 0.8; margin-top: 2px; }

.skill-bars { display: flex; flex-direction: column; gap: 8px; }
.sk-row { display: flex; align-items: center; gap: 8px; }
.sk-label { font-size: 0.78rem; width: 90px; flex-shrink: 0; }
.sk-bar-wrap { flex: 1; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; overflow: hidden; }
.sk-bar { height: 100%; border-radius: 5px; transition: width 0.8s ease; }
.sk-pct { font-size: 0.78rem; width: 30px; text-align: right; font-weight: bold; }

.adv-progress { display: flex; flex-direction: column; gap: 8px; }
.adp-row { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); border-radius: 10px; padding: 9px 12px; }
.adp-emoji { font-size: 1.4rem; }
.adp-name { flex: 1; font-size: 0.88rem; font-weight: bold; }
.adp-status { font-size: 0.78rem; }
.adp-stars { font-size: 0.85rem; }
.s-done{color:#86efac} .s-active{color:#fde68a} .s-locked{opacity:.5}

.tips-section {}
.tip-list { display: flex; flex-direction: column; gap: 7px; }
.tip { background: rgba(255,255,255,0.12); border-radius: 10px; padding: 10px 12px; font-size: 0.85rem; line-height: 1.5; }

/* ════════ 设置弹窗 ════════ */
.settings-modal {
  background: white;
  color: #333;
  border-radius: 24px;
  max-width: 380px;
  width: 92%;
  overflow: hidden;
  animation: popIn 0.3s ease;
}
.sm-header { background: linear-gradient(135deg,#667eea,#764ba2); color: white; padding: 16px 20px; font-size: 1.1rem; font-weight: bold; }
.sm-body { padding: 14px 18px; }
.sm-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 0.95rem; color: #555; }
.sm-select { border: 1px solid #ddd; border-radius: 8px; padding: 6px 8px; font-size: 0.85rem; }
.sm-save { display: block; width: calc(100% - 36px); margin: 14px 18px; background: linear-gradient(45deg,#4CAF50,#8BC34A); color: white; border: none; border-radius: 20px; padding: 12px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
.sm-save:hover { transform: scale(1.04); }

/* Toggle */
.toggle { position: relative; width: 50px; height: 26px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; inset: 0; background: #ccc; border-radius: 26px; cursor: pointer; transition: 0.3s; }
.slider:before { content:''; position: absolute; width: 20px; height: 20px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
.toggle input:checked + .slider { background: #667eea; }
.toggle input:checked + .slider:before { transform: translateX(24px); }

/* ════════ 粒子特效 ════════ */
.burst-layer { position: fixed; inset: 0; pointer-events: none; z-index: 999; }
.burst-star { position: absolute; animation: burstFly 0.9s ease-out forwards; }
@keyframes burstFly { 0%{transform:scale(0) rotate(0);opacity:1} 60%{opacity:1} 100%{transform:scale(1.2) rotate(360deg) translateY(-40px);opacity:0} }

/* ════════ 响应式 ════════ */
@media (max-width: 480px) {
  .gp-label,.gp-count { display: none; }
  .island-map { grid-template-columns: repeat(2,1fr); }
  .ach-grid { grid-template-columns: repeat(2,1fr); }
  .pr-cards { grid-template-columns: repeat(2,1fr); }
  .choice-btn { font-size: 1.5rem; padding: 14px 8px; }
  .q-text { font-size: 1.5rem; }
  .hero-title { font-size: 2rem; }
  .main-actions { grid-template-columns: repeat(2,1fr); }
  .spot-orchard { left: 4%; }
  .spot-park { right: 2%; }
  .choice-val { font-size: 1.6rem; }
}

@media (min-height: 800px) {
  .island-scene { min-height: 420px; }
}
</style>
