<div align="center">
  <img src="public/logo.png" alt="KatelyaTV Logo" width="128" />

  <h1>KatelyaTV</h1>
  <p><strong>跨平台 · 聚合搜索 · 即开即用 · 自托管影视聚合播放器</strong></p>
  <p>基于 <code>Next.js 14</code> · <code>TypeScript</code> · <code>Tailwind CSS</code> · 多源聚合 / 播放记录 / 收藏同步 / 跳过片头片尾 / PWA</p>
  
  <p>
    <a href="#-快速开始">🚀 快速开始</a> ·
    <a href="#-功能特性">✨ 功能特性</a> ·
    <a href="#-部署方案">📋 部署方案</a> ·
    <a href="#-配置说明">⚙️ 配置说明</a>
  </p>
</div>

---

## 📰 项目声明

本项目自「MoonTV」演进而来，为其二创/继承版本，持续维护与改进功能与体验。保留并致谢原作者与社区贡献者。

> **🔔 重要变更**：应用户社区建议，为确保项目长期稳定运行和合规性，内置视频源已移除。现需要用户自行配置资源站以使用完整功能。我们提供了经过测试的推荐配置文件，让您快速上手使用。

---

## ✨ 功能特性

### 🎬 核心功能

- **🔍 聚合搜索**：整合多个影视资源站，一键搜索全网内容
- **📺 高清播放**：基于 ArtPlayer 的强大播放器，支持多种格式
- **⏭️ 智能跳过**：自动检测并跳过片头片尾，手动设置跳过时间段
- **🎯 断点续播**：自动记录播放进度，跨设备同步观看位置
- **📱 响应式设计**：完美适配手机、平板、电脑各种屏幕

### 💾 数据管理

- **⭐ 收藏功能**：收藏喜欢的影视作品，支持跨设备同步
- **📖 播放历史**：自动记录观看历史，快速找回看过的内容
- **👥 多用户支持**：独立的用户系统，每个用户独享个人数据
- **🔄 数据同步**：支持多种存储后端（LocalStorage、Redis、D1、Upstash）
- **🔒 内容过滤**：智能成人内容过滤系统，默认开启安全保护

### 🚀 部署特性

- **🐳 Docker 一键部署**：提供完整的 Docker 镜像，开箱即用
- **☁️ 多平台支持**：Vercel、Docker、Cloudflare Pages 全兼容
- **🔧 灵活配置**：支持自定义资源站、代理设置、主题配置
- **📱 PWA 支持**：可安装为桌面/手机应用
- **📺 TVBox 兼容**：支持 TVBox 配置接口

---

## 🚀 快速开始

### 推荐方案选择

| 用户类型    | 推荐方案         | 特点                 |
| ----------- | ---------------- | -------------------- |
| 🆕 新手用户 | Docker 单容器    | 最简单，5 分钟部署   |
| 👥 多人使用 | Vercel + Upstash | 免费，支持多用户     |
| 🏠 自托管   | Docker + Redis   | 功能完整，数据可控   |
| 🏢 生产环境 | Docker + Kvrocks | 高可靠性，零丢失风险 |

---

## 📋 部署方案

### 方案一：Docker 单容器（推荐新手）

**适合场景**：个人使用，最简单的部署方式

```bash
# 一键启动
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest

# 访问 http://localhost:3000
```

**自定义配置文件（可选）**：

```bash
# 挂载配置文件
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  -v ./config.json:/app/config.json:ro \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

### 方案二：Docker + Redis（多用户推荐）

**适合场景**：家庭/团队使用，支持多用户和数据同步

```bash
# 下载配置文件
curl -O https://raw.githubusercontent.com/katelya77/KatelyaTV/main/docker-compose.redis.yml
curl -O https://raw.githubusercontent.com/katelya77/KatelyaTV/main/.env.redis.example
cp .env.redis.example .env

# 编辑环境变量
nano .env

# 启动服务
docker compose -f docker-compose.redis.yml up -d
```

**重要环境变量配置**：

```bash
# 存储类型
NEXT_PUBLIC_STORAGE_TYPE=redis

# 管理员账号
USERNAME=admin
PASSWORD=your_admin_password

# Redis配置
REDIS_URL=redis://katelyatv-redis:6379

# 开启用户注册
NEXT_PUBLIC_ENABLE_REGISTER=true
```

### 方案三：Docker + Kvrocks（高可靠性）

**适合场景**：生产环境，需要极高的数据可靠性

```bash
# 下载配置文件
curl -O https://raw.githubusercontent.com/katelya77/KatelyaTV/main/docker-compose.kvrocks.yml
curl -O https://raw.githubusercontent.com/katelya77/KatelyaTV/main/.env.kvrocks.example
cp .env.kvrocks.example .env

# 编辑环境变量
nano .env

# 启动服务（无密码版本）
docker compose -f docker-compose.kvrocks.yml up -d

# 如需密码认证版本，使用：
# docker compose -f docker-compose.kvrocks.auth.yml up -d
```

**重要环境变量配置**：

```bash
# 存储类型
NEXT_PUBLIC_STORAGE_TYPE=kvrocks

# 管理员账号（必填）
USERNAME=admin
PASSWORD=your_admin_password

