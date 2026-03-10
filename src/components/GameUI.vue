<template>
  <div class="app-root" :class="{ 'warm-mode': settings.eyeProtection }">

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 选择小朋友 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="fade-up">
    <div v-if="screen === 'child-select'" class="select-screen">
      <div class="sky-deco">
        <span class="deco-cloud" style="left:5%;top:10%;animation-delay:0s">☁️</span>
        <span class="deco-cloud" style="left:55%;top:6%;animation-delay:2s">☁️</span>
        <span class="deco-cloud" style="right:8%;top:15%;animation-delay:1s">⛅</span>
        <span class="deco-sun">☀️</span>
      </div>
      <div class="select-hero">
        <div class="hero-bear" @click="playWelcome">🐻</div>
        <h1 class="hero-title">小熊数学岛</h1>
        <p class="hero-tagline">快来和小熊一起学数学吧！</p>
      </div>

      <p class="select-hint" v-if="profiles.length > 0">小朋友，点你的头像👇</p>
      <p class="select-hint" v-else>欢迎！先创建一个小朋友的账号吧 🎉</p>

      <div class="profiles-grid">
        <div v-for="p in profiles" :key="p.id" class="profile-btn" @click="selectProfile(p)">
          <div class="pb-avatar">{{ p.avatar }}</div>
          <div class="pb-name">{{ p.name }}</div>
          <div class="pb-info">
            <span>⭐{{ p.totalScore }}</span>
            <span>🔥{{ p.streakDays }}天</span>
          </div>
        </div>
        <div class="profile-btn add-btn" @click="showAddProfile=true" v-if="profiles.length < 4">
          <div class="pb-avatar add-av">＋</div>
          <div class="pb-name">新小朋友</div>
        </div>
      </div>

      <div class="parent-portal" @click="openParent">
        🔑 家长入口
      </div>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 创建账号弹窗 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <div class="modal-bg" v-if="showAddProfile" @click.self="showAddProfile=false">
      <div class="add-modal">
        <div class="add-modal-title">🐾 创建我的账号</div>
        <div class="avi-grid">
          <div v-for="av in AVATARS" :key="av"
            class="avi-item" :class="{active: newP.avatar===av}"
            @click="newP.avatar=av">{{ av }}</div>
        </div>
        <div class="field-label">你叫什么名字？</div>
        <input class="name-field" v-model="newP.name" placeholder="输入名字" maxlength="5"/>
        <div class="field-label">你几岁了？</div>
        <div class="age-row">
          <div v-for="a in [3,4,5,6]" :key="a"
            class="age-chip" :class="{active:newP.age===a}"
            @click="newP.age=a">{{ a }}岁</div>
        </div>
        <button class="big-btn green" @click="createProfile" :disabled="!newP.name.trim()">
          🚀 出发！
        </button>
      </div>
    </div>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 主页 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="fade-up">
    <div v-if="screen==='main'" class="main-screen">

      <!-- 顶栏 -->
      <div class="main-top">
        <div class="player-chip" @click="screen='child-select'">
          <span class="pc-av">{{ curP.avatar }}</span>
          <span class="pc-name">{{ curP.name }}</span>
        </div>
        <div class="top-stats">
          <span class="stat-pill star">⭐ {{ curP.totalScore }}</span>
          <span class="stat-pill fire">🔥 {{ curP.streakDays }}天</span>
          <span class="stat-pill today" v-if="todayStats.answered > 0">
            📝 今天{{ todayStats.answered }}题
          </span>
          <span class="stat-pill time" :class="{urgent: remSecs < 120}">
            ⏰ {{ remTimeStr }}
          </span>
        </div>
        <button class="icon-btn" @click="showSettings=true" aria-label="设置">⚙️</button>
      </div>

      <!-- 海岛地图 -->
      <div class="island-wrap">
        <div class="island-bg-sky">
          <span class="ib-cloud" style="left:8%;animation-delay:0s">☁️</span>
          <span class="ib-cloud" style="left:45%;animation-delay:3s">⛅</span>
          <span class="ib-cloud" style="right:5%;animation-delay:1.5s">☁️</span>
          <span class="ib-bird">🐦🐦</span>
        </div>
        <div class="island-map">
          <div
            v-for="area in islandAreas"
            :key="area.id"
            class="island-node"
            :class="{ unlocked: area.unlocked, locked: !area.unlocked, done: area.completed }"
            @click="area.unlocked ? startArea(area) : onClickLocked(area)"
          >
            <div class="in-bubble">
              <div class="in-emoji">{{ area.emoji }}</div>
              <div class="in-name">{{ area.name }}</div>
              <div class="in-stars" v-if="area.unlocked">
                <span v-for="n in 3" :key="n">{{ n<=area.stars ? '⭐' : '☆' }}</span>
              </div>
              <div class="in-lock" v-if="!area.unlocked">🔒</div>
            </div>
            <div class="in-path-dot" v-if="area.unlocked">●</div>
          </div>
        </div>
        <!-- 装饰 -->
        <div class="map-deco">
          <span class="md-tree" style="left:3%;bottom:12%">🌴</span>
          <span class="md-tree" style="right:4%;bottom:18%">🌳</span>
          <span class="md-tree" style="left:48%;bottom:8%">🌲</span>
          <span class="md-flower" style="left:20%;bottom:10%">🌸</span>
          <span class="md-flower" style="right:22%;bottom:14%">🌺</span>
          <span class="md-bear" :class="{walk: bearWalk}">🐻</span>
          <span class="md-ocean">🌊🌊🌊🌊🌊🌊🌊</span>
        </div>
      </div>

      <!-- 底部导航 -->
      <nav class="main-nav">
        <div :class="['nav-tab', screen==='main' ? 'active' : '']" @click="screen='main'; playBop()">
          <span class="nt-ico">🏝️</span><span class="nt-lbl">海岛</span>
        </div>
        <div :class="['nav-tab', screen==='practice' ? 'active' : '']" @click="screen='practice'">
          <span class="nt-ico">📚</span><span class="nt-lbl">练习</span>
        </div>
        <div :class="['nav-tab', screen==='achievements' ? 'active' : '']" @click="screen='achievements'">
          <span class="nt-ico">🏅</span><span class="nt-lbl">成就</span>
        </div>
        <div :class="['nav-tab', screen==='parent' ? 'active' : '']" @click="openParent">
          <span class="nt-ico">👨‍👩‍👧</span><span class="nt-lbl">报告</span>
        </div>
      </nav>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 练习大厅 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="fade-up">
    <div v-if="screen==='practice'" class="practice-screen">
      <div class="pg-header">
        <button class="back-btn" @click="screen='main'">◀ 返回</button>
        <h2>📚 练习题库</h2>
        <span class="header-score">⭐{{ curP.totalScore }}</span>
      </div>
      <div class="practice-list">
        <!-- F2: 今日推荐横幅 -->
        <div class="rec-banner" v-if="recommendedLevel" @click="launchPractice(recommendedLevel)">
          <div class="rec-left">
            <span class="rec-badge">今日推荐</span>
            <span class="rec-ico">{{ recommendedLevel.icon }}</span>
            <div class="rec-info">
              <div class="rec-name">{{ recommendedLevel.name }}</div>
              <div class="rec-sub">{{ recommendedLevel.desc }}</div>
            </div>
          </div>
          <div class="rec-arrow">▶</div>
        </div>

        <div v-for="cat in CATS" :key="cat.title" class="pcat">
          <div class="pcat-head">
            <span class="pch-ico">{{ cat.emoji }}</span>
            <span class="pch-title">{{ cat.title }}</span>
            <span class="pch-age">{{ cat.age }}</span>
          </div>
          <div class="pcat-levels">
            <div
              v-for="lv in cat.levels" :key="lv.key"
              class="level-row"
              @click="launchPractice(lv)"
            >
              <span class="lr-ico">{{ lv.icon }}</span>
              <div class="lr-info">
                <div class="lr-name">{{ lv.name }}</div>
                <div class="lr-desc">{{ lv.desc }}</div>
              </div>
              <div class="lr-stars">
                <span v-for="n in 3" :key="n">{{ n<=(curP.levelStars?.[lv.key]||0)?'⭐':'☆' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 关卡过场画面（F2） ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="pop">
    <div v-if="screen==='splash' && splashArea" class="splash-screen"
         :style="{background: splashArea.bg}"
         @click="skipSplash">
      <div class="splash-inner">
        <div class="splash-emoji">{{ splashArea.emoji }}</div>
        <div class="splash-name">{{ splashArea.name }}</div>
        <div class="splash-desc">{{ splashArea.splash }}</div>
        <div class="splash-hint">点击屏幕开始 ▶</div>
      </div>
      <div class="splash-bear">🐻</div>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 答题界面 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="fade-up">
    <div v-if="screen==='game'" class="game-screen" :style="{background: gameBg}">

      <!-- 进度条顶栏 -->
      <div class="game-top">
        <button class="back-btn ghost" @click="exitGame">◀</button>
        <div class="gp-wrap">
          <div class="gp-title">{{ gameTitle }}</div>
          <div class="gp-bar">
            <div class="gp-fill" :style="{width: gProgress+'%'}"></div>
            <div class="gp-bear" :style="{left: Math.max(0, gProgress-5)+'%'}">🐻</div>
          </div>
        </div>
        <!-- F3: 连击热度计 -->
        <div class="streak-tag" :class="'streak-' + Math.min(consecutiveCorrect, 5)" v-if="consecutiveCorrect > 0" :title="consecutiveCorrect + '连击'">
          <span class="st-flame">{{ ['🔥','🔥','🔥🔥','🔥🔥🔥','💥'][Math.min(consecutiveCorrect-1,4)] }}</span>
          <span class="st-num">×{{ consecutiveCorrect }}</span>
        </div>
        <div class="game-score-tag">⭐{{ gScore }}</div>
      </div>

      <!-- 题目卡 -->
      <div class="q-zone">
        <transition name="q-swap" mode="out-in">
        <div class="q-card" :key="qKey" :class="{shake: shaking}">

          <!-- 故事句（图文一致） -->
          <div class="story-box" v-if="cQ.story">
            <span class="story-icon">{{ cQ.storyIcon }}</span>
            <span class="story-text">{{ cQ.story }}</span>
            <button class="voice-mini" @click="speakStory" title="朗读故事">🔊</button>
          </div>

          <!-- 题目问句（大字） -->
          <div class="q-question">{{ cQ.question }}</div>

          <!-- ── 视觉辅助区 ── -->

          <!-- 数数：按行分组，每行最多5个，方便点数 -->
          <div v-if="cQ.vtype==='count'" class="v-count">
            <div
              v-for="(row, ri) in Math.ceil(cQ.items.length / 5)"
              :key="ri"
              class="vc-row"
            >
              <span
                v-for="(it, i) in cQ.items.slice(ri*5, ri*5+5)"
                :key="ri*5+i"
                class="vitem big"
                :style="{animationDelay: (ri*5+i)*0.07+'s'}"
              >{{ it }}</span>
            </div>
          </div>

          <!-- 加法：两组+合并演示（A组蓝色，B组橙色，讲述"左边+右边"） -->
          <div v-else-if="cQ.vtype==='add'" class="v-add">
            <div class="va-group va-group-a">
              <div class="va-items">
                <span v-for="(it,i) in cQ.itemsA" :key="'a'+i" class="vitem">{{ it }}</span>
              </div>
              <div class="va-label">{{ cQ.a }}个</div>
            </div>
            <div class="va-plus">＋</div>
            <div class="va-group va-group-b">
              <div class="va-items">
                <span v-for="(it,i) in cQ.itemsB" :key="'b'+i" class="vitem">{{ it }}</span>
              </div>
              <div class="va-label">{{ cQ.b }}个</div>
            </div>
            <div class="va-eq">＝</div>
            <div class="va-qmark">？</div>
          </div>

          <!-- 减法：全部展示，被减部分动态划掉（U5: >10时改用数字模式） -->
          <div v-else-if="cQ.vtype==='sub'" class="v-sub">
            <!-- emoji模式：10个以内 -->
            <template v-if="cQ.allItems.length <= 10">
              <div class="vs-row">
                <span
                  v-for="(it,i) in cQ.allItems" :key="i"
                  class="vitem"
                  :class="{ crossed: i >= cQ.keep }"
                >{{ it }}</span>
              </div>
              <div class="vs-hint">✂️ 去掉了 {{ cQ.b }} 个{{ cQ.itemEmoji }}，还剩几个？</div>
            </template>
            <!-- 数字模式：10个以上（U5） -->
            <template v-else>
              <div class="vs-num-mode">
                <div class="vsn-total">
                  <span class="vsn-emoji">{{ cQ.allItems[0] }}</span>
                  <span class="vsn-num">{{ cQ.allItems.length }}</span>
                  <span class="vsn-label">个</span>
                </div>
                <div class="vsn-minus">✂️ 去掉</div>
                <div class="vsn-remove">
                  <span class="vsn-emoji cross-emoji">{{ cQ.allItems[0] }}</span>
                  <span class="vsn-num vsn-red">{{ cQ.b }}</span>
                  <span class="vsn-label">个</span>
                </div>
                <div class="vsn-eq">＝ ？</div>
              </div>
            </template>
          </div>

          <!-- 乘法："几排几个"分组 -->
          <div v-else-if="cQ.vtype==='mul'" class="v-mul">
            <div class="vm-row" v-for="(grp,gi) in cQ.groups" :key="gi">
              <div class="vm-group">
                <span v-for="(it,ii) in grp" :key="ii" class="vitem">{{ it }}</span>
              </div>
              <div class="vm-arrow" v-if="gi===0">← {{ cQ.a }}个一组</div>
            </div>
            <div class="vm-desc">共 {{ cQ.b }} 组，每组 {{ cQ.a }} 个</div>
          </div>

          <!-- 比大小：天平视觉（U4: 点数上限10，超过只显示10个+标注） -->
          <div v-else-if="cQ.vtype==='compare'" class="v-compare">
            <div class="vc-side">
              <div class="vc-num" :class="{'vc-num-lg': cQ.numA >= 10}">{{ cQ.numA }}</div>
              <div class="vc-dots" v-if="cQ.numA <= 10">
                <span v-for="n in cQ.numA" :key="n" class="vc-dot">●</span>
              </div>
              <div class="vc-dots-overflow" v-else>
                <span v-for="n in 10" :key="n" class="vc-dot">●</span>
                <span class="vc-dot-more">+{{ cQ.numA - 10 }}</span>
              </div>
            </div>
            <div class="vc-mid">
              <div class="vc-scale">⚖️</div>
              <div class="vc-blank">___</div>
            </div>
            <div class="vc-side">
              <div class="vc-num" :class="{'vc-num-lg': cQ.numB >= 10}">{{ cQ.numB }}</div>
              <div class="vc-dots" v-if="cQ.numB <= 10">
                <span v-for="n in cQ.numB" :key="n" class="vc-dot">●</span>
              </div>
              <div class="vc-dots-overflow" v-else>
                <span v-for="n in 10" :key="n" class="vc-dot">●</span>
                <span class="vc-dot-more">+{{ cQ.numB - 10 }}</span>
              </div>
            </div>
          </div>

        </div>
        </transition>
      </div>

      <!-- 选项区 -->
      <div class="answer-zone">
        <!-- 数字选项 -->
        <div class="choice-grid" v-if="cQ.type==='choice'">
          <button
            v-for="(opt,i) in cQ.options" :key="i"
            class="choice-btn"
            :class="{
              chosen: chosen===i,
              correct: answered && opt===cQ.answer,
              wrong: answered && chosen===i && opt!==cQ.answer
            }"
            @click="pick(opt,i)"
            :disabled="answered"
          >{{ opt }}</button>
        </div>

        <!-- 符号选项（比大小）— U6: 文字+鳄鱼嘴辅助 -->
        <div class="sym-grid" v-else-if="cQ.type==='symbol'">
          <button
            v-for="(s,si) in [{sym:'＜',label:'左边小',hint:'🐊·'},{sym:'＝',label:'一样多',hint:'⚖️'},{sym:'＞',label:'左边大',hint:'·🐊'}]"
            :key="s.sym"
            class="sym-btn"
            :class="{
              chosen: chosen===s.sym,
              correct: answered && s.sym===cQ.answer,
              wrong: answered && chosen===s.sym && s.sym!==cQ.answer
            }"
            @click="pickSym(s.sym)"
            :disabled="answered"
          >
            <div class="sym-main">{{ s.sym }}</div>
            <div class="sym-hint">{{ s.hint }}</div>
            <div class="sym-label">{{ s.label }}</div>
          </button>
        </div>
      </div>

      <!-- 答题反馈条 -->
      <transition name="slide-up">
      <div class="feedback" v-if="answered" :class="lastOK?'fb-ok':'fb-no'">
        <div class="fb-emoji">{{ lastOK ? feedEmoji : '🤔' }}</div>
        <div class="fb-body">
          <div class="fb-text">{{ lastOK ? feedMsg : failMsg }}</div>
          <!-- U2: 答对时显示自动推进倒计时环 -->
          <div v-if="lastOK && autoNext" class="fb-auto-hint">自动继续…</div>
        </div>
        <!-- 答对：倒计时圆形进度 + 点击立即跳过 -->
        <div v-if="lastOK" class="fb-auto-ring" @click="doNext" title="点击立即继续">
          <svg viewBox="0 0 36 36" class="far-svg">
            <circle class="far-track" cx="18" cy="18" r="15.9"/>
            <circle class="far-fill" cx="18" cy="18" r="15.9"/>
          </svg>
          <span class="far-icon">▶</span>
        </div>
        <!-- 答错：我知道了按钮 -->
        <button v-else class="fb-btn" @click="doNext">
          {{ isLastQ ? '🎉 看结果！' : '我知道了 👍' }}
        </button>
      </div>
      </transition>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 结算 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="pop">
    <div class="result-overlay" v-if="screen==='result'">
      <div class="result-card">
        <div class="rc-confetti">
          <span v-for="(cfg,n) in cfConfigs" :key="n" class="cf" :style="cfg">
            {{ ['⭐','🎉','✨','🎊','💫'][n%5] }}
          </span>
        </div>
        <div class="rc-bear">{{ resBear }}</div>
        <div class="rc-title">{{ resTitle }}</div>
        <div class="rc-stars">
          <span v-for="n in 3" :key="n" class="res-star" :class="{lit:n<=resStars}" :style="{animationDelay:n*0.25+'s'}">⭐</span>
        </div>
        <div class="rc-stats">
          <div class="rcs">
            <div class="rcs-v green">{{ correctCnt }}/{{ baseQ }}</div>
            <div class="rcs-l">答对</div>
          </div>
          <div class="rcs">
            <div class="rcs-v yellow">+{{ gScore }}</div>
            <div class="rcs-l">星星</div>
          </div>
          <div class="rcs">
            <div class="rcs-v blue">{{ Math.round(correctCnt/baseQ*100) }}%</div>
            <div class="rcs-l">正确率</div>
          </div>
        </div>
        <div class="new-ach" v-if="newAchs.length">
          <div class="na-hd">🏅 获得新成就！</div>
          <div class="na-row">
            <span class="na-item" v-for="a in newAchs" :key="a.id">{{ a.icon }} {{ a.name }}</span>
          </div>
        </div>
        <div class="rc-actions">
          <button class="big-btn blue" @click="replayGame">🔄 再玩一次</button>
          <button class="big-btn white" @click="goHome">🏠 回家</button>
        </div>
      </div>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 成就墙 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="fade-up">
    <div v-if="screen==='achievements'" class="ach-screen">
      <div class="pg-header">
        <button class="back-btn" @click="screen='main'">◀ 返回</button>
        <h2>🏅 我的成就</h2>
        <span>{{ achUnlocked }}/{{ ACHS.length }}</span>
      </div>
      <div class="ach-grid">
        <div
          v-for="a in ACHS" :key="a.id"
          class="ach-tile"
          :class="{ got: isAchUnlocked(a.id) }"
        >
          <div class="at-icon">{{ isAchUnlocked(a.id) ? a.icon : '🔒' }}</div>
          <div class="at-name">{{ a.name }}</div>
          <div class="at-desc">{{ a.desc }}</div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 家长报告 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <transition name="fade-up">
    <div v-if="screen==='parent'" class="parent-screen">
      <div class="pg-header parent-head">
        <button class="back-btn" @click="screen=prevScr||'main'">◀ 返回</button>
        <h2>👨‍👩‍👧 学习报告</h2>
        <div></div>
      </div>

      <!-- 切换小朋友 -->
      <div class="pr-tabs">
        <div v-for="p in profiles" :key="p.id"
          class="pr-tab" :class="{active: parentId===p.id}"
          @click="parentId=p.id">
          {{ p.avatar }} {{ p.name }}
        </div>
      </div>

      <div class="pr-body" v-if="prProfile">
        <!-- 总览卡片 -->
        <div class="pr-row">
          <div class="pr-card c-blue">
            <div class="prc-big">{{ prProfile.totalScore }}</div>
            <div class="prc-label">⭐ 星星总数</div>
          </div>
          <div class="pr-card c-green">
            <div class="prc-big">{{ prProfile.totalAnswered||0 }}</div>
            <div class="prc-label">📝 已答题数</div>
          </div>
          <div class="pr-card c-orange">
            <div class="prc-big">{{ prAccuracy }}%</div>
            <div class="prc-label">🎯 综合正确率</div>
          </div>
          <div class="pr-card c-purple">
            <div class="prc-big">{{ prProfile.streakDays||1 }}天</div>
            <div class="prc-label">🔥 连续学习</div>
          </div>
        </div>

        <!-- 模块掌握 -->
        <div class="pr-section" v-if="prSkills.length">
          <div class="prs-title">📊 各模块掌握情况</div>
          <div class="skill-list">
            <div class="sk-item" v-for="sk in prSkills" :key="sk.key">
              <div class="sk-name">{{ sk.icon }} {{ sk.name }}</div>
              <div class="sk-bar-bg">
                <div class="sk-bar-fill" :style="{width:sk.pct+'%',background:sk.color}"></div>
              </div>
              <div class="sk-pct">{{ sk.pct }}%</div>
            </div>
          </div>
        </div>

        <!-- 冒险进度 -->
        <div class="pr-section">
          <div class="prs-title">🗺️ 冒险进度</div>
          <div class="adv-list">
            <div class="adv-row" v-for="area in (prProfile.areaProgress||[])" :key="area.id">
              <span class="adv-emoji">{{ area.emoji }}</span>
              <span class="adv-name">{{ area.name }}</span>
              <span class="adv-status">
                <span v-if="area.completed" class="s-done">✅ 完成</span>
                <span v-else-if="area.unlocked" class="s-ing">🔓 进行中</span>
                <span v-else class="s-lock">🔒</span>
              </span>
              <span class="adv-stars" v-if="area.unlocked">
                <span v-for="n in 3" :key="n">{{ n<=area.stars ? '⭐' : '☆' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- 成就 -->
        <div class="pr-section">
          <div class="prs-title">🏅 成就解锁 {{ prProfile.unlockedAchievements?.length||0 }}/{{ ACHS.length }}</div>
          <div class="pr-achs">
            <span v-for="a in ACHS" :key="a.id" class="pr-ach-dot"
              :class="{lit: prProfile.unlockedAchievements?.includes(a.id)}"
              :title="a.name">{{ a.icon }}</span>
          </div>
        </div>

        <!-- 建议 -->
        <div class="pr-section tip-sec">
          <div class="prs-title">💡 家长建议</div>
          <div class="tip-item" v-for="(t,i) in prTips" :key="i">{{ t }}</div>
        </div>
      </div>
    </div>
    </transition>

    <!-- ━━━━━━━━━━━━━━━━━━━━━━━ 设置 ━━━━━━━━━━━━━━━━━━━━━━━ -->
    <div class="modal-bg" v-if="showSettings" @click.self="showSettings=false">
      <div class="settings-modal">
        <div class="sm-title">⚙️ 设置</div>
        <div class="sm-list">
          <div class="sm-row">
            <span class="sm-label">每日时长</span>
            <select v-model.number="settings.dailyMinutes" class="sm-sel">
              <option :value="10">10分钟</option>
              <option :value="15">15分钟</option>
              <option :value="20">20分钟</option>
              <option :value="30">30分钟</option>
            </select>
          </div>
          <div class="sm-row">
            <span class="sm-label">🔊 语音朗读</span>
            <label class="tog"><input type="checkbox" v-model="settings.voice"><span class="tslider"></span></label>
          </div>
          <div class="sm-row">
            <span class="sm-label">🎵 音效</span>
            <label class="tog"><input type="checkbox" v-model="settings.sound"><span class="tslider"></span></label>
          </div>
          <div class="sm-row">
            <span class="sm-label">🌿 护眼暖色</span>
            <label class="tog"><input type="checkbox" v-model="settings.eyeProtection"><span class="tslider"></span></label>
          </div>
        </div>
        <button class="big-btn green" @click="saveSettings">保存 ✓</button>
      </div>
    </div>

    <!-- U2: 时间归零横幅 -->
    <transition name="slide-up">
    <div class="time-up-banner" v-if="showTimeUp">
      <span class="tub-emoji">🌙</span>
      <div class="tub-text">今天的学习时间到啦！<br>明天继续加油！</div>
      <span class="tub-emoji">⭐</span>
    </div>
    </transition>

    <!-- F5: 成就获得弹窗 -->
    <transition name="pop">
    <div class="ach-popup-bg" v-if="showAchPopup" @click="closeAchPopup">
      <div class="ach-popup">
        <div class="ap-title">🏅 新成就解锁！</div>
        <div class="ap-list">
          <div class="ap-item" v-for="a in newAchs" :key="a.id">
            <div class="ap-icon">{{ a.icon }}</div>
            <div class="ap-info">
              <div class="ap-name">{{ a.name }}</div>
              <div class="ap-desc">{{ a.desc }}</div>
            </div>
          </div>
        </div>
        <div class="ap-hint">点击任意处关闭</div>
      </div>
    </div>
    </transition>

    <!-- 星星爆炸特效 -->
    <div class="burst" v-if="showBurst">
      <span v-for="n in 18" :key="n" class="burst-p" :style="burstStyle(n)">
        {{ ['⭐','✨','🌟','💫'][n%4] }}
      </span>
    </div>

  </div>
</template>

<script>
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { mkCount, mkAdd, mkSub, mkMix, mkMul, mkCmp } from '../composables/questionEngine'

// ═══════════════ 工具函数 ═══════════════
const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a

// ═══════════════ 关卡配置 ═══════════════
const CATS = [
  {
    title: '数数认知', emoji: '🔢', age: '3-4岁',
    levels: [
      { key: 'cnt5',  name: '数一数（1-5）',  desc: '数出1到5个物品',    icon: '🍎', gen: () => mkCount(5)  },
      { key: 'cnt10', name: '数一数（1-10）', desc: '数出1到10个物品',   icon: '🔟', gen: () => mkCount(10) },
    ]
  },
  {
    title: '加法', emoji: '➕', age: '4-5岁',
    levels: [
      { key: 'add5',  name: '5以内加法',  desc: '合并计数，5以内',  icon: '🍊', gen: () => mkAdd(5)  },
      { key: 'add10', name: '10以内加法', desc: '合并计数，10以内', icon: '🍇', gen: () => mkAdd(10) },
    ]
  },
  {
    title: '减法', emoji: '➖', age: '4-5岁',
    levels: [
      { key: 'sub5',  name: '5以内减法',  desc: '划掉数物，5以内',  icon: '🍓', gen: () => mkSub(5)  },
      { key: 'sub10', name: '10以内减法', desc: '划掉数物，10以内', icon: '🍒', gen: () => mkSub(10) },
    ]
  },
  {
    title: '加减混合', emoji: '🔀', age: '5岁',
    levels: [
      { key: 'mix5',  name: '混合练习（5内）',  desc: '综合加减法', icon: '🌈', gen: () => mkMix(5)  },
      { key: 'mix10', name: '混合练习（10内）', desc: '综合加减法', icon: '🌟', gen: () => mkMix(10) },
    ]
  },
  {
    title: '乘法入门', emoji: '✖️', age: '5-6岁',
    levels: [
      { key: 'mul23', name: '2和3的乘法', desc: '分组理解乘法', icon: '✖️', gen: () => mkMul([2,3]) },
      { key: 'mul45', name: '4和5的乘法', desc: '分组计数进阶', icon: '🌠', gen: () => mkMul([4,5]) },
    ]
  },
  {
    title: '比大小', emoji: '⚖️', age: '5-6岁',
    levels: [
      { key: 'cmp5',  name: '比大小（1-5）',  desc: '填入＜＝＞', icon: '🏆', gen: () => mkCmp(5)  },
      { key: 'cmp10', name: '比大小（1-10）', desc: '填入＜＝＞', icon: '🎯', gen: () => mkCmp(10) },
    ]
  },
]

// ═══════════════ 冒险区域（全部使用深色背景，确保白字对比度）═══════════════
const AREAS = [
  {
    id: 'orchard', name: '苹果园', emoji: '🍎',
    bg: 'linear-gradient(160deg,#1a5c2e,#2d8a50)',
    unlocked: true, completed: false, stars: 0,
    genQ: () => mkMix(5),                                          // 纯加减，5以内
    splash: '帮小熊采苹果，解决数学难题！🍎',
  },
  {
    id: 'beach', name: '阳光沙滩', emoji: '🏖️',
    bg: 'linear-gradient(160deg,#7c4a00,#c07820)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => mkMix(8),                                          // 纯加减，8以内
    splash: '在沙滩找贝壳，数学藏在浪花里！🌊',
  },
  {
    id: 'park', name: '欢乐公园', emoji: '🎡',
    bg: 'linear-gradient(160deg,#0d4f8c,#1a7abf)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => Math.random() > 0.3 ? mkMix(10) : mkCmp(10),      // 加减+比大小
    splash: '游乐园大冒险，旋转木马等你！🎢',
  },
  {
    id: 'treehouse', name: '神奇树屋', emoji: '🌲',
    bg: 'linear-gradient(160deg,#2d4a00,#4a7c10)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => { const r = Math.random(); return r < 0.45 ? mkMix(10) : r < 0.75 ? mkCmp(10) : mkMul([2,3]) },
    splash: '树屋里的松鼠藏了秘密！🌰',
  },
  {
    id: 'cave', name: '水晶洞窟', emoji: '🔮',
    bg: 'linear-gradient(160deg,#1e0a4a,#4a1a7c)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => { const r = Math.random(); return r < 0.4 ? mkMix(15) : r < 0.7 ? mkMul([2,3,4]) : mkCmp(15) },
    splash: '水晶洞里发现宝藏！✨',
  },
  {
    id: 'volcano', name: '彩虹火山', emoji: '🌋',
    bg: 'linear-gradient(160deg,#6b0a0a,#c0220e)',
    unlocked: false, completed: false, stars: 0,
    genQ: () => { const r = Math.random(); return r < 0.4 ? mkMix(20) : r < 0.7 ? mkMul([2,3,4,5]) : mkCmp(20) },
    splash: '彩虹火山，终极大挑战！🌈',
  },
]

// ═══════════════ 成就 ═══════════════
const ACHS = [
  { id: 'first',     icon: '🌱', name: '初出茅庐', desc: '完成第一道题' },
  { id: 'perfect',   icon: '💯', name: '满分宝贝', desc: '一关全部答对' },
  { id: 'no_wrong',  icon: '🏅', name: '零失误',   desc: '一关没有出错' },
  { id: 'score10',   icon: '🌟', name: '小星星',   desc: '累计10颗星星' },
  { id: 'score50',   icon: '⭐', name: '星星达人', desc: '累计50颗星星' },
  { id: 'score100',  icon: '🌠', name: '星际旅行', desc: '累计100颗星星' },
  { id: 'streak3',   icon: '🔥', name: '连续3天',  desc: '坚持3天学习' },
  { id: 'streak7',   icon: '🌈', name: '一周超人', desc: '坚持7天学习' },
  { id: 'adv2',      icon: '🏖️', name: '探险家',  desc: '解锁沙滩区域' },
  { id: 'adv_all',   icon: '🗺️', name: '岛的主人', desc: '解锁全部区域' },
  { id: 'mul_try',   icon: '✖️', name: '乘法初探', desc: '尝试乘法练习' },
  { id: 'ans100',    icon: '📚', name: '小学霸',   desc: '累计答题100道' },
]

// ═══════════════ 存储 ═══════════════
const STORE_KEY = 'bearMath_v5'
const STORE_KEY_OLD = 'bearMath_v4'
const AVATARS = ['🐻','🐼','🐱','🐶','🐰','🦊','🐸','🦁','🐮','🐧','🦄','🐯']

function loadStore() {
  try {
    // B7: 先读 v5，若无则迁移 v4 数据
    const v5 = JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
    if (v5) return v5
    const v4 = JSON.parse(localStorage.getItem(STORE_KEY_OLD) || 'null')
    if (v4) {
      // 迁移：补充 v5 新增字段
      if (v4.profiles) {
        v4.profiles.forEach(p => {
          if (!p.todayDate)    p.todayDate    = ''
          if (!p.todayAnswered) p.todayAnswered = 0
          if (!p.todayCorrect)  p.todayCorrect  = 0
        })
      }
      saveStore(v4)   // 以 v5 key 保存
      return v4
    }
    return null
  } catch { return null }
}
function saveStore(d) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)) } catch {}
}

