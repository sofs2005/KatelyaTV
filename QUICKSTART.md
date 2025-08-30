# 🚀 KatelyaTV 快速开始指南

欢迎使用 KatelyaTV！本指南将帮助您在几分钟内完成部署和配置。

## 📋 前置要求

- **Docker** (推荐) 或 **Node.js 18+**
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)
- 稳定的网络连接

## 🐳 Docker 部署 (推荐)

### 1. 快速启动

```bash
# 拉取最新镜像
docker pull ghcr.io/katelya77/katelyatv:latest

# 启动容器
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

### 2. 访问应用

打开浏览器访问 `http://localhost:3000`，输入密码 `your_password` 即可使用。

### 3. 停止服务

```bash
# 停止容器
docker stop katelyatv

# 删除容器
docker rm katelyatv
```

## 🌐 云平台部署

### Vercel 部署

1. **Fork 项目**
   - 点击 GitHub 仓库右上角的 "Fork" 按钮
   - 等待 Fork 完成

2. **部署到 Vercel**
   - 访问 [Vercel](https://vercel.com/)
   - 点击 "New Project"
   - 选择 Fork 后的仓库
   - 设置环境变量 `PASSWORD=your_password`
   - 点击 "Deploy"

3. **访问应用**
   - 部署完成后，Vercel 会提供一个域名
   - 访问该域名，输入密码即可使用

### Cloudflare Pages 部署

1. **Fork 项目**
   - 同上

2. **部署到 Cloudflare Pages**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 "Workers & Pages"
   - 点击 "Create application" → "Pages"
   - 选择 "Connect to Git"
   - 选择 Fork 后的仓库
   - 构建命令：`pnpm run pages:build`
   - 构建输出目录：`.vercel/output/static`
   - 环境变量：`PASSWORD=your_password`

3. **访问应用**
   - 部署完成后访问提供的域名

## ⚙️ 基础配置

### 环境变量

创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑配置
nano .env.local
```

**必需配置：**
```bash
PASSWORD=your_secure_password
```

**推荐配置：**
```bash
SITE_NAME=我的影视站
NEXT_PUBLIC_STORAGE_TYPE=localstorage
NEXT_PUBLIC_SEARCH_MAX_PAGE=10
```

### 自定义资源站点

编辑 `config.json` 文件：

```json
{
  "cache_time": 7200,
  "api_site": {
    "dyttzy": {
      "api": "http://caiji.dyttzyapi.com/api.php/provide/vod",
      "name": "电影天堂资源",
      "detail": "http://caiji.dyttzyapi.com"
    }
  }
}
```

## 🎯 核心功能使用

### 1. 搜索影视

- 在首页搜索框输入影视名称
- 支持中文、英文、拼音搜索
- 结果来自多个资源站点

### 2. 观看视频

- 点击搜索结果进入详情页
- 选择播放源和剧集
- 支持进度记录和断点续播

### 3. 收藏管理

- 点击心形图标收藏影视
- 在"我的收藏"中查看
- 支持多设备同步

### 4. 观看历史

- 自动记录观看进度
- 在"继续观看"中查看
- 支持从上次位置继续

## 🔧 高级配置

### 多用户支持

如需支持多用户，请配置 Redis 或 D1 存储：

```bash
# Redis 配置
NEXT_PUBLIC_STORAGE_TYPE=redis
REDIS_URL=redis://localhost:6379/0

# 或 D1 配置 (Cloudflare Pages)
NEXT_PUBLIC_STORAGE_TYPE=d1
# 在 Cloudflare Pages 中绑定 D1 数据库
```

### 自定义主题

修改 `src/styles/globals.css` 文件：

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  --background-color: #ffffff;
  --text-color: #1f2937;
}

.dark {
  --background-color: #111827;
  --text-color: #f9fafb;
}
```

### 添加新资源站点

在 `config.json` 中添加：

```json
{
  "api_site": {
    "newsite": {
      "api": "https://newsite.com/api.php/provide/vod",
      "name": "新站点名称"
    }
  }
}
```

## 🚨 常见问题

### Q: 无法访问应用
**A:** 检查端口是否被占用，防火墙设置，或尝试其他端口。

### Q: 搜索无结果
**A:** 检查网络连接，资源站点是否可用，或尝试其他关键词。

### Q: 视频无法播放
**A:** 检查视频源是否有效，浏览器是否支持相关格式。

### Q: 数据丢失
**A:** 如果使用 localStorage，数据存储在浏览器中，清除缓存会丢失数据。

## 📱 移动端使用

- 支持响应式设计
- 可安装为 PWA 应用
- 触摸友好的操作界面

## 🔒 安全建议

1. **设置强密码**：使用复杂密码保护访问
2. **限制访问**：不要公开分享访问链接
3. **定期更新**：保持应用版本最新
4. **监控日志**：关注异常访问记录

## 📞 获取帮助

- 📖 [完整文档](README.md)
- 🐛 问题反馈：在仓库 Issues 页面提交
- 💬 功能讨论：在 Discussions 页面参与
- 📝 [更新日志](CHANGELOG.md)

## 🎉 开始使用

现在您已经完成了基础配置，可以开始享受 KatelyaTV 带来的影视体验了！

**重要提醒：**
- 本项目仅供学习和个人使用
- 请遵守当地法律法规
- 不要用于商业用途或公开服务

---

如有任何问题，欢迎在 GitHub 上提出 Issue 或参与讨论！