# Kvrocks配置
KVROCKS_URL=redis://kvrocks:6666
# 密码配置（可选）
# KVROCKS_PASSWORD=your_kvrocks_password

# 开启用户注册
NEXT_PUBLIC_ENABLE_REGISTER=true
```

**Kvrocks 优势**：

- 🛡️ **极高可靠性**：基于 RocksDB，数据持久化到磁盘
- ⚡ **性能优异**：完全兼容 Redis 协议，性能更佳
- 💾 **节省内存**：数据存储在磁盘，内存使用量大幅降低

> 详细部署指南请查看：[Kvrocks 部署文档](docs/KVROCKS_DEPLOYMENT.md)

### 方案四：Vercel + Upstash（免费推荐）

**适合场景**：无服务器，免费部署，支持多用户

#### 基础部署（仅密码保护）

1. **Fork 仓库**：

   - 访问 [KatelyaTV](https://github.com/katelya77/KatelyaTV)
   - 点击右上角 `Fork` 按钮，将项目 Fork 到你的 GitHub 账号

2. **部署到 Vercel**：
   - 登录 [Vercel](https://vercel.com/)（推荐使用 GitHub 账号登录）
   - 点击 `New Project`，选择刚才 Fork 的 `KatelyaTV` 仓库
   - 在 `Environment Variables` 部分添加：
     ```
     PASSWORD=your_password
     ```
   - 点击 `Deploy` 开始部署
   - 等待 2-3 分钟部署完成，获得访问链接

#### 高级配置（多用户支持）

3. **创建 Upstash Redis 数据库**：

   - 访问 [Upstash](https://upstash.com/)，使用 GitHub 账号登录
   - 点击 `Create Database`，选择免费的区域（推荐选择离你最近的区域）
   - 记录数据库的 `UPSTASH_REDIS_REST_URL` 和 `UPSTASH_REDIS_REST_TOKEN`

4. **在 Vercel 中添加环境变量**：

   - 进入 Vercel 项目设置页面
   - 在 `Environment Variables` 添加以下变量：

   ```bash
   # 存储配置
   NEXT_PUBLIC_STORAGE_TYPE=upstash
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token

   # 管理员账号
   USERNAME=admin
   PASSWORD=admin_password

   # 用户注册
   NEXT_PUBLIC_ENABLE_REGISTER=true

   # 站点配置
   NEXT_PUBLIC_SITE_NAME=KatelyaTV
   NEXT_PUBLIC_SITE_DESCRIPTION=高性能影视播放平台
   ```

5. **重新部署**：
   - 在 Vercel 项目页面点击 `Deployments` 标签
   - 点击最新部署旁的三点菜单，选择 `Redeploy`

### 方案五：Cloudflare Pages + D1（全球 CDN 加速）

**适合场景**：全球访问，免费 CDN，无限带宽，支持多用户

#### 方法一：网页操作部署（推荐新手）

1. **准备代码仓库**：

   - Fork [KatelyaTV](https://github.com/katelya77/KatelyaTV) 到你的 GitHub 账号

2. **创建 Cloudflare Pages 项目**：

   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 左侧菜单选择 `Workers and Pages` → `Create application` → `Pages` → `Connect to Git`

3. **连接仓库并配置**：

   - 选择 Fork 的 `KatelyaTV` 仓库，分支选择 `main`
   - **构建设置**：
     ```
     Build command: pnpm install --frozen-lockfile && pnpm run pages:build
     Build output directory: .vercel/output/static
     ```
   - **兼容性标志**：添加 `nodejs_compat`

4. **环境变量配置**：

   ```bash
   PASSWORD=your_password   #在这设置密码
   USERNAME=admin           #在这设置管理员用户名
   NEXT_PUBLIC_STORAGE_TYPE=d1
   NEXT_PUBLIC_ENABLE_REGISTER=true   #用户注册功能
   ```

5. **创建 D1 数据库**（多用户支持）：
   ```bash
   wrangler d1 create katelyatv-db
   wrangler d1 execute katelyatv-db --file=./scripts/d1-init.sql
   ```
   在 `wrangler.toml` 中配置数据库 ID

#### 方法二：命令行部署

```bash
# 安装 CLI 并登录
npm install -g wrangler
wrangler login

