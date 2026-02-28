# Bear Math Island - 小熊算数岛

3-6岁儿童数学学习应用，通过游戏化的方式帮助儿童学习数学基础知识。

## 项目介绍

Bear Math Island 是一个专为幼儿设计的数学学习应用，通过可爱的小熊角色和互动游戏，让孩子在愉快的氛围中学习数数、加减法等数学概念。

### 主要功能

- 🐻 **互动游戏** - 通过游戏化学习提升兴趣
- 🎯 **分级难度** - 根据年龄和能力自动调整难度
- 📊 **学习进度追踪** - 记录学习过程和成果
- 🎨 **生动动画** - 吸引儿童注意力的视觉设计
- 🔊 **语音反馈** - 鼓励和指导儿童学习

### 适用年龄

- 3-4岁：基础数数和简单加法
- 4-5岁：加减法运算
- 5-6岁：进阶数学概念

## 技术架构

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Ant Design Vue** - UI 组件库

### 开发环境
- Node.js 18+
- npm 或 yarn

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
# 开发环境 (端口 8081) - 用于开发和测试
npm run dev
```

访问地址：http://localhost:8081

### 生产构建

```bash
# 生产环境构建
npm run build

# 预览生产构建
npm run preview

# 启动生产服务器
npm run start
```

生产访问地址：http://localhost:3000

## 项目结构

```
bear-math-island/
├── src/
│   ├── components/          # Vue 界面组件
│   ├── stores/              # 状态管理
│   ├── utils/               # 工具函数
│   ├── App.vue              # 根组件
│   ├── main.ts              # TypeScript 入口
│   └── style.css            # 全局样式
├── dist/                   # 生产构建产物
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
├── vite.config.dev.js     # 开发服务器配置
├── DEVELOPMENT.md         # 开发指南
├── DEPLOYMENT.md          # 部署指南
└── README.md              # 项目说明
```

## 开发流程

### 开发阶段
1. 在开发服务器 (8081端口) 进行开发
2. 完成功能后进行测试
3. 提交代码到版本控制系统

### 部署阶段
1. 执行生产构建
2. 部署到生产服务器 (3000端口)
3. 进行生产环境测试

## 贡献指南

欢迎对项目进行改进和优化！

### 代码规范
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 3 最佳实践

### 提交规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 分支管理
- `main` - 生产环境分支
- `develop` - 开发分支
- `feature/` - 功能开发分支

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱：[请添加邮箱]
- GitHub：[项目仓库地址]

---

**© 2024 Bear Math Island. 保留所有权利。**
