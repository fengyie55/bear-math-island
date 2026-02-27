<template>
  <div class="user-login">
    <div class="login-modal">
      <div class="modal-header">
        <h2 class="title">
          <span class="emoji">🐻</span> 小熊算数岛
        </h2>
        <p class="subtitle">欢迎来到数学冒险世界！</p>
      </div>

      <div class="modal-body">
        <div class="form-tabs">
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'login' }"
            @click="switchTab('login')"
          >
            登录
          </button>
          <button 
            class="tab-button" 
            :class="{ active: activeTab === 'register' }"
            @click="switchTab('register')"
          >
            新用户
          </button>
        </div>

        <form class="user-form" @submit.prevent="handleSubmit">
          <!-- 登录表单 -->
          <div v-if="activeTab === 'login'" class="form-content">
            <div class="form-group">
              <label for="login-username">用户名</label>
              <input
                id="login-username"
                v-model="loginForm.username"
                type="text"
                placeholder="请输入用户名"
                required
                autocomplete="username"
                autofocus
              />
            </div>

            <div class="form-group">
              <label for="login-password">密码</label>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                required
                autocomplete="current-password"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">
                登录游戏
              </button>
            </div>
          </div>

          <!-- 注册表单 -->
          <div v-else class="form-content">
            <div class="form-group">
              <label for="register-username">用户名</label>
              <input
                id="register-username"
                v-model="registerForm.username"
                type="text"
                placeholder="请输入用户名"
                required
                autocomplete="username"
                autofocus
              />
            </div>

            <div class="form-group">
              <label for="register-password">密码</label>
              <input
                id="register-password"
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                required
                autocomplete="new-password"
              />
            </div>

            <div class="form-group">
              <label for="register-confirm">确认密码</label>
              <input
                id="register-confirm"
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                required
                autocomplete="new-password"
              />
            </div>

            <div class="form-group">
              <label for="register-avatar">头像</label>
              <div class="avatar-selector">
                <div 
                  class="avatar-option"
                  v-for="avatar in avatarOptions"
                  :key="avatar"
                  :class="{ active: registerForm.avatar === avatar }"
                  @click="selectAvatar(avatar)"
                >
                  {{ avatar }}
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">
                创建账户
              </button>
            </div>
          </div>

          <!-- 错误信息 -->
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import StorageManager from '../utils/storage'

export default {
  name: 'UserLogin',
  
  data() {
    return {
      activeTab: 'login',
      errorMessage: '',
      
      loginForm: {
        username: '',
        password: ''
      },
      
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        avatar: '🐻'
      },
      
      avatarOptions: ['🐻', '🐼', '🦁', '🐯', '🐨', '🐰', '🐮', '🐷', '🐶', '🐱']
    }
  },
  
  methods: {
    switchTab(tab) {
      this.activeTab = tab
      this.errorMessage = ''
    },
    
    selectAvatar(avatar) {
      this.registerForm.avatar = avatar
    },
    
    async handleSubmit() {
      try {
        this.errorMessage = ''
        
        if (this.activeTab === 'login') {
          await this.handleLogin()
        } else {
          await this.handleRegister()
        }
      } catch (error) {
        this.errorMessage = error.message
      }
    },
    
    handleLogin() {
      return new Promise((resolve, reject) => {
        // 验证输入
        if (!this.loginForm.username.trim() || !this.loginForm.password.trim()) {
          return reject(new Error('请输入用户名和密码'))
        }
        
        // 验证用户
        const user = StorageManager.validateUser(
          this.loginForm.username.trim(),
          this.loginForm.password.trim()
        )
        
        if (user) {
          // 登录成功
          StorageManager.setCurrentUser(user.id)
          this.$emit('login-success', user)
          resolve()
        } else {
          reject(new Error('用户名或密码错误'))
        }
      })
    },
    
    handleRegister() {
      return new Promise((resolve, reject) => {
        // 验证输入
        if (!this.registerForm.username.trim() || !this.registerForm.password.trim()) {
          return reject(new Error('请输入用户名和密码'))
        }
        
        if (this.registerForm.password.length < 4) {
          return reject(new Error('密码长度至少需要4位'))
        }
        
        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          return reject(new Error('两次输入的密码不一致'))
        }
        
        // 检查用户名是否已存在
        if (StorageManager.findUserByUsername(this.registerForm.username.trim())) {
          return reject(new Error('用户名已存在'))
        }
        
        // 创建用户
        const newUser = {
          username: this.registerForm.username.trim(),
          password: this.registerForm.password.trim(),
          avatar: this.registerForm.avatar
        }
        
        if (StorageManager.addUser(newUser)) {
          // 自动登录新创建的用户
          const user = StorageManager.findUserByUsername(newUser.username)
          StorageManager.setCurrentUser(user.id)
          this.$emit('login-success', user)
          resolve()
        } else {
          reject(new Error('创建用户失败，请重试'))
        }
      })
    }
  }
}
</script>

<style scoped>
.user-login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.login-modal {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  padding: 30px;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.title .emoji {
  margin-right: 10px;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
}

.form-tabs {
  display: flex;
  margin-bottom: 25px;
  background: #f0f0f0;
  border-radius: 10px;
  padding: 4px;
}

.tab-button {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  background: rgba(102, 126, 234, 0.1);
}

.tab-button.active {
  background: #667eea;
  color: white;
}

.user-form {
  width: 100%;
}

.form-content {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.avatar-selector {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.avatar-option {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.avatar-option:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.1);
}

.avatar-option.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.form-actions {
  margin-top: 30px;
}

.btn-primary {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.error-message {
  margin-top: 20px;
  padding: 12px 16px;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid #fcc;
  animation: shake 0.3s ease-in-out;
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 480px) {
  .login-modal {
    padding: 20px;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .form-group input {
    padding: 10px 14px;
  }
  
  .avatar-option {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>