function defaultProfile(id, name, avatar, age) {
  return {
    id, name, avatar, age,
    totalScore: 0, streakDays: 1,
    totalAnswered: 0, totalCorrect: 0,
    lastPlayDate: '',
    todayDate: '', todayAnswered: 0, todayCorrect: 0,   // F1: 今日摘要
    unlockedAchievements: [],
    levelStars: {},
    subjectStats: {},
    areaProgress: AREAS.map(a => ({
      id: a.id, name: a.name, emoji: a.emoji,
      unlocked: a.id === 'orchard', completed: false, stars: 0,
    })),
  }
}

// ═══════════════ 音效引擎（Web Audio API，无需外部资源） ═══════════════
let audioCtx = null
function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() } catch {}
  }
  return audioCtx
}

function playTone(freq, duration, type = 'sine', volume = 0.3, delay = 0) {
  const ctx = getAudioCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  } catch {}
}

// 正确音效：上升欢快音
function soundCorrect() {
  playTone(523, 0.1, 'sine', 0.3, 0)
  playTone(659, 0.1, 'sine', 0.3, 0.1)
  playTone(784, 0.15, 'sine', 0.35, 0.2)
  playTone(1047, 0.25, 'sine', 0.3, 0.35)
}

// 错误音效：低沉提示
function soundWrong() {
  playTone(200, 0.15, 'sawtooth', 0.2, 0)
  playTone(150, 0.2, 'sawtooth', 0.15, 0.15)
}

