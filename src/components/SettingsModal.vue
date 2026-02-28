<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>游戏设置</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <div class="setting-item">
          <label>每日游戏时长限制 (分钟)</label>
          <input type="number" v-model.number="settings.dailyTimeLimit" min="5" max="120">
        </div>
        <div class="setting-item">
          <label>语音提示</label>
          <div class="toggle">
            <input type="checkbox" id="voice" v-model="settings.voiceEnabled">
            <label for="voice" class="toggle-label"></label>
          </div>
        </div>
        <div class="setting-item">
          <label>护眼模式</label>
          <div class="toggle">
            <input type="checkbox" id="eye" v-model="settings.eyeProtection">
            <label for="eye" class="toggle-label"></label>
          </div>
        </div>
        <div class="setting-item">
          <label>音效</label>
          <div class="toggle">
            <input type="checkbox" id="sound" v-model="settings.soundEnabled">
            <label for="sound" class="toggle-label"></label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="save-button" @click="saveSettings">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../stores/settingsStore'

const settings = useSettingsStore()

const closeModal = () => {
  settings.closeSettings()
}

const saveSettings = () => {
  settings.saveSettings()
  closeModal()
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.close-button:hover {
  color: #333;
}

.setting-item {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item label {
  font-size: 16px;
  color: #333;
}

.setting-item select,
.setting-item input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 120px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background-color: #667eea;
}

input:focus + .toggle-label {
  box-shadow: 0 0 1px #667eea;
}

input:checked + .toggle-label:before {
  transform: translateX(26px);
}

.modal-footer {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
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