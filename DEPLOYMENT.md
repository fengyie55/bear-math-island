# Bear Math Island - 部署指南

## 开发流程

### 1. 开发环境 (端口 8081)

用于开发和测试，使用热更新：

```bash
# 进入项目目录
cd bear_math_island

# 启动开发服务器 (端口 8081)
npm run dev
```

访问地址：http://localhost:8081

### 2. 生产构建

```bash
# 生产环境构建
npm run build

# 预览生产构建 (端口 3000)
npm run preview
```

### 3. 生产部署

#### 使用 PM2 管理进程 (推荐)

```bash
# 安装 PM2
npm install -g pm2

# 启动生产服务器
pm2 start npm --name "bear-math-island" -- run start

# 查看状态
pm2 status

# 查看日志
pm2 logs bear-math-island

# 设置开机自启动
pm2 startup
pm2 save
```

#### 使用 Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

## 端口配置

| 环境 | 端口 | 用途 |
|------|------|------|
| 开发环境 | 8081 | 开发和测试 |
| 生产环境 | 3000 | 正式运行环境 |

## 构建产物

构建后在 `dist/` 目录中生成生产环境文件：
- HTML 文件
- JavaScript 打包文件
- CSS 样式文件
- 资源文件

## 部署检查清单

### 生产部署前

- [ ] 代码已提交到版本控制系统
- [ ] 开发环境已通过所有测试
- [ ] 已执行生产构建
- [ ] 静态资源已优化
- [ ] 配置文件已更新

### 生产环境检查

- [ ] 服务器资源充足
- [ ] 网络连接稳定
- [ ] 防火墙规则已配置
- [ ] SSL 证书已安装 (如需要 HTTPS)

## 常见问题

### 端口占用

如果端口被占用：

```bash
# 查找占用端口的进程
lsof -ti:3000

# 或
netstat -tuln | grep 3000

# 终止进程
kill -9 <PID>
```

### 构建失败

```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```