// 点击音效：短促
function soundClick() {
  playTone(800, 0.05, 'sine', 0.15, 0)
}

// 胜利音效
function soundWin() {
  [523,659,784,1047,1319].forEach((f,i) => {
    playTone(f, 0.12, 'sine', 0.25, i * 0.1)
  })
}

// ═══════════════ 自然语音（口语化，非机械读公式） ═══════════════
let voiceList = []
let voiceReady = false
function initVoices() {
  voiceList = speechSynthesis.getVoices().filter(v => v.lang.startsWith('zh'))
  voiceReady = voiceList.length > 0
}
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.addEventListener('voiceschanged', initVoices)
  initVoices()
}

function speakNatural(text, settings) {
  if (!settings.voice) return
  try {
    speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    // 找更自然的声音
    const zhVoice = voiceList.find(v => v.name.includes('Xiaomei') || v.name.includes('Tingting') || v.name.includes('Female') || v.name.includes('女'))
                 || voiceList[0]
    if (zhVoice) u.voice = zhVoice
    u.lang = 'zh-CN'
    u.pitch = 1.35   // 略高，更适合儿童
    u.rate = 0.82    // 慢一点，让小朋友听清楚
    u.volume = 0.9
    speechSynthesis.speak(u)
  } catch {}
}

