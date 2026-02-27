<template>
  <div class="settings-modal" v-if="show">
    <div class="modal-overlay" @click="close"></div>
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">⚙️ 设置</div>
        <div class="close-button" @click="close">×</div>
      </div>
      
      <div class="settings-content">
        <div class="setting-item">
          <div class="setting-label">每日游戏时长（分钟）</div>
          <div class="setting-value">
            <select v-model="localSettings.dailyDurationLimit">
              <option value="15">15分钟（适合3-4岁）</option>
              <option value="20">20分钟（适合4-5岁）</option>
              <option value="30">30分钟（适合5-6岁）</option>
            </select>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">语音提示</div>
          <div class="setting-value">
            <label class="toggle-switch">
              <input type="checkbox" v-model="localSettings.voiceEnabled">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">护眼模式</div>
          <div class="setting-value">
            <label class="toggle-switch">
              <input type="checkbox" v-model="localSettings.eyeProtectionEnabled">
              <span class="slider"></span>
            </label>
          </div>
        </div>
        
        <div class="setting-item">
          <div class="setting-label">音效</div>
          <div class="setting-value">
            <label class="toggle-switch">
              <input type="checkbox" v-model="localSettings.soundEnabled">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="save-button" @click="saveSettings">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'SettingsModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => ({
        dailyDurationLimit: 15,
        voiceEnabled: true,
        soundEnabled: true,
        eyeProtectionEnabled: true
      })
    }
  },
  emits: ['close', 'save-settings'],
  setup(props, { emit }) {
    const localSettings = reactive({
      dailyDurationLimit: props.settings.dailyDurationLimit,
      voiceEnabled: props.settings.voiceEnabled,
      soundEnabled: props.settings.soundEnabled,
      eyeProtectionEnabled: props.settings.eyeProtectionEnabled
    })

    watch(() => props.settings, (newSettings) => {
      Object.assign(localSettings, newSettings)
    }, { deep: true })

    const close = () => {
      emit('close')
    }

    const saveSettings = () => {
      emit('save-settings', { ...localSettings })
    }

    return {
      localSettings,
      close,
      saveSettings
    }
  }
}
</script>

<style scoped>
.settings-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: modalFadeIn 0.3s ease;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  color: #333;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  position: relative;
  z-index: 1001;
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.close-button {
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.6;
}

.close-button:hover {
  opacity: 1;
}

.settings-content {
  text-align: left;
  margin: 20px 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.setting-label {
  font-weight: bold;
  flex: 1;
}

.setting-value {
  flex: 1;
  text-align: right;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4CAF50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.save-button {
  background: linear-gradient(45deg, #4CAF50, #8BC34A);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>