# 克隆并部署
git clone https://github.com/your-username/KatelyaTV.git
cd KatelyaTV
pnpm install
pnpm run pages:build
wrangler pages deploy .vercel/output/static --project-name katelyatv
```

### 方案六：Netlify 部署（备选方案）

**适合场景**：GitHub 集成，自动部署，免费额度充足

1. **准备仓库**：

   - Fork [KatelyaTV](https://github.com/katelya77/KatelyaTV) 到你的 GitHub

2. **部署到 Netlify**：

   - 登录 [Netlify](https://app.netlify.com/)
   - 点击 `New site from Git`
   - 选择 GitHub 并授权访问
   - 选择 KatelyaTV 仓库

3. **配置构建设置**：

   ```
   Build command: pnpm run build
   Publish directory: .next
   ```

4. **添加环境变量**：

   - 在站点设置中找到 `Environment variables`
   - 添加：

   ```bash
   PASSWORD=your_password
   NEXT_PUBLIC_STORAGE_TYPE=localstorage
   ```

5. **部署完成**：
   - 获得 `xxx.netlify.app` 访问链接
   - 可以在设置中配置自定义域名

---

## 📝 部署注意事项

### 🚀 性能优化建议

**Cloudflare Pages 优化**：

- 启用 Brotli 压缩：在 Cloudflare Dashboard 的 Speed 标签中启用
- 配置缓存规则：静态资源缓存 30 天，API 缓存 5 分钟
- 开启 Auto Minify：JS、CSS、HTML 自动压缩

**Vercel 优化**：

- 使用 Edge Functions 替代 Serverless Functions
- 配置合理的缓存头：`Cache-Control: public, max-age=3600`
- 启用分析面板监控性能

**Docker 优化**：

- 使用多阶段构建减小镜像体积
- 配置健康检查：`HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000 || exit 1`
- 设置合理的内存限制：`--memory=512m`

### 🔧 常见问题排除

**🚨 Docker + Kvrocks 登录失败（重要修复）**：

**症状**: 部署成功但登录时提示"账号或密码错误"，Kvrocks 中 admin_config 存在但 Users 数组为空

**原因**: 环境变量配置不完整，缺少 USERNAME 导致无法创建管理员用户

**解决方案**:

```bash
# 1. 确保 .env 文件包含必要的管理员配置
cat > .env << EOF
USERNAME=admin
PASSWORD=your_secure_password
NEXT_PUBLIC_STORAGE_TYPE=kvrocks
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_REGISTER=true
EOF

# 2. 重启服务以应用新配置
docker compose -f docker-compose.kvrocks.yml down
docker compose -f docker-compose.kvrocks.yml up -d

# 3. 检查日志确认配置初始化
docker compose logs katelyatv

# 4. 验证Kvrocks中的用户配置
docker exec -it $(docker compose ps -q kvrocks) redis-cli
127.0.0.1:6666> GET admin_config
# 应该看到 Users 数组包含管理员用户
```

**构建失败**：

```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 清理缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 检查环境变量配置
echo $PASSWORD
```

**视频播放问题**：

- 检查 config.json 格式是否正确
- 确认视频源 API 地址可访问
- 查看浏览器控制台错误信息

**数据库连接失败**：

```bash
# Redis 连接测试
redis-cli -u $REDIS_URL ping

# D1 数据库状态检查
wrangler d1 info your-database-name

# Upstash 连接测试
curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" \
     $UPSTASH_REDIS_REST_URL/ping
```

**内存溢出**：

- 调整 Node.js 内存限制：`NODE_OPTIONS="--max-old-space-size=1024"`
- Docker 增加内存分配：`--memory=1g`
- 优化视频缓存策略

### 🔒 安全配置

**生产环境必配**：

```bash
# 强密码策略
PASSWORD="$(openssl rand -base64 32)"

# HTTPS 强制重定向
FORCE_HTTPS=true

# 跨域配置
CORS_ORIGIN="https://your-domain.com"

# 限制管理员访问
ADMIN_IP_WHITELIST="192.168.1.0/24,10.0.0.0/8"
```

**防护措施**：

- 启用 DDoS 防护（Cloudflare 免费提供）
- 配置 CSP 内容安全策略
- 定期更新依赖包：`pnpm update`
- 监控异常访问日志

### 💾 数据备份

**定期备份策略**：

```bash
# Redis 数据备份
redis-cli -u $REDIS_URL --rdb backup.rdb

# D1 数据库备份
wrangler d1 export your-db-name --output=backup-$(date +%Y%m%d).sql

# 配置文件备份
cp config.json config-backup-$(date +%Y%m%d).json

# 自动化备份脚本
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p backups/$DATE
# 备份逻辑...
```

### 📊 监控和日志

**性能监控**：

- Vercel Analytics：自动启用
- Cloudflare Analytics：在 Dashboard 查看
- 自定义监控：集成 Sentry 或类似服务

**日志分析**：

```bash
# Docker 容器日志
docker logs katelyatv-container -f

# Vercel 函数日志
vercel logs your-project

# Cloudflare 实时日志
wrangler tail --format=pretty
```

---

## ⚙️ 配置说明

### 🔧 环境变量详解

| 变量名                         | 说明                  | 默认值       | 示例值                   |
| ------------------------------ | --------------------- | ------------ | ------------------------ |
| `PASSWORD`                     | 访问密码（必填）      | 无           | `mySecretPass123`        |
| `USERNAME`                     | 管理员用户名          | 无           | `admin`                  |
| `NEXT_PUBLIC_SITE_NAME`        | 站点显示名称          | KatelyaTV    | `我的影视站`             |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | 站点描述              | 高性能...    | `专业的在线影视平台`     |
| `NEXT_PUBLIC_STORAGE_TYPE`     | 数据存储方式          | localstorage | `redis/d1/upstash`       |
| `REDIS_URL`                    | Redis 连接字符串      | 无           | `redis://localhost:6379` |
| `UPSTASH_REDIS_REST_URL`       | Upstash REST API 地址 | 无           | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN`     | Upstash 访问令牌      | 无           | `AX_xxx`                 |
| `NEXT_PUBLIC_ENABLE_REGISTER`  | 是否允许用户注册      | false        | `true/false`             |
| `ENABLE_ANALYTICS`             | 启用访问统计          | false        | `true/false`             |
| `CORS_ORIGIN`                  | 允许的跨域来源        | \*           | `https://example.com`    |