// ═══════════════ 主组件 ═══════════════
export default {
  name: 'GameUI',
  setup() {
    // ── 状态 ──
    const screen = ref('child-select')
    const prevScr = ref('')
    const showSettings = ref(false)
    const showAddProfile = ref(false)
    const showBurst = ref(false)
    const bearWalk = ref(false)

    const settings = reactive({
      dailyMinutes: 15,
      voice: true,
      sound: true,
      eyeProtection: false,
    })

    // ── 用户数据 ──
    const store = reactive({ profiles: [], settings: {} })
    const profiles = computed(() => store.profiles)
    const curPId = ref(null)
    const curP = computed(() =>
      store.profiles.find(p => p.id === curPId.value) || store.profiles[0] || defaultProfile('__demo__','小朋友','🐻',4)
    )

    const newP = reactive({ name: '', avatar: '🐻', age: 4 })

    function createProfile() {
      if (!newP.name.trim()) return
      const id = 'p' + Date.now()
      store.profiles.push(defaultProfile(id, newP.name.trim(), newP.avatar, newP.age))
      persist()
      showAddProfile.value = false
      Object.assign(newP, { name: '', avatar: '🐻', age: 4 })
    }

    function selectProfile(p) {
      curPId.value = p.id
      updateStreak(p)
      startTimer()   // B4: 切换用户时重置计时
      screen.value = 'main'
      doAnimBear()
      const greet = `你好，${p.name}！准备好了吗？出发！`
      say(greet)
      if (settings.sound) soundClick()
    }

    function updateStreak(p) {
      const today = new Date().toDateString()
      if (p.lastPlayDate === today) return
      const yest = new Date(Date.now() - 86400000).toDateString()
      p.streakDays = p.lastPlayDate === yest ? (p.streakDays || 1) + 1 : 1
      p.lastPlayDate = today
      persist()
    }

    function doAnimBear() {
      bearWalk.value = true
      setTimeout(() => { bearWalk.value = false }, 2000)
    }

    function playWelcome() {
      say('欢迎来到小熊数学岛！')
      if (settings.sound) {
        [523,659,784].forEach((f,i) => playTone(f, 0.1, 'sine', 0.2, i*0.12))
      }
    }

    function playBop() {
      if (settings.sound) soundClick()
    }

    // ── 计时 ──
    const remSecs = ref(900)
    const showTimeUp = ref(false)
    let timer = null
    function startTimer() {
      remSecs.value = (settings.dailyMinutes || 15) * 60
      showTimeUp.value = false
      clearInterval(timer)
      timer = setInterval(() => {
        if (remSecs.value > 0) {
          remSecs.value--
          // U2: 归零时弹出提示
          if (remSecs.value === 0) {
            showTimeUp.value = true
            say('今天的学习时间到啦，明天继续加油！')
            if (settings.sound) soundWin()
            setTimeout(() => { showTimeUp.value = false }, 4000)
          }
        }
      }, 1000)
    }
    const remTimeStr = computed(() => {
      const m = Math.floor(remSecs.value / 60)
      const s = remSecs.value % 60
      return `${m}:${String(s).padStart(2,'0')}`
    })

    // ── 海岛 ──
    const islandAreas = computed(() => curP.value?.areaProgress || AREAS.map(a => ({
      id: a.id, name: a.name, emoji: a.emoji, unlocked: a.id === 'orchard', completed: false, stars: 0,
    })))

    // F2: 关卡入场过场数据
    const splashArea = ref(null)   // 当前正在展示过场的区域配置

    function startArea(area) {
      const cfg = AREAS.find(a => a.id === area.id)
      if (!cfg) return
      // 先展示 2.5 秒过场画面
      splashArea.value = cfg
      screen.value = 'splash'
      say(cfg.splash)
      if (settings.sound) soundClick()
      setTimeout(() => {
        if (screen.value !== 'splash') return  // 用户已手动跳过
        launchAreaGame(cfg)
      }, 2500)
    }

    function skipSplash() {
      if (!splashArea.value) return
      if (splashArea.value._lvRef) {
        launchPracticeGame(splashArea.value._lvRef)   // F4: 练习模式跳过
      } else {
        launchAreaGame(splashArea.value)
      }
    }

    function launchAreaGame(cfg) {
      splashArea.value = null
      gameMode.value = 'adventure'
      areaId.value = cfg.id
      areaName.value = cfg.name
      gameBg.value = cfg.bg
      qs.value = Array(8).fill(null).map(() => cfg.genQ())
      screen.value = 'game'
      resetGame()
      doAnimBear()
    }

    function onClickLocked(area) {
      say('还没解锁哦，先完成前面的关卡吧！')
      if (settings.sound) soundWrong()
    }

    // ── 练习 ──
    function launchPractice(lv) {
      // F4: 简版过场（0.8秒）
      splashArea.value = {
        emoji: lv.icon,
        name: lv.name,
        bg: 'linear-gradient(160deg,#1a1a5c,#2d1b69)',
        splash: `准备好了吗？${lv.name}，开始！`,
        _lvRef: lv,   // 携带关卡引用，供 launchPracticeGame 使用
      }
      screen.value = 'splash'
      say(`开始${lv.name}！加油！`)
      if (settings.sound) soundClick()
      setTimeout(() => {
        if (screen.value !== 'splash') return
        launchPracticeGame(lv)
      }, 800)
    }

    function launchPracticeGame(lv) {
      splashArea.value = null
      gameMode.value = 'practice'
      lvKey.value = lv.key
      lvName.value = lv.name
      gameBg.value = 'linear-gradient(160deg,#1a1a5c,#2d1b69)'
      qs.value = Array(8).fill(null).map(() => lv.gen())
      screen.value = 'game'
      resetGame()
    }

    // ── 游戏状态 ──
    const gameMode = ref('practice')
    const areaId = ref('')
    const areaName = ref('')
    const lvKey = ref('')
    const lvName = ref('')
    const gameBg = ref('linear-gradient(160deg,#667eea,#764ba2)')
    const gameTitle = computed(() => gameMode.value === 'adventure' ? `🗺️ ${areaName.value}` : `📚 ${lvName.value}`)

    const qs = ref([])
    const qIdx = ref(0)
    const totalQ = computed(() => qs.value.length)
    const baseQ = ref(8)    // B2/B3: 固定初始题目数，插题不影响进度和结算分母
    const gScore = ref(0)
    const correctCnt = ref(0)
    const wrongCnt = ref(0)
    const answered = ref(false)
    const chosen = ref(null)
    const lastOK = ref(false)
    const shaking = ref(false)
    const qKey = ref(0)
    const perQWrong = ref(0)
    const consecutiveCorrect = ref(0)   // F3: 连续答对计数

    // 答对自动推进倒计时
    const autoNext = ref(false)
    let autoNextTimer = null

    const cQ = computed(() => qs.value[qIdx.value] || {})
    // B3: 进度条分母用 baseQ，插题不倒退
    const gProgress = computed(() => Math.round((qIdx.value / (baseQ.value || 1)) * 100))
    const isLastQ = computed(() => qIdx.value + 1 >= totalQ.value)

    // 当前关卡的题目生成函数（用于答错后生成同类型新题）
    function getCurGen() {
      if (gameMode.value === 'adventure') {
        return AREAS.find(a => a.id === areaId.value)?.genQ
      } else {
        return CATS.flatMap(c => c.levels).find(l => l.key === lvKey.value)?.gen
      }
    }

    // 反馈
    const feedEmoji = ref('🎉')
    const feedMsg = ref('太棒了！')
    const failMsg = computed(() => {
      const q = cQ.value
      if (q.type === 'symbol') return `正确答案是「${q.answer}」，下次加油！`
      return `正确答案是 ${q.answer}，下题再来一次！💪`
    })

    const FEED_OK = [
      ['🎉','太棒了！答对啦！'],
      ['🌟','超厉害！完全正确！'],
      ['✨','哇，做得真好！'],
      ['🚀','小天才！继续冲！'],
      ['💯','完美！真聪明！'],
    ]

    function resetGame() {
      qIdx.value = 0
      gScore.value = 0
      correctCnt.value = 0
      wrongCnt.value = 0
      answered.value = false
      chosen.value = null
      lastOK.value = false
      shaking.value = false
      perQWrong.value = 0
      consecutiveCorrect.value = 0
      autoNext.value = false
      clearTimeout(autoNextTimer)
      baseQ.value = qs.value.length   // B2/B3: 记录初始题目数
      qKey.value++
      setTimeout(() => sayQuestion(), 500)
    }

    function handleAnswer(correct, statKey) {
      answered.value = true
      lastOK.value = correct
      recStat(statKey, correct)
      if (correct) {
        correctCnt.value++
        const bonus = perQWrong.value === 0 ? 15 : 10
        gScore.value += bonus
        perQWrong.value = 0
        consecutiveCorrect.value++   // F3: 累加连击
        const [em, msg] = FEED_OK[ri(0, FEED_OK.length - 1)]
        feedEmoji.value = em
        feedMsg.value = msg
        trigBurst()
        if (settings.sound) soundCorrect()
        say(msg)
        // 答对后 1.6 秒自动推进
        autoNext.value = true
        autoNextTimer = setTimeout(() => {
          autoNext.value = false
          doNext()
        }, 1600)
      } else {
        perQWrong.value++
        wrongCnt.value++
        consecutiveCorrect.value = 0   // F3: 连击清零
        shaking.value = true
        setTimeout(() => { shaking.value = false }, 600)
        if (settings.sound) soundWrong()
      }
    }

    function pick_(opt, idx) {
      if (answered.value) return
      chosen.value = idx
      handleAnswer(opt === cQ.value.answer, lvKey.value || areaId.value)
      if (!lastOK.value) say(`正确答案是${cQ.value.answer}，记住了吗？`)
    }

    function pickSym_(sym) {
      if (answered.value) return
      chosen.value = sym
      handleAnswer(sym === cQ.value.answer, lvKey.value || areaId.value)  // B5: 统一用 || areaId
      if (!lastOK.value) say(`应该填${cQ.value.answer}，记住了吗？`)
    }

    function doNext() {
      clearTimeout(autoNextTimer)
      autoNext.value = false
      answered.value = false
      chosen.value = null

      if (!lastOK.value) {
        // B1: 答错 → 从当前关卡生成一道新的同类型题，插到下一题位置
        const gen = getCurGen()
        if (gen) {
          const newQ = gen()
          qs.value.splice(qIdx.value + 1, 0, newQ)
        }
      }

      if (isLastQ.value) {
        finishGame()
      } else {
        qIdx.value++
        qKey.value++
        setTimeout(() => sayQuestion(), 400)
      }
    }

    // ── 结算 ──
    const resStars = ref(0)
    const resTitle = ref('')
    const resBear = ref('🐻')
    const newAchs = ref([])
    // B2: 预计算 confetti 位置，防止每次渲染抖动
    const cfConfigs = ref([])

    function genCfConfigs() {
      cfConfigs.value = Array.from({length: 24}, (_, i) => ({
        left: (5 + Math.random() * 88) + '%',
        top:  (5 + Math.random() * 75) + '%',
        animationDelay: i * 0.05 + 's',
        transform: `rotate(${Math.random()*360}deg)`,
        fontSize: (0.9 + Math.random() * 0.7) + 'rem',
      }))
    }

    function finishGame() {
      // B2: 用 baseQ（初始题目数）作分母，插题不影响正确率和星级
      const acc = correctCnt.value / Math.max(1, baseQ.value)
      resStars.value = acc >= 1 ? 3 : acc >= 0.7 ? 2 : 1
      resTitle.value = acc >= 1 ? '完美通关！🎊' : acc >= 0.7 ? '非常厉害！🌟' : '继续加油！💪'
      resBear.value = acc >= 1 ? '🥳' : acc >= 0.7 ? '😄' : '🐻'

      const p = curP.value
      p.totalScore += gScore.value
      p.totalAnswered = (p.totalAnswered || 0) + baseQ.value   // 统计初始题数
      p.totalCorrect = (p.totalCorrect || 0) + correctCnt.value

      // 今日统计（F1）
      const today = new Date().toDateString()
      if (p.todayDate !== today) { p.todayDate = today; p.todayAnswered = 0; p.todayCorrect = 0 }
      p.todayAnswered = (p.todayAnswered || 0) + baseQ.value
      p.todayCorrect = (p.todayCorrect || 0) + correctCnt.value

      // 冒险进度（B3: optional chaining 防 demo 用户崩溃）
      if (gameMode.value === 'adventure') {
        const ap = p.areaProgress?.find(a => a.id === areaId.value)
        if (ap) {
          ap.completed = true
          ap.stars = Math.max(ap.stars || 0, resStars.value)
          const idx2 = p.areaProgress.findIndex(a => a.id === areaId.value)
          if (idx2 >= 0 && idx2 < p.areaProgress.length - 1) {
            p.areaProgress[idx2 + 1].unlocked = true
          }
        }
      }

      // 练习星级
      if (gameMode.value === 'practice' && lvKey.value) {
        if (!p.levelStars) p.levelStars = {}
        p.levelStars[lvKey.value] = Math.max(p.levelStars[lvKey.value] || 0, resStars.value)
      }

      newAchs.value = checkAchs(p)
      persist()
      genCfConfigs()   // B2: 结算时一次性生成 confetti 位置
      screen.value = 'result'
      if (settings.sound) soundWin()
      say(resTitle.value + (newAchs.value.length ? '还获得了新成就！' : ''))

      // F5: 有新成就时延迟弹出成就动画
      if (newAchs.value.length) {
        setTimeout(() => { showAchPopup.value = true }, 800)
      }
    }

    function replayGame() {
      // B10: 先设 screen='game' 再重置，避免 result→game 过渡动画闪烁
      screen.value = 'game'
      if (gameMode.value === 'adventure') {
        const cfg = AREAS.find(a => a.id === areaId.value)
        if (cfg) qs.value = Array(8).fill(null).map(() => cfg.genQ())
      } else {
        const lv = CATS.flatMap(c => c.levels).find(l => l.key === lvKey.value)
        if (lv) qs.value = Array(8).fill(null).map(() => lv.gen())
      }
      resetGame()
    }

    function goHome() {
      // B4: 先关成就弹窗，再异步清空 newAchs，防止弹窗内容瞬间消失
      closeAchPopup()
      screen.value = 'main'
      doAnimBear()
      setTimeout(() => { newAchs.value = [] }, 300)
    }

    function exitGame() {
      // B3: 退出游戏必须清理倒计时，防止幽灵推进
      clearTimeout(autoNextTimer)
      autoNext.value = false
      screen.value = gameMode.value === 'practice' ? 'practice' : 'main'
    }

    // ── 成就 ──
    function isAchUnlocked(id) {
      return curP.value?.unlockedAchievements?.includes(id)
    }
    const achUnlocked = computed(() => curP.value?.unlockedAchievements?.length || 0)

    // F5: 成就弹出
    const showAchPopup = ref(false)
    function closeAchPopup() { showAchPopup.value = false }

    function checkAchs(p) {
      if (!p.unlockedAchievements) p.unlockedAchievements = []
      const got = []
      const tryGet = (id, cond) => {
        if (cond && !p.unlockedAchievements.includes(id)) {
          p.unlockedAchievements.push(id)
          const a = ACHS.find(a => a.id === id)
          if (a) got.push(a)
        }
      }
      tryGet('first', (p.totalAnswered || 0) >= 1)
      tryGet('perfect', correctCnt.value === totalQ.value)
      tryGet('no_wrong', wrongCnt.value === 0)
      tryGet('score10', p.totalScore >= 10)
      tryGet('score50', p.totalScore >= 50)
      tryGet('score100', p.totalScore >= 100)
      tryGet('streak3', p.streakDays >= 3)
      tryGet('streak7', p.streakDays >= 7)
      tryGet('adv2', p.areaProgress?.find(a => a.id === 'beach')?.unlocked)
      tryGet('adv_all', p.areaProgress?.every(a => a.unlocked))
      tryGet('mul_try', (lvKey.value || '').startsWith('mul'))
      tryGet('ans100', p.totalAnswered >= 100)
      return got
    }

    // ── 统计（P3: 每次答题立即保存，防中途退出丢数据）──
    function recStat(key, correct) {
      if (!key) return
      const p = curP.value
      if (!p.subjectStats) p.subjectStats = {}
      if (!p.subjectStats[key]) p.subjectStats[key] = { total: 0, correct: 0 }
      p.subjectStats[key].total++
      if (correct) p.subjectStats[key].correct++
      persist()   // P3: 立即持久化
    }

    // ── 家长报告 ──
    const parentId = ref(null)
    const prProfile = computed(() =>
      store.profiles.find(p => p.id === parentId.value) || store.profiles[0]
    )
    const prAccuracy = computed(() => {
      const p = prProfile.value
      if (!p?.totalAnswered) return 0
      return Math.round((p.totalCorrect || 0) / p.totalAnswered * 100)
    })
    const SKILL_MAP = {
      cnt5:  { name: '数数1-5',   icon: '🔢', color: '#7ec8e3' },
      cnt10: { name: '数数1-10',  icon: '🔟', color: '#a8e6cf' },
      add5:  { name: '加法(5内)', icon: '➕', color: '#ffd3b6' },
      add10: { name: '加法(10内)',icon: '➕', color: '#fdbd74' },
      sub5:  { name: '减法(5内)', icon: '➖', color: '#ffaaa5' },
      sub10: { name: '减法(10内)',icon: '➖', color: '#ff8b94' },
      mix5:  { name: '混合(5内)', icon: '🔀', color: '#c3b1e1' },
      mix10: { name: '混合(10内)',icon: '🔀', color: '#a29bfe' },
      mul23: { name: '乘法2/3',   icon: '✖️', color: '#ffeaa7' },
      mul45: { name: '乘法4/5',   icon: '✖️', color: '#fab1a0' },
      cmp5:  { name: '比大小(5内)',icon: '⚖️', color: '#81ecec' },
      cmp10: { name: '比大小(10内)',icon: '⚖️', color: '#55efc4' },
    }
    const prSkills = computed(() => {
      const p = prProfile.value
      if (!p?.subjectStats) return []
      return Object.entries(p.subjectStats)
        .filter(([,s]) => s.total >= 3)
        .map(([key, s]) => ({
          key,
          ...(SKILL_MAP[key] || { name: key, icon: '📝', color: '#ccc' }),
          pct: Math.round(s.correct / s.total * 100),
        }))
    })
    const prTips = computed(() => {
      const p = prProfile.value
      if (!p) return []
      const tips = []
      const acc = prAccuracy.value
      if (!p.totalAnswered) {
        tips.push('🌱 宝贝还没开始答题，先从冒险模式的"苹果园"开始吧！')
        return tips
      }
      if (acc >= 90) tips.push(`🌟 ${p.name}的正确率高达${acc}%，可以尝试更难的模块了！`)
      else if (acc >= 70) tips.push(`👍 ${p.name}正确率${acc}%，整体表现不错！`)
      else tips.push(`💪 正确率${acc}%，建议从5以内加减法打牢基础，每天15分钟。`)
      if (p.streakDays >= 3) tips.push(`🔥 已连续学习${p.streakDays}天，坚持得很棒，继续保持！`)
      else tips.push('📅 建议每天固定时间学习，培养习惯，效果更好。')
      const weak = prSkills.value.filter(s => s.pct < 60 && s.pct > 0)
      if (weak.length) tips.push(`📖 重点加强：${weak.map(s => s.name).join('、')}。建议多练习几次。`)
      if (!p.areaProgress?.find(a => a.id === 'beach')?.unlocked) {
        tips.push('🗺️ 完成苹果园区域，就能解锁更多冒险场景！')
      }
      tips.push('⏰ 3-6岁儿童注意力有限，建议每次学习不超过20分钟，多鼓励，少批评。')
      return tips
    })

    function openParent() {
      prevScr.value = screen.value
      if (!parentId.value && store.profiles.length > 0) parentId.value = store.profiles[0].id
      screen.value = 'parent'
    }

    // ── 语音（自然口语化） ──
    function say(text) {
      speakNatural(text, settings)
    }

    // F1: 今日摘要（用于主页顶栏）
    const todayStats = computed(() => {
      const p = curP.value
      const today = new Date().toDateString()
      if (!p || p.todayDate !== today) return { answered: 0, correct: 0 }
      return { answered: p.todayAnswered || 0, correct: p.todayCorrect || 0 }
    })

    // F2: 练习大厅今日推荐
    const recommendedLevel = computed(() => {
      const p = curP.value
      const allLevels = CATS.flatMap(c => c.levels)
      if (!p?.subjectStats || Object.keys(p.subjectStats).length === 0) {
        // 无历史数据 → 按年龄推荐
        const byAge = { 3: 'cnt5', 4: 'add5', 5: 'mix10', 6: 'mul23' }
        const key = byAge[p?.age] || 'add5'
        return allLevels.find(l => l.key === key) || allLevels[0]
      }
      // 有数据 → 推荐正确率最低且答题≥3的
      const weak = Object.entries(p.subjectStats)
        .filter(([, s]) => s.total >= 3)
        .sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))
      if (!weak.length) return null
      const weakKey = weak[0][0]
      return allLevels.find(l => l.key === weakKey) || null
    })

    function sayQuestion() {
      const q = cQ.value
      if (q.speakText) say(q.speakText)
      else if (q.story) say(q.story)
    }

    function speakStory() {
      if (cQ.value.story) say(cQ.value.story)
    }

    // ── 特效 ──
    function trigBurst() {
      showBurst.value = true
      setTimeout(() => { showBurst.value = false }, 1000)
    }

    // B2: burstStyle 用确定性计算（无 Math.random），防止每次渲染抖动
    function burstStyle(n) {
      const angle = (n / 18) * 360
      const sizes = [1.1, 1.4, 1.2, 1.7, 1.3, 1.5, 1.1, 1.6, 1.8, 1.2, 1.4, 1.3, 1.7, 1.1, 1.5, 1.6, 1.2, 1.4]
      return {
        left: (50 + Math.cos(angle * Math.PI / 180) * 38) + '%',
        top:  (42 + Math.sin(angle * Math.PI / 180) * 28) + '%',
        animationDelay: (n * 0.04) + 's',
        fontSize: (sizes[n % sizes.length]) + 'rem',
      }
    }

    // B2: cfStyle 已改为使用预计算的 cfConfigs（见 genCfConfigs）
    function cfStyle(n) {
      return cfConfigs.value[n] || {}
    }

    // ── 设置 ──
    function saveSettings() {
      Object.assign(store.settings, settings)
      startTimer()
      showSettings.value = false
      persist()
    }

    // ── 存储 ──
    function persist() {
      saveStore({ profiles: store.profiles, settings: store.settings })
    }

    onMounted(() => {
      const d = loadStore()
      if (d) {
        if (d.profiles?.length) store.profiles = d.profiles
        if (d.settings) Object.assign(settings, d.settings)
      }
      startTimer()
    })

    onUnmounted(() => { clearInterval(timer) })

    // 切换家长报告时设置默认查看
    watch(parentId, (v) => {
      if (!v && store.profiles.length) parentId.value = store.profiles[0].id
    })

    return {
      screen, prevScr, showSettings, showAddProfile, showBurst, bearWalk,
      settings, profiles, curP, curPId, newP, AVATARS,
      islandAreas, remSecs, remTimeStr, showTimeUp,
      splashArea, skipSplash,
      gameMode, gameBg, gameTitle,
      qs, qIdx, totalQ, baseQ, gScore, correctCnt, wrongCnt,
      answered, chosen, lastOK, shaking, qKey, autoNext,
      consecutiveCorrect,
      cQ, gProgress, isLastQ,
      resStars, resTitle, resBear, newAchs, cfConfigs,
      feedEmoji, feedMsg, failMsg,
      ACHS, achUnlocked, showAchPopup, closeAchPopup,
      parentId, prProfile, prAccuracy, prSkills, prTips,
      CATS, todayStats, recommendedLevel,

      selectProfile, createProfile, playWelcome, playBop,
      startArea, onClickLocked, launchPractice,
      pick: pick_, pickSym: pickSym_, doNext,
      replayGame, goHome, exitGame,
      isAchUnlocked, speakStory,
      openParent,
      burstStyle, cfStyle, saveSettings,
    }
  }
}
</script>

