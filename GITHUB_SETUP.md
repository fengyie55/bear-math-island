# GitHub 仓库配置指南

## 问题说明

GitHub 已不再支持使用密码进行 Git 操作认证，需要使用个人访问令牌（Personal Access Token, PAT）或 SSH 密钥。

## 方法一：使用个人访问令牌 (PAT) - 推荐

### 步骤 1：创建个人访问令牌

1. 访问 GitHub 设置页面：https://github.com/settings/tokens
2. 点击 "Generate new token" 或 "Generate new token (classic)"
3. 填写描述信息，如 "bear-math-island"
4. 勾选需要的权限：
   - repo (全选) - 用于仓库操作
5. 点击 "Generate token" 生成令牌
6. **重要**：复制生成的令牌，您只会看到它一次！

### 步骤 2：配置 Git 远程仓库

生成令牌后，运行以下命令（将 `YOUR_TOKEN` 替换为实际生成的令牌）：

```bash
cd /home/admin/.openclaw/workspace/bear_math_island
git remote add origin https://fengyie55:YOUR_TOKEN@github.com/fengyie55/bear-math-island.git
git push -u origin master
```

## 方法二：使用 SSH 密钥

### 步骤 1：检查并生成 SSH 密钥

检查是否已有 SSH 密钥：
```bash
cd ~
ls -la ~/.ssh
```

如果没有 `id_rsa` 和 `id_rsa.pub` 文件，生成新密钥：
```bash
ssh-keygen -t rsa -b 4096 -C "fengyie55@hotmail.com"
```
按回车键接受默认位置和密码短语（可选）。

### 步骤 2：添加公钥到 GitHub

1. 复制公钥：
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

2. 访问 GitHub SSH 设置：https://github.com/settings/keys
3. 点击 "New SSH key"
4. 粘贴公钥到 "Key" 字段
5. 填写标题，如 "bear-math-island"
6. 点击 "Add SSH key"

### 步骤 3：配置 Git 远程仓库

使用 SSH 地址配置远程仓库：
```bash
cd /home/admin/.openclaw/workspace/bear_math_island
git remote add origin git@github.com:fengyie55/bear-math-island.git
git push -u origin master
```

## 方法三：在 GitHub 网页上手动创建仓库

### 步骤 1：创建仓库

1. 访问 GitHub 主页：https://github.com/
2. 点击右上角 "+" 号 → "New repository"
3. 仓库名称：`bear-math-island`
4. 描述：`小熊算数岛儿童数学学习应用`
5. 勾选 "Initialize this repository with a README"（可选）
6. 点击 "Create repository"

### 步骤 2：同步本地仓库

仓库创建后，使用 HTTPS 或 SSH 地址同步本地仓库：

**HTTPS 方式：**
```bash
cd /home/admin/.openclaw/workspace/bear_math_island
git remote add origin https://github.com/fengyie55/bear-math-island.git
git push -u origin master
```

**SSH 方式：**
```bash
cd /home/admin/.openclaw/workspace/bear_math_island
git remote add origin git@github.com:fengyie55/bear-math-island.git
git push -u origin master
```

## 常见问题解决

### 1. 远程仓库不存在错误

如果遇到 "remote repository not found" 错误：
```bash
# 检查远程仓库地址
git remote -v

# 删除旧的远程仓库
git remote rm origin

# 重新添加正确的地址
git remote add origin https://github.com/fengyie55/bear-math-island.git
```

### 2. 权限被拒绝错误

如果遇到 "Permission denied (publickey)" 错误：
```bash
# 检查 SSH 密钥是否正确配置
ssh -T git@github.com
```

### 3. 提交历史冲突

如果远程仓库有内容（如 README），需要先合并：
```bash
git pull origin master --allow-unrelated-histories
git push -u origin master
```

## 验证仓库配置

成功配置后，可以验证：

```bash
# 查看远程仓库信息
git remote -v

# 检查分支状态
git status

# 查看提交历史
git log --oneline
```

## 完成后的仓库访问

- **仓库地址：** https://github.com/fengyie55/bear-math-island
- **代码查看：** https://github.com/fengyie55/bear-math-island
- **克隆仓库：** `git clone https://github.com/fengyie55/bear-math-island.git`

## 下一步

配置完成后，您可以：
1. 在 GitHub 上查看代码
2. 邀请合作者
3. 设置分支保护规则
4. 配置 GitHub Pages 或部署方案

---

**注意安全：** 个人访问令牌和 SSH 私钥都是敏感信息，请妥善保管，不要与他人分享。