### 🎨 自定义主题

**颜色配置**：

```css
/* 在 src/styles/colors.css 中自定义 */
:root {
  --primary-color: #3b82f6; /* 主色调 */
  --secondary-color: #64748b; /* 次要颜色 */
  --background-color: #0f172a; /* 背景色 */
  --text-color: #e2e8f0; /* 文字颜色 */
}
```

**Logo 替换**：

- 替换 `public/logo.png`（推荐尺寸：200x60px）
- 更新 `public/favicon.ico`
- 修改 `public/manifest.json` 中的图标路径

### 📁 视频源配置详解

#### 推荐配置源

1. **基础版配置**：

   - 包含 20+ 优质片源
   - 下载：[config.json](https://www.mediafire.com/file/xl3yo7la2ci378w/config.json/file)
   - 适合个人使用

2. **增强版配置**：
   - 包含 94 个精选片源
   - 下载：[configplus.json](https://www.mediafire.com/file/fbpk1mlupxp3u3v/configplus.json/file)
   - 重命名为 config.json 使用

#### 配置方式说明

**Docker 部署**：

```bash
# 方法1：挂载本地配置文件
docker run -d \
  -v ./config.json:/app/config.json:ro \
  -p 3000:3000 \
  ghcr.io/katelya77/katelyatv:latest

# 方法2：环境变量传入
docker run -d \
  -e CONFIG_JSON='{"cache_time":7200,"api_site":{...}}' \
  -p 3000:3000 \
  ghcr.io/katelya77/katelyatv:latest
```

**Vercel 部署**：

1. 将配置内容复制到仓库的 `config.json` 文件中
2. 提交并推送到 GitHub
3. Vercel 会自动重新部署

**Cloudflare Pages**：

1. 编辑仓库的 `config.json` 文件
2. 推送更改触发自动部署
3. 或在管理员界面 `/admin` 上传配置

**管理员界面配置**：

1. 访问 `https://你的域名/admin`
2. 使用管理员账号登录
3. 在「配置管理」中导入或编辑 JSON 配置
4. 实时生效，无需重启

#### 手动配置格式

```json
{
  "cache_time": 7200,
  "api_site": {
    "resource1": {
      "api": "https://api.example1.com/provide/vod",
      "name": "优质资源站1",
      "detail": "https://example1.com",
      "type": 1,
      "playMode": "parse"
    },
    "resource2": {
      "api": "https://api.example2.com/provide/vod",
      "name": "高清资源站2",
      "detail": "https://example2.com",
      "type": 2,
      "playMode": "direct"
    }
  }
}
```

**字段说明**：

- `cache_time`：缓存时间（秒）
- `api`：资源站 API 接口地址
- `name`：资源站显示名称
- `detail`：资源站主页地址
- `type`：资源类型（1=电影电视，2=直播等）
- `playMode`：播放模式（parse=解析播放，direct=直接播放）

---

## 📱 高级功能使用指南

### 🔒 成人内容过滤

**功能介绍**：

- 智能识别和过滤成人内容资源站
- 用户可自主选择开启或关闭过滤功能
- 默认开启过滤，确保安全浏览体验
- 支持资源分组显示，避免误触

**⚠️ 重要部署要求**：

成人内容过滤功能需要服务器端存储支持，**不能使用 `localstorage` 存储类型**。

| 部署平台         | 推荐存储类型        | 配置要求                  |
| ---------------- | ------------------- | ------------------------- |
| Docker           | `redis` / `kvrocks` | 配置 Redis/Kvrocks 服务器 |
| Vercel           | `upstash`           | 配置 Upstash Redis        |
| Cloudflare Pages | `d1`                | 配置 D1 数据库            |

**Cloudflare Pages 特殊配置**：

如果你使用 Cloudflare Pages 部署，**必须配置 D1 数据库**才能使用成人内容过滤功能：

1. **创建 D1 数据库**：

   ```bash
   wrangler d1 create katelyatv-db
   ```

2. **初始化数据库表**：

   ```bash
   wrangler d1 execute katelyatv-db --file=./scripts/d1-init.sql
   ```

3. **配置环境变量**：

   ```bash
   NEXT_PUBLIC_STORAGE_TYPE=d1
   ```

4. **更新 wrangler.toml**：
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "katelyatv-db"
   database_id = "your-d1-database-id"
   ```

**故障排除**：

- ❌ **错误**："获取用户设置失败"

  - **原因**：使用了 `localstorage` 存储类型，服务器端 API 无法访问
  - **解决**：按上述要求配置数据库存储

- ❌ **错误**：过滤开关无法保存
  - **原因**：存储后端未正确配置或连接失败
  - **解决**：检查数据库连接和环境变量配置

**使用方法**：

1. **访问用户设置**：

   - 登录后访问 `/settings` 页面
   - 或在用户菜单中点击「内容过滤」

2. **配置过滤选项**：

   - 在「内容过滤」部分找到「成人内容过滤」开关
   - **开启**：完全隐藏成人内容资源站和搜索结果
   - **关闭**：成人内容在搜索结果中单独分组显示

3. **搜索结果展示**：
   - **过滤开启时**：只显示常规内容
   - **过滤关闭时**：显示两个标签页「常规结果」和「成人内容」

**配置文件格式**：

```json
// config.json 中的资源站配置
{
  "api_site": {
    "regular_site": {
      "api": "https://example.com/api.php/provide/vod",
      "name": "常规影视站",
      "is_adult": false // 或省略此字段，默认为 false
    },
    "adult_site": {
      "api": "https://adult.example.com/api.php/provide/vod",
      "name": "成人内容站",
      "is_adult": true // 标记为成人内容
    }
  }
}
```

**安全提示**：

- 默认情况下，所有新用户和未登录用户的成人内容过滤均为开启状态
- 关闭过滤功能需要用户主动操作，确保使用意图明确
- 建议管理员在配置资源站时准确标记 `is_adult` 字段

**详细配置指南**：

- 📖 [Cloudflare Pages 成人内容过滤配置指南](./CLOUDFLARE_PAGES_ADULT_FILTER.md)
- 🗄️ [D1 数据库迁移说明](./D1_MIGRATION.md)

### 🎯 跳过片头片尾

**功能介绍**：

- 自动识别并跳过片头片尾
- 支持手动设置跳过时间点
- 多设备同步跳过记录（需配置数据库）

**使用方法**：

1. 播放视频时点击「设置」按钮
2. 选择「跳过片段设置」
3. 设置片头结束时间和片尾开始时间
4. 下次播放自动跳过

**批量设置**：

```json
// 在管理员界面批量导入跳过配置
{
  "skip_settings": {
    "电视剧名称": {
      "intro_end": 90, // 片头结束时间（秒）
      "outro_start": 2700 // 片尾开始时间（秒）
    }
  }
}
```

### 📺 TVBox 兼容模式

**配置地址生成**：

- JSON 格式：`https://你的域名/api/tvbox?format=json`
- TXT 格式：`https://你的域名/api/tvbox?format=txt`
- XML 格式：`https://你的域名/api/tvbox?format=xml`

**支持的 TVBox 应用**：

- TVBox（开源版）
- CatVodTVOfficial
- EasyBox
- FongMi TV
- 其他兼容应用

**配置导入步骤**：

1. 打开 TVBox 应用
2. 进入「配置」或「设置」页面
3. 选择「导入配置」或「添加配置」
4. 输入上述配置地址
5. 等待导入完成

### 🔄 多设备数据同步

**支持的数据**：

- 观看历史记录
- 收藏夹内容
- 跳过片段设置
- 用户偏好配置

**同步方式对比**：

| 存储方式     | 同步范围 | 配置难度   | 免费程度   |
| ------------ | -------- | ---------- | ---------- |
| LocalStorage | 单设备   | 无需配置   | 完全免费   |
| Redis        | 全同步   | 需要服务器 | 自建免费   |
| Upstash      | 全同步   | 简单配置   | 有免费额度 |
| D1           | 全同步   | 中等难度   | 完全免费   |
| Kvrocks      | 全同步   | 需要部署   | 自建免费   |

### 🎨 界面自定义

**主题切换**：

- 支持深色/浅色主题自动切换
- 跟随系统主题设置
- 手动切换并记忆偏好

**界面布局**：

- 响应式设计，适配手机/平板/桌面
- 可调节视频播放器大小
- 隐藏/显示侧边栏
- 自定义首页展示内容

**个性化设置**：

```json
// 在用户设置中自定义
{
  "ui_preferences": {
    "theme": "dark", // 主题：dark/light/auto
    "layout": "grid", // 布局：grid/list
    "items_per_page": 24, // 每页显示数量
    "auto_play": true, // 自动播放下一集
    "video_quality": "auto", // 默认清晰度
    "subtitle_language": "zh-cn" // 字幕语言偏好
  }
}
```

### 📊 数据统计分析

**管理员面板功能**：

- 访问量统计图表
- 热门内容排行榜
- 用户活跃度分析
- 系统性能监控

**访问数据**：

```bash
# 通过管理员界面查看或API获取
GET /api/admin/analytics
{
  "daily_visits": 1250,
  "total_users": 89,
  "popular_content": [
    {"title": "热门电影", "views": 456},
    {"title": "热播剧集", "views": 321}
  ]
}
```

- 下载：[configplus.json](https://www.mediafire.com/file/fbpk1mlupxp3u3v/configplus.json/file)
- 重命名为 config.json 使用

1. 下载配置文件：

   - [基础版 config.json](https://www.mediafire.com/file/xl3yo7la2ci378w/config.json/file)
   - [Plus 版（94 个片源）](https://www.mediafire.com/file/fbpk1mlupxp3u3v/configplus.json/file)

2. 配置方式：
   - **Docker**：挂载配置文件 `-v ./config.json:/app/config.json:ro`
   - **Vercel**：替换仓库中的 `config.json` 文件内容
   - **管理员界面**：登录后台 `/admin` 导入配置

#### 方法二：手动配置

编辑 `config.json` 文件：

```json
{
  "cache_time": 7200,
  "api_site": {
    "example": {
      "api": "https://example.com/api.php/provide/vod",
      "name": "示例资源站",
      "detail": "https://example.com"
    }
  }
}
```

---

## 📱 高级功能

### TVBox 兼容

支持 TVBox 配置接口，可以将视频源导入到各种电视盒子应用：

- **配置地址**：`https://your-domain.com/api/tvbox?format=json`
- **详细说明**：查看 [TVBox 配置指南](docs/TVBOX.md)

### 跳过片头片尾

智能跳过片头片尾功能：

- 🎯 自动检测已设置的跳过片段
- ⚙️ 手动设置跳过时间段（精确到秒）
- 🔄 支持多设备同步（需配置 Redis/D1/Upstash）

### AndroidTV 支持

配合 [OrionTV](https://github.com/zimplexing/OrionTV) 在 Android TV 上使用：

1. 在 OrionTV 中填入 KatelyaTV 部署地址
2. 输入设置的 PASSWORD
3. 即可在电视上观看

---

## 🛠️ 管理与维护

### 升级更新

### 🔄 升级更新

**自动更新检测**：

- 网站会自动检测新版本
- 在管理员界面查看更新状态
- 支持一键更新提醒

**手动更新步骤**：

**Docker 更新**：

```bash
# 停止并更新服务
docker compose pull
docker compose up -d

# 查看运行状态
docker compose ps

# 查看更新日志
docker compose logs -f katelyatv
```

**Git 部署更新**：

```bash
# 备份当前配置
cp config.json config.json.backup

# 拉取最新代码
git pull origin main

# 安装新依赖
pnpm install

# 重新构建
pnpm run build

# 恢复配置文件
cp config.json.backup config.json

# 重启服务
pm2 restart katelyatv
```

**Vercel/Cloudflare 更新**：

- Fork 的仓库会自动接收上游更新提醒
- 在 GitHub 中点击 `Sync fork` 同步更新
- 平台会自动重新部署

### 💾 数据备份与恢复

**备份脚本示例**：

```bash
#!/bin/bash
# backup.sh - 完整备份脚本
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$DATE"
mkdir -p $BACKUP_DIR

echo "开始备份 KatelyaTV 数据..."

# 备份配置文件
cp config.json $BACKUP_DIR/config.json
echo "✓ 配置文件备份完成"

# 根据存储类型备份数据
if [ -f .env ] && grep -q "REDIS_URL" .env; then
    # Redis 数据备份
    docker compose exec redis redis-cli --rdb $BACKUP_DIR/dump.rdb
    echo "✓ Redis 数据备份完成"
elif [ -f .env ] && grep -q "UPSTASH" .env; then
    # Upstash 数据导出
    echo "Upstash 数据需手动在控制台导出"
fi

# Kvrocks 数据备份
if docker compose ps | grep -q kvrocks; then
    docker run --rm \
        -v katelyatv_kvrocks-data:/data:ro \
        -v $(pwd)/$BACKUP_DIR:/backup \
        alpine tar czf /backup/kvrocks-data.tar.gz /data
    echo "✓ Kvrocks 数据备份完成"
fi

# 压缩备份文件
tar -czf "katelyatv-backup-$DATE.tar.gz" -C backups $DATE
rm -rf $BACKUP_DIR

echo "✓ 备份完成: katelyatv-backup-$DATE.tar.gz"
```

**恢复数据**：

```bash
#!/bin/bash
# restore.sh - 数据恢复脚本
BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "用法: $0 <backup-file.tar.gz>"
    exit 1
fi

echo "恢复数据从: $BACKUP_FILE"
tar -xzf $BACKUP_FILE

# 恢复配置文件
BACKUP_DIR=$(tar -tzf $BACKUP_FILE | head -1 | cut -f1 -d"/")
cp $BACKUP_DIR/config.json ./config.json

# 恢复数据库
if [ -f "$BACKUP_DIR/dump.rdb" ]; then
    docker compose exec redis redis-cli FLUSHALL
    docker cp $BACKUP_DIR/dump.rdb redis:/data/dump.rdb
    docker compose restart redis
fi

echo "✓ 数据恢复完成"
```

### 🔍 故障诊断指南

**常见问题快速排查**：

| 问题症状       | 可能原因                | 解决方案                        |
| -------------- | ----------------------- | ------------------------------- |
| 无法访问网站   | 端口未开放/服务未启动   | 检查防火墙和服务状态            |
| 视频无法播放   | 配置文件错误/源失效     | 验证 config.json 格式和源可用性 |
| 登录失败       | 密码错误/环境变量未设置 | 检查 PASSWORD 环境变量          |
| 数据库连接失败 | 连接信息错误/服务未启动 | 验证连接字符串和服务状态        |
| 页面加载缓慢   | 内存不足/缓存失效       | 重启服务或清理缓存              |

**诊断命令**：

```bash
# 系统状态检查
docker compose ps
docker compose logs --tail=50

# 网络连通性测试
curl -I http://localhost:3000
wget --spider http://localhost:3000

# 数据库连接测试
# Redis
redis-cli -u $REDIS_URL ping
# 或者
docker compose exec redis redis-cli ping

# 配置文件验证
cat config.json | jq '.'
# 如果没有 jq，可以用 python
python -m json.tool config.json

# 端口占用检查
netstat -tlnp | grep 3000
ss -tlnp | grep 3000
```

### 📊 性能监控与优化

**监控指标**：

```bash
# 实时系统监控脚本
#!/bin/bash
# monitor.sh
while true; do
    echo "=== $(date) ==="

    # Docker 容器状态
    echo "容器资源使用:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

    # 系统负载
    echo -e "\n系统负载:"
    uptime

    # 磁盘使用
    echo -e "\n磁盘使用:"
    df -h / | tail -1

    # 内存使用
    echo -e "\n内存使用:"
    free -h | head -2

    echo "================================"
    sleep 30
done
```

**性能优化建议**：

1. **内存优化**：

   ```bash
   # Node.js 内存限制
   export NODE_OPTIONS="--max-old-space-size=1024"

   # Docker 内存限制
   docker run --memory=1g --memory-swap=1.5g ...
   ```

2. **缓存优化**：

   ```json
   // config.json 中增加缓存时间
   {
     "cache_time": 21600, // 6小时缓存
     "api_cache_time": 3600 // API缓存1小时
   }
   ```

3. **网络优化**：
   - 使用 CDN 加速静态资源
   - 启用 Gzip/Brotli 压缩
   - 配置适当的缓存头

### 🚨 安全加固

**生产环境安全检查清单**：

- [ ] 设置强密码策略（至少 12 位包含特殊字符）
- [ ] 启用 HTTPS（使用 Let's Encrypt 或 Cloudflare）
- [ ] 配置防火墙规则（仅开放必要端口）
- [ ] 定期更新系统和依赖包
- [ ] 设置访问日志监控
- [ ] 配置自动备份策略
- [ ] 限制管理员界面访问（IP 白名单）
- [ ] 启用 fail2ban 防止暴力破解

**安全配置示例**：

```bash
# nginx 配置增强安全性
# /etc/nginx/sites-available/katelyatv
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # 限制请求大小
    client_max_body_size 10M;

    # 速率限制
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;

    location /api/ {
        limit_req zone=api burst=5 nodelay;
        proxy_pass http://localhost:3000;
    }

    location /admin {
        # 仅允许特定IP访问管理界面
        allow 192.168.1.0/24;
        deny all;
        proxy_pass http://localhost:3000;
    }
}
```

---

## 📚 扩展文档

### 📖 详细指南

**部署相关**：

- [🐳 Docker 完整部署指南](DOCKER_DEPLOYMENT.md)
- [☁️ Cloudflare Pages 详细配置](CLOUDFLARE_PAGES.md)
- [🚀 Vercel 部署最佳实践](VERCEL_DEPLOYMENT.md)
- [🔧 环境变量完整说明](ENVIRONMENT_VARIABLES.md)

**功能配置**：

- [📺 TVBox 兼容配置指南](docs/TVBOX.md)
- [💾 Kvrocks 高性能部署](docs/KVROCKS.md)
- [🗄️ D1 数据库迁移指南](D1_MIGRATION.md)
- [⚡ Redis 集群配置](REDIS_CLUSTER.md)

**故障排除**：

- [🔧 Docker 故障排除手册](DOCKER_TROUBLESHOOTING.md)
- [🌐 网络连接问题诊断](NETWORK_TROUBLESHOOTING.md)
- [⚠️ 兼容性问题解决](DEPLOYMENT_COMPATIBILITY.md)
- [🐛 常见错误代码说明](ERROR_CODES.md)

### 🎯 最佳实践

**新手快速上手路径**：

1. 选择 Vercel + 基础配置（最简单）
2. 升级到 Vercel + Upstash（支持多用户）
3. 进阶到 Docker 自建（完全控制）
4. 终极配置：Kvrocks 集群（高可用）

**生产环境推荐方案**：

- **小型个人站**：Vercel + Upstash
- **中型团队使用**：Docker + Redis Cluster
- **大型服务**：Kubernetes + Kvrocks 集群
- **全球服务**：Cloudflare Pages + D1

### 🔗 相关资源

**官方资源**：

- [📦 GitHub 仓库](https://github.com/katelya77/KatelyaTV)
- [🐳 Docker Hub](https://hub.docker.com/r/katelya77/katelyatv)
- [📊 GitHub Container Registry](https://github.com/katelya77/KatelyaTV/pkgs/container/katelyatv)
- [📋 版本发布页](https://github.com/katelya77/KatelyaTV/releases)

**社区支持**：

- [💬 Discussions 讨论区](https://github.com/katelya77/KatelyaTV/discussions)
- [🐛 Issues 问题反馈](https://github.com/katelya77/KatelyaTV/issues)
- [📖 Wiki 知识库](https://github.com/katelya77/KatelyaTV/wiki)
- [💡 Feature Requests](https://github.com/katelya77/KatelyaTV/issues?q=label%3Aenhancement)

**在线演示**：

- [🎬 官方演示站点](https://katelyatv-demo.pages.dev/) (密码: `demo123`)
- [📱 PWA 功能演示](https://katelyatv-pwa.vercel.app/)
- [🎨 主题预览站点](https://katelyatv-themes.pages.dev/)

### 🤝 参与贡献

**贡献方式**：

- ⭐ 给项目点 Star
- 🐛 报告 Bug 和问题
- 💡 提出新功能建议
- 📝 完善文档和翻译
- 💻 贡献代码和修复

**开发者指南**：

```bash
# 本地开发环境搭建
git clone https://github.com/katelya77/KatelyaTV.git
cd KatelyaTV

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建生产版本
pnpm build

# 代码格式化
pnpm lint --fix
pnpm format
```

---

## 🔒 安全与合规

### 🚨 重要提醒

**强烈建议**：

- ✅ **设置强密码**：避免公开访问，保护个人隐私
- ✅ **个人使用**：请勿公开分享实例链接或商业使用
- ✅ **遵守法律**：确保使用行为符合当地法律法规
- ✅ **版权意识**：尊重内容版权，支持正版

**安全配置**：

- 启用 HTTPS 加密传输
- 设置访问密码和用户认证
- 配置 IP 访问限制
- 定期更新和安全检查

### ⚖️ 免责声明

- 本项目仅供个人学习、研究和合法使用
- 用户需对自己的使用行为承担完全法律责任
- 开发者不对用户的任何违法行为承担责任
- 请确保遵守所在地区的法律法规

---

## 🌟 致谢与支持

### 🙏 特别感谢

感谢以下优秀的开源项目和技术社区：

**核心依赖**：

- [Next.js](https://nextjs.org/) — 强大的 React 全栈框架
- [ArtPlayer](https://github.com/zhw2590582/ArtPlayer) — 功能丰富的 HTML5 视频播放器
- [Tailwind CSS](https://tailwindcss.com/) — 实用优先的 CSS 框架
- [TypeScript](https://www.typescriptlang.org/) — JavaScript 的超集

**基础设施**：

- [Cloudflare](https://cloudflare.com/) — 全球 CDN 和边缘计算
- [Vercel](https://vercel.com/) — 现代化的部署平台
- [Docker](https://docker.com/) — 容器化部署方案
- [Redis](https://redis.io/) — 高性能内存数据库

**项目启发**：

- [LibreTV](https://github.com/LibreSpark/LibreTV) — 提供设计理念
- [LunaTV](https://github.com/MoonTechLab/LunaTV) — 项目基础架构

### 💝 支持项目发展

如果 KatelyaTV 对您有帮助，欢迎通过以下方式支持项目：

**免费支持**：

- ⭐ [GitHub 点 Star](https://github.com/katelya77/KatelyaTV/stargazers)
- 🍴 [Fork 项目](https://github.com/katelya77/KatelyaTV/fork)
- 💬 [参与讨论](https://github.com/katelya77/KatelyaTV/discussions)
- 📖 [完善文档](https://github.com/katelya77/KatelyaTV/tree/main/docs)
- 🔗 [推荐朋友](https://github.com/katelya77/KatelyaTV)

**赞助支持**：

<div align="center">
  <img src="public/wechat.jpg" alt="微信赞赏码" width="200">
  <br>
  <strong>请开发者喝杯咖啡 ☕</strong>
  <p><em>您的支持是项目持续发展的动力</em></p>
</div>

**企业赞助**：
如果您的企业希望赞助 KatelyaTV 项目，请通过 [GitHub Sponsors](https://github.com/sponsors/katelya77) 或发邮件联系我们。

### � 项目统计

[![GitHub stars](https://img.shields.io/github/stars/katelya77/KatelyaTV?style=social)](https://github.com/katelya77/KatelyaTV/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/katelya77/KatelyaTV?style=social)](https://github.com/katelya77/KatelyaTV/network/members)
[![GitHub watchers](https://img.shields.io/github/watchers/katelya77/KatelyaTV?style=social)](https://github.com/katelya77/KatelyaTV/watchers)

[![GitHub release](https://img.shields.io/github/v/release/katelya77/KatelyaTV)](https://github.com/katelya77/KatelyaTV/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/katelya77/katelyatv)](https://hub.docker.com/r/katelya77/katelyatv)
[![GitHub issues](https://img.shields.io/github/issues/katelya77/KatelyaTV)](https://github.com/katelya77/KatelyaTV/issues)
[![GitHub license](https://img.shields.io/github/license/katelya77/KatelyaTV)](https://github.com/katelya77/KatelyaTV/blob/main/LICENSE)

**Star History**：
[![Star History Chart](https://api.star-history.com/svg?repos=katelya77/KatelyaTV&type=Date)](https://star-history.com/#katelya77/KatelyaTV&Date)

---

## 📄 开源协议

本项目基于 **MIT License** 开源协议发布。

```
MIT License

Copyright (c) 2025 KatelyaTV & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">
  <h2>🎉 感谢您选择 KatelyaTV！</h2>
  <p>
    <strong>如果项目对您有帮助，请给个 ⭐ Star 支持一下！</strong>
  </p>
  <p>
    <a href="https://github.com/katelya77/KatelyaTV">🏠 项目首页</a>
    •
    <a href="https://github.com/katelya77/KatelyaTV/issues">🐛 问题反馈</a>
    •
    <a href="https://github.com/katelya77/KatelyaTV/discussions">💬 讨论交流</a>
    •
    <a href="https://github.com/katelya77/KatelyaTV/wiki">📚 使用文档</a>
  </p>
  <br>
  <p>
    <em>❤️ Made with love by KatelyaTV Community ❤️</em>
  </p>
</div>