<style scoped>
/* ═══ 全局基础 ═══ */
*{box-sizing:border-box}
.app-root {
  min-height: 100svh;
  width: 100%;
  font-family: 'PingFang SC','Noto Sans SC','Microsoft YaHei',sans-serif;
  background: linear-gradient(135deg,#0093E9,#80D0C7);
  color: white;
  overflow-x: hidden;
  touch-action: manipulation;
}
.app-root.warm-mode { filter: sepia(18%) brightness(0.97) }

/* ═══ 动画基础 ═══ */
.fade-up-enter-active,.fade-up-leave-active{transition:opacity .3s ease,transform .3s ease}
.fade-up-enter-from{opacity:0;transform:translateY(16px)}
.fade-up-leave-to{opacity:0;transform:translateY(-10px)}
.pop-enter-active,.pop-leave-active{transition:all .35s cubic-bezier(.34,1.56,.64,1)}
.pop-enter-from,.pop-leave-to{opacity:0;transform:scale(.6)}
.q-swap-enter-active,.q-swap-leave-active{transition:all .3s ease}
.q-swap-enter-from{opacity:0;transform:translateX(50px) scale(.95)}
.q-swap-leave-to{opacity:0;transform:translateX(-40px) scale(.95)}
.slide-up-enter-active,.slide-up-leave-active{transition:all .3s cubic-bezier(.34,1.56,.64,1)}
.slide-up-enter-from,.slide-up-leave-to{opacity:0;transform:translateY(30px)}

/* ═══ 公用组件 ═══ */
.big-btn {
  display: block; width: 100%; padding: 16px;
  border: none; border-radius: 26px;
  font-size: 1.1rem; font-weight: 900;
  cursor: pointer; transition: transform .2s,box-shadow .2s;
  letter-spacing: 1px;
}
.big-btn:hover { transform: scale(1.04); box-shadow: 0 6px 20px rgba(0,0,0,.2) }
.big-btn:active { transform: scale(.96) }
.big-btn.green { background: linear-gradient(45deg,#4CAF50,#8BC34A); color: white }
.big-btn.blue  { background: linear-gradient(45deg,#667eea,#764ba2); color: white }
.big-btn.white { background: rgba(255,255,255,.85); color: #444 }
.big-btn:disabled { opacity: .45; cursor: not-allowed; transform: none }

.back-btn {
  background: rgba(255,255,255,.22); border: none; color: white;
  padding: 9px 18px; border-radius: 20px; cursor: pointer;
  font-size: .9rem; transition: background .2s; flex-shrink: 0;
}
.back-btn:hover { background: rgba(255,255,255,.38) }
.back-btn.ghost {
  background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.45);
  color: white;
}
.back-btn.ghost:hover { background: rgba(0,0,0,.5) }

.modal-bg {
  position: fixed; inset: 0; background: rgba(0,0,0,.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 600; backdrop-filter: blur(5px);
}
.pg-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  background: rgba(0,0,0,.15); backdrop-filter: blur(10px);
  flex-shrink: 0;
}
.pg-header h2 { margin: 0; font-size: 1.15rem }
.icon-btn {
  background: rgba(255,255,255,.25); border: none;
  border-radius: 50%; width: 40px; height: 40px;
  font-size: 1.2rem; cursor: pointer; transition: transform .2s;
  display:flex;align-items:center;justify-content:center
}
.icon-btn:hover { transform: rotate(20deg) scale(1.1) }

/* Toggle */
.tog{position:relative;width:52px;height:28px;display:inline-block}
.tog input{opacity:0;width:0;height:0}
.tslider{position:absolute;inset:0;background:#ccc;border-radius:28px;cursor:pointer;transition:.3s}
.tslider:before{content:'';position:absolute;width:22px;height:22px;left:3px;bottom:3px;background:white;border-radius:50%;transition:.3s}
.tog input:checked+.tslider{background:#4CAF50}
.tog input:checked+.tslider:before{transform:translateX(24px)}

/* ═══ 选人界面 ═══ */
.select-screen {
  min-height: 100svh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding: 20px;
  background: linear-gradient(160deg,#0093E9 0%,#80D0C7 100%);
  position: relative; overflow: hidden;
}
.sky-deco { position: absolute; inset: 0; pointer-events: none }
.deco-cloud { position: absolute; font-size: 2.8rem; animation: cFloat 9s ease-in-out infinite; opacity: .75 }
@keyframes cFloat{0%,100%{transform:translateX(0)}50%{transform:translateX(18px)}}
.deco-sun { position: absolute; right: 16px; top: 12px; font-size: 3rem; animation: sunSpin 25s linear infinite }
@keyframes sunSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

.select-hero { text-align: center; margin-bottom: 22px; position: relative; z-index: 1 }
.hero-bear {
  font-size: 6rem; cursor: pointer;
  animation: bearBob 2.5s ease-in-out infinite;
  display: block; margin-bottom: 8px;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,.2));
}
@keyframes bearBob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-14px) scale(1.06)}}
.hero-title { font-size: 2.8rem; font-weight: 900; margin: 0; letter-spacing: 3px; text-shadow: 0 4px 16px rgba(0,0,0,.2) }
.hero-tagline { font-size: 1rem; opacity: .85; margin: 6px 0 0 }

.select-hint { font-size: 1rem; opacity: .85; margin-bottom: 16px; position: relative; z-index: 1 }

.profiles-grid {
  display: flex; flex-wrap: wrap; gap: 16px;
  justify-content: center; margin-bottom: 28px; position: relative; z-index: 1;
}
.profile-btn {
  background: rgba(255,255,255,.25); backdrop-filter: blur(14px);
  border: 2px solid rgba(255,255,255,.45); border-radius: 22px;
  padding: 20px 18px; text-align: center; cursor: pointer; min-width: 120px;
  transition: all .3s cubic-bezier(.34,1.56,.64,1);
}
.profile-btn:hover { transform: translateY(-8px) scale(1.08); background: rgba(255,255,255,.4) }
.profile-btn:active { transform: scale(.94) }
.pb-avatar { font-size: 3.5rem; display: block; margin-bottom: 8px }
.pb-name { font-size: 1.05rem; font-weight: 900; margin-bottom: 6px }
.pb-info { display: flex; gap: 8px; justify-content: center; font-size: .78rem; opacity: .85 }
.add-btn { border-style: dashed; opacity: .7 }
.add-btn:hover { opacity: 1 }
.add-av { color: rgba(255,255,255,.7); font-size: 2.8rem }

.parent-portal {
  position: absolute; bottom: 22px;
  background: rgba(255,255,255,.18); border-radius: 22px;
  padding: 9px 20px; font-size: .88rem; cursor: pointer;
  opacity: .75; transition: opacity .2s;
}
.parent-portal:hover { opacity: 1 }

/* ═══ 创建账号弹窗 ═══ */
.add-modal {
  background: white; color: #333; border-radius: 30px;
  padding: 28px 24px; max-width: 420px; width: 94%;
  animation: popIn .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes popIn{from{transform:scale(.5);opacity:0}to{transform:scale(1);opacity:1}}
.add-modal-title { font-size: 1.3rem; font-weight: 900; text-align: center; margin-bottom: 16px }
.avi-grid { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 16px }
.avi-item {
  font-size: 2.2rem; width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; background: #f5f5f5; border: 2px solid transparent; transition: all .2s;
}
.avi-item:hover { background: #e8e8ff; transform: scale(1.1) }
.avi-item.active { border-color: #667eea; background: #e8e8ff; transform: scale(1.15) }
.field-label { font-size: .88rem; color: #666; margin-bottom: 6px }
.name-field {
  width: 100%; border: 2px solid #eee; border-radius: 14px;
  padding: 12px 16px; font-size: 1.05rem; margin-bottom: 14px;
  text-align: center; outline: none; transition: border-color .2s;
}
.name-field:focus { border-color: #667eea }
.age-row { display: flex; gap: 10px; margin-bottom: 18px }
.age-chip {
  flex: 1; text-align: center; padding: 10px 0;
  border-radius: 14px; cursor: pointer; background: #f0f0f0;
  font-weight: 700; font-size: .95rem; border: 2px solid transparent; transition: all .2s;
}
.age-chip.active { background: #667eea; color: white }
.age-chip:hover { transform: scale(1.04) }

/* ═══ 主页 ═══ */
.main-screen {
  min-height: 100svh; display: flex; flex-direction: column;
  background: linear-gradient(180deg,#87CEEB 0%,#B8F0B0 55%,#7DD56F 100%);
}
.main-top {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; position: relative; z-index: 10;
  background: rgba(255,255,255,.12); backdrop-filter: blur(8px);
}
.player-chip {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,.3); border: 1px solid rgba(255,255,255,.5);
  border-radius: 22px; padding: 7px 14px; cursor: pointer; transition: background .2s;
}
.player-chip:hover { background: rgba(255,255,255,.45) }
.pc-av { font-size: 1.5rem }
.pc-name { font-size: .9rem; font-weight: 900; color: #2d4a22 }
.top-stats { flex: 1; display: flex; gap: 6px; justify-content: center; flex-wrap: wrap }
.stat-pill {
  background: rgba(255,255,255,.3); border: 1px solid rgba(255,255,255,.45);
  border-radius: 14px; padding: 5px 10px; font-size: .8rem;
  font-weight: 700; color: #2d4a22; white-space: nowrap;
}
.stat-pill.urgent { background: rgba(255,80,80,.4); color: white; animation: urgPulse 1s ease-in-out infinite }
@keyframes urgPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}

/* 海岛地图 */
.island-wrap { flex: 1; position: relative; overflow: hidden; min-height: 0 }
.island-bg-sky {
  position: absolute; top: 0; left: 0; right: 0; height: 120px;
  pointer-events: none; overflow: hidden;
}
.ib-cloud { position: absolute; top: 10px; font-size: 2rem; animation: cFloat 10s ease-in-out infinite; opacity: .8 }
.ib-bird { position: absolute; right: 20%; top: 35px; font-size: .85rem; animation: birdFly 14s ease-in-out infinite; opacity: .6 }
@keyframes birdFly{0%,100%{transform:translateX(0) translateY(0)}50%{transform:translateX(20px) translateY(-6px)}}

.island-map {
  display: flex; flex-wrap: wrap; gap: 12px;
  padding: 70px 16px 16px;
  justify-content: center; align-items: flex-start;
  position: relative; z-index: 5;
}

.island-node {
  display: flex; flex-direction: column; align-items: center;
  cursor: pointer; transition: transform .3s cubic-bezier(.34,1.56,.64,1);
  position: relative;
}
.island-node.unlocked:hover { transform: translateY(-6px) scale(1.06) }
.island-node.locked { opacity: .6; cursor: not-allowed }
.island-node.done .in-bubble {
  border-color: #4ade80;
  background: rgba(200,255,215,.97);
}
.island-node.done .in-bubble::after {
  border-top-color: rgba(200,255,215,.97);
}

.in-bubble {
  background: rgba(255,255,255,.94); backdrop-filter: blur(8px);
  border-radius: 20px; padding: 12px 14px; text-align: center;
  min-width: 94px; max-width: 110px;
  box-shadow: 0 6px 22px rgba(0,0,0,.12);
  border: 2px solid rgba(255,255,255,.8); color: #333;
  position: relative;
}
.in-bubble::after {
  content: ''; position: absolute; bottom: -10px; left: 50%;
  transform: translateX(-50%); border: 8px solid transparent;
  border-top: 10px solid rgba(255,255,255,.94);
}
.in-emoji { font-size: 2rem; margin-bottom: 4px }
.in-name { font-size: .75rem; font-weight: 900; color: #444; margin-bottom: 4px }
.in-stars { font-size: .75rem }
.in-lock { font-size: 1.2rem }

.in-path-dot { font-size: .5rem; margin-top: 8px; opacity: .5 }

/* 装饰层 */
.map-deco { position: absolute; inset: 0; pointer-events: none; z-index: 2 }
.md-tree { position: absolute; font-size: 2.4rem; pointer-events: none }
.md-flower { position: absolute; font-size: 1.4rem; animation: flSway 4s ease-in-out infinite }
@keyframes flSway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.md-bear {
  position: absolute; bottom: 60px; left: 46%;
  font-size: 2.8rem; transition: all 1.2s ease;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,.2));
}
.md-bear.walk { animation: bearWalkA 1.5s ease-in-out }
@keyframes bearWalkA{0%{transform:translateX(0)}25%{transform:translateX(-18px) rotate(-4deg)}75%{transform:translateX(18px) rotate(4deg)}100%{transform:translateX(0)}}
.md-ocean {
  position: absolute; bottom: 0; left: 0; right: 0;
  text-align: center; font-size: 2rem; letter-spacing: 6px;
  animation: waveA 3s ease-in-out infinite; opacity: .85;
}
@keyframes waveA{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

/* 底部导航 */
.main-nav {
  display: flex;
  background: rgba(255,255,255,.93); backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255,255,255,.5);
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
}
.nav-tab {
  flex: 1; text-align: center; padding: 6px 0; cursor: pointer;
  border-radius: 12px; margin: 0 4px;
  transition: background .2s;
}
.nav-tab:hover,.nav-tab.active { background: rgba(102,126,234,.14) }
.nav-tab.active .nt-lbl { color: #667eea; font-weight: 900 }
.nt-ico { font-size: 1.55rem; display: block }
.nt-lbl { font-size: .68rem; color: #888; margin-top: 2px }

/* ═══ 练习大厅 ═══ */
.practice-screen { min-height: 100svh; display: flex; flex-direction: column }
.header-score { font-size: 1rem; font-weight: 900 }
.practice-list { flex: 1; overflow-y: auto; padding: 14px 14px 80px }
.pcat { margin-bottom: 20px }
.pcat-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px }
.pch-ico { font-size: 1.35rem }
.pch-title { font-size: 1rem; font-weight: 900 }
.pch-age { font-size: .75rem; background: rgba(255,255,255,.2); border-radius: 10px; padding: 2px 8px; opacity: .85 }
.pcat-levels { display: flex; flex-direction: column; gap: 8px }
.level-row {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,.16); backdrop-filter: blur(8px);
  border-radius: 18px; padding: 14px 16px; cursor: pointer;
  border: 1px solid rgba(255,255,255,.28);
  transition: all .25s;
}
.level-row:hover { background: rgba(255,255,255,.28); transform: translateX(4px) }
.lr-ico { font-size: 2.2rem; flex-shrink: 0 }
.lr-info { flex: 1 }
.lr-name { font-size: 1rem; font-weight: 900; margin-bottom: 3px }
.lr-desc { font-size: .77rem; opacity: .75 }
.lr-stars { font-size: .95rem; flex-shrink: 0 }

/* ═══ 游戏界面 ═══ */
.game-screen {
  min-height: 100svh; display: flex; flex-direction: column;
  transition: background .5s ease;
}
.game-top {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: rgba(0,0,0,.35); backdrop-filter: blur(12px);
  flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,.12);
}
.gp-wrap { flex: 1; min-width: 0 }
.gp-title {
  font-size: .82rem; font-weight: 700; margin-bottom: 5px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: rgba(255,255,255,.92); text-shadow: 0 1px 4px rgba(0,0,0,.5);
}
.gp-bar {
  height: 20px; background: rgba(0,0,0,.4);
  border-radius: 10px; position: relative; overflow: visible;
  border: 1px solid rgba(255,255,255,.25);
}
.gp-fill {
  height: 100%; background: linear-gradient(90deg,#FFD700,#FF6B35);
  border-radius: 10px; transition: width .5s ease;
  box-shadow: 0 0 10px rgba(255,180,0,.55);
}
.gp-bear {
  position: absolute; top: -7px;
  font-size: 1.7rem; transition: left .5s ease;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.5));
}
.game-score-tag {
  background: rgba(0,0,0,.4); border: 2px solid rgba(255,215,0,.7);
  border-radius: 16px; padding: 7px 14px; font-size: 1rem; font-weight: 900;
  white-space: nowrap; color: #FFE566;
  text-shadow: 0 1px 4px rgba(0,0,0,.5);
}

/* 题目区 */
.q-zone {
  flex: 1; display: flex; align-items: flex-start; justify-content: center;
  padding: 14px 14px 0; overflow-y: auto; min-height: 0;
}
.q-card {
  /* 深色半透明卡片，在任何深色背景上均清晰 */
  background: rgba(0,0,0,.38); backdrop-filter: blur(20px);
  border-radius: 28px; padding: 20px;
  width: 100%; max-width: 680px;
  border: 1px solid rgba(255,255,255,.18);
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
}
.q-card.shake { animation: shakeA .55s ease }
@keyframes shakeA {
  0%,100%{ transform:translateX(0) }
  20%{ transform:translateX(-12px) }
  40%{ transform:translateX(12px) }
  60%{ transform:translateX(-7px) }
  80%{ transform:translateX(7px) }
}

/* 故事框 */
.story-box {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(255,255,255,.1); border-radius: 16px;
  padding: 12px 14px; margin-bottom: 14px;
  border: 1px solid rgba(255,255,255,.15);
}
.story-icon { font-size: 2rem; flex-shrink: 0; line-height: 1.2 }
.story-text {
  flex: 1; font-size: 1rem; line-height: 1.6; font-weight: 600;
  color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.4);
}
.voice-mini {
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.3);
  border-radius: 50%; width: 34px; height: 34px; font-size: 1rem;
  cursor: pointer; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s; color: white;
}
.voice-mini:hover { background: rgba(255,255,255,.3) }

/* 题目大字 */
.q-question {
  font-size: 2.1rem; font-weight: 900; text-align: center;
  margin-bottom: 16px; line-height: 1.3; color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,.6);
}

/* ── 视觉区通用 ── */
.vitem {
  font-size: 2rem; display: inline-block;
  animation: vPop .4s cubic-bezier(.34,1.56,.64,1) both;
}
.vitem.big { font-size: 2.5rem }
@keyframes vPop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }

/* 数数 */
.v-count {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
  min-height: 56px; padding: 10px;
  background: rgba(255,255,255,.08); border-radius: 16px;
  border: 1px solid rgba(255,255,255,.1);
}

/* 加法 */
.v-add {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; flex-wrap: wrap; padding: 8px 0 28px;
}
.va-group {
  background: rgba(255,255,255,.12); border-radius: 14px;
  padding: 10px 12px; display: flex; flex-direction: column;
  align-items: center; gap: 4px; flex-wrap: wrap;
  min-width: 56px; max-width: 145px;
  border: 1px solid rgba(255,255,255,.18);
}
.va-items { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center }
.va-label {
  font-size: .8rem; font-weight: 900; color: #FFE566;
  text-shadow: 0 1px 3px rgba(0,0,0,.5); white-space: nowrap;
}
.va-plus, .va-eq {
  font-size: 2rem; font-weight: 900; color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,.5);
}
.va-qmark {
  font-size: 2.4rem; font-weight: 900; color: #FFE566;
  background: rgba(255,215,0,.25); border-radius: 50%;
  width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;
  border: 2px solid rgba(255,215,0,.55);
  box-shadow: 0 0 14px rgba(255,215,0,.3);
  text-shadow: 0 2px 6px rgba(0,0,0,.4);
}

/* 减法 */
.v-sub { text-align: center; padding: 4px 0 }
.vs-row {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;
  margin-bottom: 12px;
  background: rgba(255,255,255,.08); border-radius: 14px; padding: 10px;
  border: 1px solid rgba(255,255,255,.1);
}
.vitem.crossed {
  opacity: .18; filter: grayscale(1);
  text-decoration: line-through; transform: scale(.8);
}
.vs-hint {
  font-size: .92rem; font-weight: 700; color: #FFB3A0;
  background: rgba(200,50,30,.35); border-radius: 10px;
  padding: 6px 14px; display: inline-block;
  border: 1px solid rgba(255,100,70,.4);
  text-shadow: 0 1px 3px rgba(0,0,0,.4);
}

/* 乘法 */
.v-mul { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 4px 0 }
.vm-row { display: flex; align-items: center; gap: 10px }
.vm-group {
  display: flex; gap: 5px; flex-wrap: wrap;
  background: rgba(255,255,255,.12); border-radius: 12px; padding: 8px 12px;
  border: 1px solid rgba(255,255,255,.18);
}
.vm-arrow {
  font-size: .8rem; font-weight: 700; color: #FFE566;
  background: rgba(0,0,0,.25); border-radius: 8px; padding: 3px 8px;
  text-shadow: 0 1px 3px rgba(0,0,0,.4);
}
.vm-desc {
  font-size: .92rem; font-weight: 700; color: #fff;
  background: rgba(255,255,255,.12); border-radius: 10px;
  padding: 5px 16px; margin-top: 4px;
  border: 1px solid rgba(255,255,255,.18);
  text-shadow: 0 1px 3px rgba(0,0,0,.4);
}

/* 比大小 */
.v-compare { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 8px 0 }
.vc-side { text-align: center }
.vc-num {
  font-size: 3.8rem; font-weight: 900; color: #fff;
  background: rgba(255,255,255,.15); border-radius: 16px;
  width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;
  margin-bottom: 8px; border: 2px solid rgba(255,255,255,.3);
  text-shadow: 0 2px 10px rgba(0,0,0,.5);
}
.vc-dots { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; max-width: 84px }
.vc-dot { font-size: .8rem; color: #FFE566; opacity: .9 }
.vc-mid { text-align: center }
.vc-scale { font-size: 2.2rem; margin-bottom: 6px }
.vc-blank {
  font-size: 2.4rem; font-weight: 900; color: rgba(255,255,255,.55);
  background: rgba(255,255,255,.1); border-radius: 10px;
  padding: 4px 14px; border: 2px dashed rgba(255,255,255,.35);
}

/* ═══ 答案区 ═══ */
.answer-zone { padding: 12px 14px; flex-shrink: 0 }
.choice-grid {
  display: grid; grid-template-columns: repeat(2,1fr);
  gap: 12px; max-width: 680px; margin: 0 auto;
}
.choice-btn {
  /* 深色背景 + 白字，任何关卡背景上均清晰可读 */
  background: rgba(255,255,255,.15);
  border: 2px solid rgba(255,255,255,.45);
  border-radius: 22px; padding: 20px 12px;
  font-size: 2.2rem; font-weight: 900; color: #fff;
  cursor: pointer; transition: all .25s cubic-bezier(.34,1.56,.64,1);
  min-height: 80px; display: flex; align-items: center; justify-content: center;
  text-shadow: 0 2px 10px rgba(0,0,0,.55);
  box-shadow: 0 4px 18px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.15);
}
.choice-btn:hover:not(:disabled) {
  background: rgba(255,255,255,.28); transform: scale(1.06);
  box-shadow: 0 8px 28px rgba(0,0,0,.35);
}
.choice-btn:active { transform: scale(.94) }
.choice-btn.chosen {
  background: rgba(255,220,0,.35); border-color: #FFD700;
  transform: scale(1.04); box-shadow: 0 0 20px rgba(255,215,0,.4);
}
.choice-btn.correct {
  background: rgba(40,170,70,.75) !important; border-color: #5DF097 !important;
  box-shadow: 0 0 22px rgba(60,200,100,.5) !important;
  animation: correctA .5s ease;
}
.choice-btn.wrong {
  background: rgba(210,40,40,.65) !important; border-color: #FF7070 !important;
  box-shadow: 0 0 18px rgba(210,40,40,.45) !important;
}
.choice-btn:disabled { cursor: default }
@keyframes correctA {
  0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1.05)}
}

