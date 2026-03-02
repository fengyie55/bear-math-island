# Bear Math Island - 开发指南

## 开发流程规范

### 1. 分支管理

```bash
# 主分支 - 生产环境
main

# 开发分支 - 功能开发
develop

# 特性分支 - 具体功能开发
feature/feature-name
```

### 2. 开发流程

1. 从 `develop` 分支创建新的特性分支
2. 开发功能
3. 提交代码到特性分支
4. 发起 Pull Request 到 `develop` 分支
5. 代码审查通过后合并

### 3. 代码规范

#### ESLint 配置

```bash
# 安装 ESLint
npm install --save-dev eslint eslint-plugin-vue @vue/eslint-config-prettier
```

#### 代码格式化

使用 Prettier 进行代码格式化：

```json
// .prettierrc
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 4. 测试规范

#### 单元测试

使用 Vitest 进行单元测试：

```bash
# 安装 Vitest
npm install --save-dev vitest @vue/test-utils
```

#### 测试命令

```bash
# 运行所有测试
npm run test

# 运行并监听
npm run test:watch

# 生成测试报告
npm run test:report
```

## 开发工具

### VS Code 配置

#### 插件推荐

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Prettier - Code formatter
- ESLint

#### 设置

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 项目结构

```
bear_math_island/
├── src/
│   ├── components/          # 可复用组件
│   ├── views/              # 页面组件
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理
│   ├── utils/              # 工具函数
│   ├── api/                # API 接口
│   ├── assets/             # 静态资源
│   ├── styles/             # 全局样式
│   └── main.js             # 入口文件
├── public/                 # 公共资源
├── dist/                   # 生产构建产物
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
├── vite.config.dev.js     # 开发服务器配置
└── DEPLOYMENT.md          # 部署指南
```

## 开发命令

### 启动开发服务器

```bash
# 启动开发服务器 (端口 8081)
npm run dev

# 访问地址
http://localhost:8081
```

### 生产构建

```bash
# 生产环境构建
npm run build

# 预览生产构建
npm run preview

# 生产服务器启动
npm run start
```

## 代码提交规范

### Commit 信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 样式修改
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(quiz): 添加减法运算题目类型

- 新增减法运算组件
- 完善题目生成逻辑
- 添加单元测试

Closes #123
```

## 协作流程

1. 每日站会汇报进度
2. 代码审查流程
3. 测试覆盖要求
4. 发布版本管理

## 安全规范

- 禁止硬编码敏感信息
- 所有 API 请求使用 HTTPS
- 输入验证和防 SQL 注入
- XSS 防护

## 性能优化

- 图片资源优化
- 代码分割
- 懒加载
- 缓存策略