.sym-grid { display: flex; gap: 16px; justify-content: center; padding: 8px 0 }
/* sym-btn 定义见下方 "比大小按钮" 区 */


/* ═══ 反馈条 ═══ */
.feedback {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; margin: 8px 14px 14px;
  border-radius: 22px; flex-shrink: 0;
}
.fb-ok {
  background: rgba(20,140,60,.85); border: 2px solid rgba(100,230,130,.6);
  box-shadow: 0 4px 20px rgba(20,140,60,.4);
}
.fb-no {
  background: rgba(170,40,20,.85); border: 2px solid rgba(255,100,80,.6);
  box-shadow: 0 4px 20px rgba(170,40,20,.4);
}
.fb-emoji { font-size: 2.4rem; flex-shrink: 0 }
.fb-text {
  font-size: 1rem; font-weight: 800; line-height: 1.4;
  color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,.4);
}
.fb-btn {
  background: #fff; color: #222; border: none;
  border-radius: 18px; padding: 12px 18px;
  font-size: .95rem; font-weight: 900; cursor: pointer;
  transition: transform .2s; white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0,0,0,.2);
}
.fb-btn:hover { transform: scale(1.06) }

/* ═══ 结算 ═══ */
.result-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.72);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; backdrop-filter: blur(7px);
}
.result-card {
  background: linear-gradient(135deg,#a8edea,#fed6e3);
  color: #333; border-radius: 32px;
  padding: 30px 24px; max-width: 420px; width: 92%;
  text-align: center; position: relative; overflow: hidden;
  animation: popIn .5s cubic-bezier(.34,1.56,.64,1);
}
.rc-confetti { position: absolute; inset: 0; pointer-events: none }
.cf { position: absolute; animation: cfFall 1.8s ease forwards }
@keyframes cfFall{0%{opacity:1;transform:translateY(-20px) scale(0)}50%{opacity:1;transform:scale(1)}100%{opacity:0;transform:translateY(25px) scale(.5)}}
.rc-bear { font-size: 4.5rem; animation: bearBob 1.2s infinite }
.rc-title { font-size: 1.7rem; font-weight: 900; margin: 8px 0 14px }
.rc-stars { margin-bottom: 16px }
.res-star {
  font-size: 3rem; display: inline-block; margin: 0 4px;
  opacity: .18; transform: scale(.6); transition: all .4s cubic-bezier(.34,1.56,.64,1);
}
.res-star.lit { opacity: 1; transform: scale(1.2); animation: starLit .5s cubic-bezier(.34,1.56,.64,1) forwards }
@keyframes starLit{0%{transform:scale(0)}70%{transform:scale(1.4)}100%{transform:scale(1.2)}}
.rc-stats { display: flex; justify-content: space-around; background: rgba(255,255,255,.4); border-radius: 18px; padding: 12px; margin-bottom: 14px }
.rcs { text-align: center }
.rcs-v { font-size: 1.4rem; font-weight: 900; display: block }
.rcs-l { font-size: .72rem; opacity: .7; margin-top: 2px }
.rcs-v.green { color: #16a34a }
.rcs-v.yellow { color: #d97706 }
.rcs-v.blue { color: #2563eb }
.new-ach { background: rgba(255,215,0,.35); border-radius: 14px; padding: 10px; margin-bottom: 12px }
.na-hd { font-weight: 900; font-size: .9rem; margin-bottom: 6px }
.na-row { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center }
.na-item { background: rgba(255,255,255,.45); border-radius: 10px; padding: 4px 10px; font-size: .85rem }
.rc-actions { display: flex; gap: 10px }
.rc-actions .big-btn { flex: 1 }

/* ═══ 成就 ═══ */
.ach-screen { min-height: 100svh; display: flex; flex-direction: column }
.ach-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; padding: 14px; overflow-y: auto }
.ach-tile { border-radius: 18px; padding: 14px 10px; text-align: center; transition: transform .2s }
.ach-tile.got { background: rgba(255,255,255,.22); border: 2px solid rgba(255,215,0,.7) }
.ach-tile:not(.got) { background: rgba(0,0,0,.2); opacity: .55 }
.ach-tile.got:hover { transform: scale(1.05) }
.at-icon { font-size: 2.3rem; margin-bottom: 6px }
.at-name { font-size: .8rem; font-weight: 900; margin-bottom: 3px }
.at-desc { font-size: .68rem; opacity: .78; line-height: 1.3 }

/* ═══ 家长报告 ═══ */
.parent-screen { min-height: 100svh; display: flex; flex-direction: column }
.parent-head { background: rgba(20,40,80,.4) }
.pr-tabs { display: flex; gap: 8px; padding: 12px 16px 0; flex-wrap: wrap }
.pr-tab {
  background: rgba(255,255,255,.16); border-radius: 14px;
  padding: 8px 14px; cursor: pointer; font-size: .88rem;
  transition: all .2s; border: 1px solid rgba(255,255,255,.2);
}
.pr-tab.active { background: rgba(255,255,255,.35); font-weight: 900; border-color: rgba(255,255,255,.6) }
.pr-body { flex: 1; overflow-y: auto; padding: 14px 14px 80px; max-width: 800px; margin: 0 auto; width: 100% }
.pr-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; margin-bottom: 12px }
.pr-card { border-radius: 14px; padding: 12px 8px; text-align: center }
.c-blue{background:rgba(100,160,255,.35)} .c-green{background:rgba(100,220,100,.35)}
.c-orange{background:rgba(255,160,80,.35)} .c-purple{background:rgba(180,100,255,.35)}
.prc-big { font-size: 1.4rem; font-weight: 900 }
.prc-label { font-size: .65rem; opacity: .82; margin-top: 2px }
.pr-section { background: rgba(255,255,255,.12); border-radius: 18px; padding: 16px; margin-bottom: 10px }
.prs-title { font-size: .95rem; font-weight: 900; margin-bottom: 12px; border-left: 4px solid rgba(255,255,255,.7); padding-left: 8px }
.skill-list { display: flex; flex-direction: column; gap: 8px }
.sk-item { display: flex; align-items: center; gap: 8px }
.sk-name { font-size: .78rem; width: 95px; flex-shrink: 0 }
.sk-bar-bg { flex: 1; height: 10px; background: rgba(255,255,255,.22); border-radius: 5px; overflow: hidden }
.sk-bar-fill { height: 100%; border-radius: 5px; transition: width .8s ease }
.sk-pct { font-size: .78rem; font-weight: 900; width: 34px; text-align: right }
.adv-list { display: flex; flex-direction: column; gap: 7px }
.adv-row { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,.08); border-radius: 10px; padding: 9px 12px }
.adv-emoji { font-size: 1.4rem }
.adv-name { flex: 1; font-size: .88rem; font-weight: 700 }
.adv-status { font-size: .78rem }
.adv-stars { font-size: .85rem }
.s-done{color:#86efac} .s-ing{color:#fde68a} .s-lock{opacity:.5}
.pr-achs { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0 }
.pr-ach-dot { font-size: 1.6rem; opacity: .25; transition: opacity .3s }
.pr-ach-dot.lit { opacity: 1 }
.tip-sec {}
.tip-item { background: rgba(255,255,255,.12); border-radius: 10px; padding: 10px 12px; font-size: .85rem; line-height: 1.55; margin-bottom: 6px }

/* ═══ 设置 ═══ */
.settings-modal {
  background: white; color: #333; border-radius: 26px;
  max-width: 400px; width: 92%; overflow: hidden;
  animation: popIn .3s ease;
}
.sm-title { background: linear-gradient(135deg,#667eea,#764ba2); color: white; padding: 16px 22px; font-size: 1.1rem; font-weight: 900 }
.sm-list { padding: 14px 20px }
.sm-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: .95rem; color: #555 }
.sm-sel { border: 1px solid #ddd; border-radius: 9px; padding: 7px 10px; font-size: .86rem; color: #333 }
.settings-modal .big-btn { margin: 14px 20px; width: calc(100% - 40px) }

/* ═══ 星星爆炸 ═══ */
.burst { position: fixed; inset: 0; pointer-events: none; z-index: 999 }
.burst-p { position: absolute; animation: burstFly .85s ease-out forwards }
@keyframes burstFly{0%{transform:scale(0) rotate(0);opacity:1}60%{opacity:1}100%{transform:scale(1.2) rotate(380deg) translate(20px,-30px);opacity:0}}

/* ═══ F2: 关卡过场画面 ═══ */
.splash-screen {
  position: fixed; inset: 0; z-index: 800;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer;
}
.splash-inner {
  text-align: center; padding: 0 32px;
  animation: splashIn .6s cubic-bezier(.34,1.56,.64,1);
}
@keyframes splashIn {
  from { opacity: 0; transform: scale(.7) translateY(30px) }
  to   { opacity: 1; transform: scale(1) translateY(0) }
}
.splash-emoji {
  font-size: 7rem; display: block; margin-bottom: 16px;
  animation: splashBob 1.2s ease-in-out infinite;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,.3));
}
@keyframes splashBob {
  0%,100% { transform: translateY(0) scale(1) }
  50%     { transform: translateY(-18px) scale(1.08) }
}
.splash-name {
  font-size: 3rem; font-weight: 900; color: #fff;
  text-shadow: 0 4px 16px rgba(0,0,0,.4); margin-bottom: 14px;
  letter-spacing: 2px;
}
.splash-desc {
  font-size: 1.15rem; font-weight: 700; color: rgba(255,255,255,.9);
  text-shadow: 0 2px 8px rgba(0,0,0,.4); margin-bottom: 28px;
  line-height: 1.5;
}
.splash-hint {
  font-size: .9rem; color: rgba(255,255,255,.65);
  animation: splashPulse 1.2s ease-in-out infinite;
}
@keyframes splashPulse { 0%,100%{opacity:.5} 50%{opacity:1} }
.splash-bear {
  position: absolute; bottom: 40px; right: 32px;
  font-size: 4rem;
  animation: splashBob 1.8s ease-in-out infinite;
  animation-delay: .4s;
}

/* ═══ U3: 数数题行布局 ═══ */
.vc-row {
  display: flex; justify-content: center; gap: 8px;
  margin-bottom: 4px;
}

/* ═══ U2: 答对自动推进倒计时环 ═══ */
.fb-body { flex: 1; min-width: 0 }
.fb-auto-hint {
  font-size: .78rem; color: rgba(255,255,255,.75);
  margin-top: 4px; font-weight: 600;
}
.fb-auto-ring {
  position: relative; width: 52px; height: 52px;
  flex-shrink: 0; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.far-svg { width: 52px; height: 52px; transform: rotate(-90deg) }
.far-track {
  fill: none; stroke: rgba(255,255,255,.22);
  stroke-width: 3;
}
.far-fill {
  fill: none; stroke: #fff;
  stroke-width: 3;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  stroke-linecap: round;
  animation: farFill 1.6s linear forwards;
}
@keyframes farFill { to { stroke-dashoffset: 0 } }
.far-icon {
  position: absolute; font-size: 1.1rem; color: #fff;
  font-weight: 900;
}

/* ═══ U6: 比大小按钮 ═══ */
.sym-btn {
  background: rgba(255,255,255,.15); border: 2px solid rgba(255,255,255,.45);
  border-radius: 22px; width: 90px; min-height: 90px; padding: 8px 4px;
  color: #fff; cursor: pointer;
  transition: all .25s cubic-bezier(.34,1.56,.64,1);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
  text-shadow: 0 2px 10px rgba(0,0,0,.55);
  box-shadow: 0 4px 18px rgba(0,0,0,.25);
}
.sym-btn:hover:not(:disabled) { background: rgba(255,255,255,.28); transform: scale(1.08) }
.sym-btn.chosen { background: rgba(255,220,0,.35); border-color: #FFD700 }
.sym-btn.correct { background: rgba(40,170,70,.75) !important; border-color: #5DF097 !important }
.sym-btn.wrong   { background: rgba(210,40,40,.65) !important; border-color: #FF7070 !important }
.sym-btn:disabled { cursor: default }
.sym-main { font-size: 2.2rem; font-weight: 900; line-height: 1 }
.sym-hint { font-size: 1rem; line-height: 1; opacity: .85 }
.sym-label { font-size: .68rem; font-weight: 700; opacity: .8; white-space: nowrap }

/* ═══ F5: 成就弹窗 ═══ */
.ach-popup-bg {
  position: fixed; inset: 0; background: rgba(0,0,0,.72);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; cursor: pointer; backdrop-filter: blur(6px);
}
.ach-popup {
  background: linear-gradient(160deg,#1a1a4e,#2d1b69);
  border: 2px solid rgba(255,215,0,.6);
  border-radius: 32px; padding: 32px 28px;
  max-width: 360px; width: 92%;
  text-align: center;
  box-shadow: 0 0 60px rgba(255,215,0,.3), 0 20px 60px rgba(0,0,0,.5);
  animation: achPopIn .5s cubic-bezier(.34,1.56,.64,1);
}
@keyframes achPopIn {
  from { transform: scale(.4) rotate(-8deg); opacity: 0 }
  to   { transform: scale(1) rotate(0); opacity: 1 }
}
.ap-title {
  font-size: 1.4rem; font-weight: 900; color: #FFE566;
  margin-bottom: 20px; text-shadow: 0 0 20px rgba(255,215,0,.5);
  letter-spacing: 1px;
}
.ap-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px }
.ap-item {
  display: flex; align-items: center; gap: 14px;
  background: rgba(255,255,255,.1); border-radius: 16px;
  padding: 12px 16px; text-align: left;
  border: 1px solid rgba(255,215,0,.25);
  animation: achItemIn .4s cubic-bezier(.34,1.56,.64,1) both;
}
.ap-item:nth-child(1) { animation-delay: .1s }
.ap-item:nth-child(2) { animation-delay: .2s }
.ap-item:nth-child(3) { animation-delay: .3s }
@keyframes achItemIn {
  from { transform: translateX(-20px); opacity: 0 }
  to   { transform: translateX(0); opacity: 1 }
}
.ap-icon { font-size: 2.4rem; flex-shrink: 0 }
.ap-info { flex: 1 }
.ap-name { font-size: 1rem; font-weight: 900; color: #FFE566; margin-bottom: 2px }
.ap-desc { font-size: .8rem; color: rgba(255,255,255,.75) }
.ap-hint { font-size: .78rem; color: rgba(255,255,255,.45); animation: splashPulse 1.5s infinite }


/* ═══ F1: 今日摘要 pill ═══ */
.stat-pill.today {
  background: rgba(100,220,140,.35); border: 1px solid rgba(100,220,140,.5);
  color: #e8fff0;
}

/* ═══ F2: 练习推荐横幅 ═══ */
.rec-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg,rgba(255,200,50,.25),rgba(255,140,0,.2));
  border: 2px solid rgba(255,200,50,.5);
  border-radius: 20px; padding: 14px 18px; margin-bottom: 18px;
  cursor: pointer; transition: all .25s cubic-bezier(.34,1.56,.64,1);
  box-shadow: 0 4px 18px rgba(255,160,0,.2);
}
.rec-banner:hover { transform: translateY(-3px); background: linear-gradient(135deg,rgba(255,200,50,.38),rgba(255,140,0,.3)) }
.rec-banner:active { transform: scale(.97) }
.rec-left { display: flex; align-items: center; gap: 12px }
.rec-badge {
  background: rgba(255,200,0,.85); color: #333;
  border-radius: 10px; padding: 3px 9px; font-size: .72rem; font-weight: 900;
  white-space: nowrap; flex-shrink: 0;
}
.rec-ico { font-size: 2.2rem; flex-shrink: 0 }
.rec-info { flex: 1 }
.rec-name { font-size: 1rem; font-weight: 900; color: #FFE566; margin-bottom: 2px }
.rec-sub { font-size: .78rem; color: rgba(255,255,255,.75) }
.rec-arrow { font-size: 1.4rem; color: rgba(255,215,0,.8); font-weight: 900 }

/* ═══ F3: 连击热度计 ═══ */
.streak-tag {
  display: flex; align-items: center; gap: 3px;
  background: rgba(255,100,0,.35); border: 1px solid rgba(255,140,0,.6);
  border-radius: 14px; padding: 5px 10px;
  animation: streakPop .3s cubic-bezier(.34,1.56,.64,1);
  flex-shrink: 0;
}
@keyframes streakPop { from{transform:scale(.5)} to{transform:scale(1)} }
.streak-tag.streak-5 {
  background: rgba(255,60,0,.45); border-color: rgba(255,100,0,.8);
  animation: streakGlow 1s ease-in-out infinite;
}
@keyframes streakGlow { 0%,100%{box-shadow:0 0 8px rgba(255,100,0,.4)} 50%{box-shadow:0 0 18px rgba(255,100,0,.8)} }
.st-flame { font-size: .95rem; line-height: 1 }
.st-num { font-size: .78rem; font-weight: 900; color: #FFD700 }

/* ═══ U3: 加法 A/B 组颜色区分 ═══ */
.va-group-a {
  background: rgba(50,120,255,.2) !important;
  border: 2px solid rgba(80,160,255,.5) !important;
}
.va-group-a .va-label { color: #90caff !important }
.va-group-b {
  background: rgba(255,140,0,.2) !important;
  border: 2px solid rgba(255,180,0,.5) !important;
}
.va-group-b .va-label { color: #FFD580 !important }

/* ═══ U4: 比大小 overflow dots ═══ */
.vc-num-lg {
  font-size: 4.8rem !important;
  width: 96px !important; height: 96px !important;
}
.vc-dots-overflow {
  display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; max-width: 88px
}
.vc-dot-more {
  font-size: .75rem; font-weight: 900; color: #FFE566;
  background: rgba(255,215,0,.25); border-radius: 8px;
  padding: 1px 6px; margin-top: 2px; white-space: nowrap;
}

/* ═══ U5: 减法大数字模式 ═══ */
.vs-num-mode {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; flex-wrap: wrap; padding: 8px 0;
}
.vsn-total, .vsn-remove {
  display: flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,.12); border-radius: 16px;
  padding: 12px 18px; border: 1px solid rgba(255,255,255,.2);
}
.vsn-remove { background: rgba(210,40,40,.25); border-color: rgba(255,100,80,.4) }
.vsn-emoji { font-size: 2rem }
.cross-emoji { text-decoration: line-through; opacity: .5; filter: grayscale(1) }
.vsn-num { font-size: 3rem; font-weight: 900; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.5) }
.vsn-red { color: #ff8080 }
.vsn-label { font-size: 1rem; color: rgba(255,255,255,.8) }
.vsn-minus {
  font-size: .9rem; font-weight: 700; color: #ff8080;
  background: rgba(210,40,40,.2); border-radius: 10px;
  padding: 5px 10px;
}
.vsn-eq {
  font-size: 2rem; font-weight: 900; color: #FFE566;
  text-shadow: 0 2px 8px rgba(0,0,0,.4);
}

/* ═══ U2: 时间归零横幅 ═══ */
.time-up-banner {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg,#1a1a4e,#2d1b69);
  border: 2px solid rgba(150,120,255,.6);
  border-radius: 24px; padding: 14px 24px;
  display: flex; align-items: center; gap: 12px;
  z-index: 900; box-shadow: 0 8px 32px rgba(0,0,0,.5);
  min-width: 260px; justify-content: center;
  animation: tuBannerIn .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes tuBannerIn { from{transform:translateX(-50%) translateY(30px);opacity:0} to{transform:translateX(-50%) translateY(0);opacity:1} }
.tub-emoji { font-size: 1.8rem }
.tub-text { font-size: .95rem; font-weight: 800; color: #fff; text-align: center; line-height: 1.4 }

@media (min-width: 768px) {
  .profiles-grid { gap: 22px }
  .profile-btn { min-width: 140px; padding: 24px 22px }
  .pb-avatar { font-size: 4.2rem }
  .pb-name { font-size: 1.2rem }

  .island-map { padding: 80px 32px 20px; gap: 20px }
  .in-bubble { min-width: 110px; padding: 16px 18px }
  .in-emoji { font-size: 2.4rem }
  .in-name { font-size: .85rem }

  .pcat-levels { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px }
  .level-row { padding: 18px 20px }
  .lr-ico { font-size: 2.6rem }
  .lr-name { font-size: 1.1rem }

  .q-zone { padding: 20px 20px 0 }
  .q-card { padding: 26px 28px }
  .q-question { font-size: 2.4rem }
  .vitem { font-size: 2.4rem }
  .vitem.big { font-size: 2.8rem }
  .choice-grid { grid-template-columns: repeat(4,1fr); gap: 14px }
  .choice-btn { font-size: 2.6rem; min-height: 90px }
  .sym-btn { width: 100px; height: 100px; font-size: 3rem }
  .feedback { padding: 16px 24px }
  .fb-emoji { font-size: 2.8rem }
  .fb-text { font-size: 1.05rem }

  .ach-grid { grid-template-columns: repeat(4,1fr); gap: 14px }
  .pr-row { grid-template-columns: repeat(4,1fr) }
}

/* ═══ 大平板/桌面（≥1024px） ═══ */
@media (min-width: 1024px) {
  .select-screen { gap: 20px }
  .hero-bear { font-size: 8rem }
  .hero-title { font-size: 3.4rem }
  .profile-btn { min-width: 160px }

  .main-screen { flex-direction: column }
  .island-map { max-width: 900px; margin: 0 auto }

  .practice-list { max-width: 800px; margin: 0 auto; width: 100% }
  .pcat-levels { grid-template-columns: repeat(3,1fr) }

  .q-zone { max-width: 800px; margin: 0 auto; width: 100%; padding: 20px 0 0 }
  .answer-zone { max-width: 800px; margin: 0 auto; width: 100% }
  .choice-grid { gap: 16px }
  .choice-btn { font-size: 2.8rem }

  .ach-grid { grid-template-columns: repeat(5,1fr) }
  .pr-body { max-width: 900px }
}

/* ═══ 手机小屏适配（≤380px） ═══ */
@media (max-width: 380px) {
  .hero-title { font-size: 2.1rem }
  .profile-btn { min-width: 100px; padding: 16px 14px }
  .pb-avatar { font-size: 2.8rem }
  .choice-btn { font-size: 1.8rem; padding: 18px 8px; min-height: 70px }
  .q-question { font-size: 1.6rem }
  .sym-btn { width: 74px; height: 74px; font-size: 2.2rem }
  .ach-grid { grid-template-columns: repeat(2,1fr) }
  .pr-row { grid-template-columns: repeat(2,1fr) }
  .in-bubble { min-width: 82px; padding: 10px 10px }
}
</style>
