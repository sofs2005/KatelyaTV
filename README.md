<div align="center">
 ## 📰 项目来源与声明

本项目自「MoonTV」演进而来，为其二创/继承版本，持续维护与改进功能与体验。保留并致谢原作者与社区贡献者；如有授权或版权问题请联系以处理。目标：在原作基础上提供更易部署、更友好、更稳定的体验。

## ✨ 功能特性

### 🎬 核心播放功能

- **🔍 聚合搜索**：整合多个影视资源站，一键搜索全网内容
- **📺 高清播放**：基于 ArtPlayer 的强大播放器，支持多种格式和画质
- **⏭️ 智能跳过**：自动检测并跳过片头片尾，手动设置跳过时间段
- **🎯 断点续播**：自动记录播放进度，跨设备同步观看位置
- **📱 响应式设计**：完美适配手机、平板、电脑各种屏幕尺寸

### 💾 数据管理

- **⭐ 收藏功能**：收藏喜欢的影视作品，支持跨设备同步
- **📖 播放历史**：自动记录观看历史，快速找回看过的内容
- **👥 多用户支持**：独立的用户系统，每个用户独享个人数据
- **🔄 数据同步**：支持多种存储后端（LocalStorage、Redis、D1、Upstash）

### 🚀 部署与扩展

- **🐳 Docker 一键部署**：提供完整的 Docker 镜像，开箱即用
- **☁️ 多平台支持**：Vercel、Cloudflare Pages、传统服务器全兼容
- **🔧 灵活配置**：支持自定义资源站、代理设置、主题配置
- **📱 PWA 支持**：可安装为桌面/手机应用，离线缓存

### 🎨 用户体验

- **🌓 深色模式**：支持明暗主题切换，护眼舒适
- **⚡ 性能优化**：智能缓存、懒加载、播放源优选算法
- **🔐 隐私保护**：本地部署，数据完全掌控
- **🌍 国际化**：多语言支持（规划中）

## 🚀 部署教程 src="public/logo.png" alt="KatelyaTV Logo" width="128" />

  <h1>KatelyaTV</h1>
  <p><strong>跨平台 · 聚合搜索 · 即开即用 · 自托管影视聚合播放器</strong></p>
  <p>基于 <code>Next.js 14</code> · <code>TypeScript</code> · <code>Tailwind CSS</code> · 多源聚合 / 播放记录 / 收藏同步 / 跳过片头片尾 / PWA</p>
  <p>MoonTV 二创延续版 · 持续维护与增强</p>
  <p>
    <a href="#部署">🚀 部署</a> ·
    <a href="#功能特性">✨ 功能</a> ·
    <a href="#docker">🐳 Docker</a> ·
    <a href="#环境变量">⚙️ 配置</a>
  </p>

| 分类      | 主要依赖                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------- |
| 前端框架  | [Next.js 14](https://nextjs.org/) · App Router                                                        |
| UI & 样式 | [Tailwind&nbsp;CSS 3](https://tailwindcss.com/) · [Framer Motion](https://www.framer.com/motion/)     |
| 语言      | TypeScript 5                                                                                          |
| 播放器    | [ArtPlayer](https://github.com/zhw2590582/ArtPlayer) · [HLS.js](https://github.com/video-dev/hls.js/) |
| 状态管理  | React Hooks · Context API                                                                             |
| 代码质量  | ESLint · Prettier · Jest · Husky                                                                      |
| 部署      | Docker · Vercel · CloudFlare pages                                                                    |

## � 项目来源与声明

本项目自「MoonTV」演进而来，为其二创/继承版本，持续维护与改进功能与体验。保留并致谢原作者与社区贡献者；如有授权或版权问题请联系以处理。目标：在原作基础上提供更易部署、更友好、更稳定的体验。

## 🚀 部署教程

> **💡 推荐方案**：新手优先选择 **Docker 单容器**（最简单），需要多用户再升级到 **Docker + Redis**

<div align="center">

### 📋 部署方式对比

| 方式                  | 难度   | 成本     | 多用户 | 推荐场景            |
| --------------------- | ------ | -------- | ------ | ------------------- |
| 🐳 **Docker 单容器**  | ⭐     | 需服务器 | ❌     | 个人使用，最简单    |
| 🐳 **Docker + Redis** | ⭐⭐   | 需服务器 | ✅     | 家庭/团队，功能完整 |
| ☁️ **Vercel**         | ⭐     | 免费     | ❌     | 临时体验，无服务器  |
| 🌐 **Cloudflare**     | ⭐⭐⭐ | 免费     | ✅     | 技术爱好者          |

</div>

---

## 🎯 方案一：Docker 单容器（推荐新手）

> **适合场景**：个人使用，有服务器/NAS/电脑，想要最简单的部署方式

### 🔧 前置要求

- 一台能联网的设备（服务器/NAS/Windows/Mac/Linux 都行）
- 已安装 Docker（[Docker 官网下载](https://www.docker.com/get-started/)）

### 📝 详细步骤

#### 第一步：拉取镜像

```bash
# 下载最新版本镜像（支持 ARM 和 x86 架构）
docker pull ghcr.io/katelya77/katelyatv:latest
```

#### 第二步：启动容器

```bash
# 一键启动（请把 your_password 改成你的密码）
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

> **Windows 用户注意**：在 PowerShell 中运行上述命令

#### 第三步：访问应用

1. 打开浏览器，访问：`http://你的服务器IP:3000`
2. 如果是本机安装，访问：`http://localhost:3000`
3. 输入你在第二步设置的密码即可进入

#### 第四步：自定义资源站（可选）

如果你有自己的资源站配置，可以挂载 `config.json` 文件：

```bash
# 先停止并删除旧容器
docker stop katelyatv && docker rm katelyatv

# 重新运行并挂载配置文件
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  -v /path/to/your/config.json:/app/config.json:ro \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

> **路径说明**：把 `/path/to/your/config.json` 替换成你的配置文件完整路径  
> **Windows 示例**：`-v C:/Users/你的用户名/Desktop/config.json:/app/config.json:ro`

### 🛠️ 常用管理命令

```bash
# 查看运行状态
docker ps

# 查看日志
docker logs katelyatv

# 重启应用
docker restart katelyatv

# 停止应用
docker stop katelyatv

# 删除容器
docker rm katelyatv
```

---

## 🎯 方案二：Docker + Redis（推荐进阶）

> **适合场景**：多人使用，需要账号系统、观看记录同步、收藏功能

### 🔧 前置要求

- 已完成方案一，确认单容器版本能正常运行
- 了解基本的 Docker Compose 概念

### 📝 详细步骤

#### 第一步：创建配置文件

在你的服务器上创建一个文件夹，比如 `/opt/katelyatv`：

```bash
# 创建目录
mkdir -p /opt/katelyatv
cd /opt/katelyatv

# 创建 docker-compose.yml 文件
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # KatelyaTV 主应用
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    ports:
      - "3000:3000"
    environment:
      # 管理员账号（请修改）
      - USERNAME=admin
      - PASSWORD=your_strong_password
      # 启用 Redis 存储
      - NEXT_PUBLIC_STORAGE_TYPE=redis
      - REDIS_URL=redis://katelyatv-redis:6379
      # 允许用户注册（可选）
      - NEXT_PUBLIC_ENABLE_REGISTER=true
    depends_on:
      katelyatv-redis:
        condition: service_healthy
    restart: unless-stopped
    # 可选：挂载自定义配置
    # volumes:
    #   - ./config.json:/app/config.json:ro

  # Redis 数据库
  katelyatv-redis:
    image: redis:7-alpine
    container_name: katelyatv-redis
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - katelyatv-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    restart: unless-stopped

volumes:
  katelyatv-redis-data:
EOF
```

#### 第二步：修改配置

编辑 `docker-compose.yml` 文件，**必须修改**以下内容：

- `PASSWORD=your_strong_password` 改成你的强密码
- `USERNAME=admin` 可以改成你喜欢的管理员用户名

#### 第三步：启动服务

```bash
# 启动所有服务
docker compose up -d

# 查看启动状态
docker compose ps
```

#### 第四步：验证部署

1. 访问 `http://你的服务器IP:3000`
2. 使用你设置的用户名和密码登录
3. 登录后访问 `http://你的服务器IP:3000/admin` 进入管理后台
4. 在管理后台可以配置资源站、管理用户等

### 🛠️ 管理命令

```bash
# 查看所有服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 重启所有服务
docker compose restart

# 停止所有服务
docker compose down

# 更新到最新版本
docker compose pull
docker compose up -d
```

### 💾 备份数据

```bash
# 备份 Redis 数据
docker run --rm -v katelyatv-redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup-$(date +%Y%m%d).tar.gz /data

# 恢复数据（如果需要）
docker run --rm -v katelyatv-redis-data:/data -v $(pwd):/backup alpine tar xzf /backup/redis-backup-20241201.tar.gz -C /
```

---

## 🎯 方案三：Vercel 部署（免服务器）

> **适合场景**：没有服务器，想要快速体验，个人使用

### 🔧 前置要求

- GitHub 账号
- Vercel 账号（可用 GitHub 登录）

### 📝 详细步骤

#### 第一步：Fork 仓库

1. 打开 [KatelyaTV GitHub 页面](https://github.com/katelya77/KatelyaTV)
2. 点击右上角 **Fork** 按钮
3. 等待 Fork 完成

#### 第二步：部署到 Vercel

1. 访问 [Vercel](https://vercel.com/)，用 GitHub 账号登录
2. 点击 **Add New... → Project**
3. 找到你刚才 Fork 的 `KatelyaTV` 仓库，点击 **Import**
4. 在 **Environment Variables** 部分添加：
   - Key: `PASSWORD`
   - Value: `你的访问密码`（这是进入网站的密码）
5. 点击 **Deploy** 开始部署

#### 第三步：等待部署完成

- 通常需要 2-3 分钟
- 部署成功后会显示域名，比如 `https://your-project.vercel.app`

#### 第四步：访问和使用

1. 点击 Vercel 提供的域名链接
2. 输入你在第二步设置的密码
3. 开始使用！

### 🔧 自定义资源站

如果你想添加自己的资源站：

1. 在你 Fork 的仓库中找到 `config.json` 文件
2. 点击编辑按钮（铅笔图标）
3. 修改配置内容
4. 点击 **Commit changes**
5. Vercel 会自动重新部署

### ⚠️ 注意事项

- Vercel 版本不支持用户注册和账号系统
- 观看记录保存在浏览器本地，换设备会丢失
- 如果需要多用户功能，请考虑 Docker + Redis 方案

---

## 🎯 方案四：Cloudflare Pages（进阶用户）

> **适合场景**：技术爱好者，想要全球 CDN 加速，免费但配置复杂

### 🔧 前置要求

- GitHub 账号
- Cloudflare 账号
- 对前端构建有基本了解

### 📝 详细步骤

#### 第一步：Fork 仓库并连接

1. Fork [KatelyaTV 仓库](https://github.com/katelya77/KatelyaTV)
2. 登录 [Cloudflare](https://cloudflare.com)
3. 进入 **Workers 和 Pages** → 点击 **创建应用程序**
4. 选择 **Pages** → **连接到 Git**
5. 选择你 Fork 的仓库

#### 第二步：配置构建设置

在构建设置页面填写：

- **构建命令**: `npm install && npm run pages:build`
- **构建输出目录**: `.vercel/output/static`
- **Root directory**: `./`（默认）

#### 第三步：设置兼容性

1. 点击 **保存并部署**
2. 等待首次构建完成（可能会失败，没关系）
3. 进入项目 **设置** → **兼容性标志**
4. 添加标志: `nodejs_compat`

#### 第四步：添加环境变量

在 **设置** → **环境变量** 中添加：

- `PASSWORD`: 你的访问密码

#### 第五步：重新部署

1. 进入 **部署** 页面
2. 点击最新部署旁的 **...** → **重试部署**
3. 等待部署成功

### 🗄️ 启用 D1 数据库（可选，支持多用户）

如果你想要用户系统和数据同步：

> ⚠️ **升级提醒**：如果你已有 D1 数据库，需要手动添加新功能表。请查看 [D1_MIGRATION.md](./D1_MIGRATION.md) 文件。

#### 第一步：创建 D1 数据库

1. 在 Cloudflare Dashboard 进入 **存储和数据库** → **D1 SQL 数据库**
2. 点击 **创建数据库**，名称随意（比如 `katelyatv-db`）

#### 第二步：初始化数据库

1. 进入刚创建的数据库
2. 点击 **Explore Data**
3. 打开项目中的 [D1 初始化.md](https://github.com/katelya77/KatelyaTV/blob/main/D1%E5%88%9D%E5%A7%8B%E5%8C%96.md) 文件，复制所有 SQL 语句
4. 粘贴到查询窗口，点击 **Run All**

#### 第三步：绑定数据库

1. 回到 Pages 项目设置
2. 进入 **绑定** → **添加绑定**
3. 选择 **D1 数据库**
4. 变量名: `DB`
5. 选择你刚创建的数据库

#### 第四步：添加环境变量

在环境变量中追加：

- `NEXT_PUBLIC_STORAGE_TYPE`: `d1`
- `USERNAME`: 管理员用户名
- `PASSWORD`: 管理员密码

#### 第五步：重新部署

重新部署后，你就可以：

- 使用管理员账号登录
- 访问 `/admin` 管理后台
- 支持用户注册和数据同步

---

## 🆙 升级和维护

### Docker 升级

```bash
# 单容器版本
docker stop katelyatv
docker rm katelyatv
docker pull ghcr.io/katelya77/katelyatv:latest
# 然后重新运行启动命令

# Compose 版本
docker compose pull
docker compose up -d
```

### Vercel 升级

- 自动升级：当原仓库更新时，你的 Fork 仓库会收到更新提示
- 手动升级：在你的 Fork 仓库点击 **Sync fork** 按钮

### Cloudflare 升级

- 同 Vercel，通过 Git 同步自动触发重新构建

### 🚨 常见问题排查

| 问题            | 现象                       | 解决方法                           |
| --------------- | -------------------------- | ---------------------------------- |
| 无法访问        | 浏览器显示无法连接         | 检查端口 3000 是否开放，防火墙设置 |
| 403 Forbidden   | 显示访问被拒绝             | 检查 PASSWORD 环境变量是否设置正确 |
| Docker 启动失败 | 容器无法启动               | 查看日志 `docker logs katelyatv`   |
| Redis 连接失败  | 无法登录或保存数据         | 检查 Redis 容器是否正常运行        |
| 构建失败        | Vercel/Cloudflare 部署失败 | 查看构建日志，检查环境变量设置     |

需要帮助？可以在 [GitHub Issues](https://github.com/katelya77/KatelyaTV/issues) 提问。

## 🐳 Docker

推荐方式。镜像多架构 (`linux/amd64`,`linux/arm64`)，基于 Alpine，体积小启动快。

### 🚀 快速开始

#### 1. 基础部署（LocalStorage，最快验证）

```bash
# 拉取最新镜像（支持 amd64/arm64 多架构）
docker pull ghcr.io/katelya77/katelyatv:latest

# 快速启动（LocalStorage 存储）
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_secure_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

访问 `http://服务器IP:3000` 即可使用。（需要在服务器控制台开放 3000 端口）

> Windows 本地构建如遇 Node Standalone `EPERM symlink`：优先使用 **Docker 镜像** 或在 **WSL2** 环境构建；无需修改源码。

#### 2. 自定义配置（挂载 config.json）

```bash
# 创建配置文件目录
mkdir -p ./katelyatv-config

# 将你的 config.json 放入该目录，然后运行：
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_secure_password \
  -v ./katelyatv-config/config.json:/app/config.json:ro \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

#### 3. 常用运维命令

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs katelyatv

# 查看实时日志
docker logs -f katelyatv
```

#### 4. 升级镜像

```bash
# 停止并删除旧容器
docker stop katelyatv && docker rm katelyatv

# 拉取最新镜像
docker pull ghcr.io/katelya77/katelyatv:latest

# 重新创建容器（使用相同的配置）
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_secure_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

### 📦 镜像特性

- **🏗️ 多架构支持**：同时支持 `linux/amd64` 和 `linux/arm64` 架构
- **⚡ 优化构建**：基于 Alpine Linux，镜像体积小，启动速度快
- **🔒 安全可靠**：定期更新底层依赖，修复安全漏洞
- **🚀 开箱即用**：内置所有必要依赖，无需额外配置

### 🔧 常用操作

```bash
# 进入容器终端（调试用）
docker exec -it katelyatv /bin/sh

# 重启容器
docker restart katelyatv

# 停止容器
docker stop katelyatv

# 查看容器资源使用情况
docker stats katelyatv

# 备份容器（如果有挂载卷）
docker run --rm -v katelyatv_data:/data -v $(pwd):/backup alpine tar czf /backup/katelyatv-backup.tar.gz /data
```

## 🐙 Docker Compose 最佳实践

Docker Compose 是管理多容器应用的最佳方式，特别适合需要数据库支持的部署场景。

## 📚 功能使用教程

### ⏭️ 跳过片头片尾功能

KatelyaTV 提供了智能的跳过片头片尾功能，帮助您快速进入正片内容。

#### 🎯 如何使用

1. **自动检测**：系统会自动检测已设置的跳过片段，在观看时显示跳过按钮
2. **手动设置**：在播放页面标题右侧点击"跳过设置"按钮
3. **添加片段**：选择片头或片尾类型，设置开始和结束时间
4. **保存配置**：配置会自动保存并应用到当前剧集

#### ⚙️ 功能特点

- **智能检测**：自动识别播放时间是否在跳过区间内
- **手动配置**：支持精确设置跳过时间段（精确到秒）
- **多类型支持**：支持片头、片尾等不同类型的跳过片段
- **跨设备同步**：配置数据支持多设备同步（需使用 Redis/D1/Upstash 存储）
- **个性化**：每个用户可独立设置不同的跳过偏好

#### 💾 存储支持

| 存储类型      | 支持状态 | 同步能力  | 推荐场景        |
| ------------- | -------- | --------- | --------------- |
| LocalStorage  | ✅       | ❌ 单设备 | 个人本地使用    |
| Redis         | ✅       | ✅ 多设备 | 家庭/团队使用   |
| Cloudflare D1 | ✅       | ✅ 多设备 | Cloudflare 部署 |
| Upstash       | ✅       | ✅ 多设备 | 无服务器部署    |

> ⚠️ **D1 用户注意**：如果你之前已经部署了项目并使用 D1 数据库，需要手动更新数据库表结构才能使用跳过功能。请参考 [D1_MIGRATION.md](./D1_MIGRATION.md) 进行升级。

#### 🛠️ 使用技巧

- **最佳时机**：建议在剧集开始播放后设置，可以实时看到当前播放时间
- **时间精度**：支持小数点精度，如 `90.5` 秒
- **批量设置**：一次设置后，所有相同剧集都会应用相同规则
- **删除管理**：可以随时删除不需要的跳过片段

## 📁 配置说明

### 📝 LocalStorage（基础单机）

适合个人使用，数据存储在浏览器本地：

```yaml
# docker-compose.yml
version: '3.8'

services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - PASSWORD=your_secure_password
      - SITE_NAME=我的影视站
      - ANNOUNCEMENT=欢迎使用 KatelyaTV！请遵守相关法律法规。
    # 可选：挂载自定义配置
    # volumes:
    #   - ./config.json:/app/config.json:ro
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--quiet',
          '--tries=1',
          '--spider',
          'http://localhost:3000',
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

**启动命令：**

```bash
# 创建并启动服务
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f katelyatv
```

### 🔐 Redis 版本（推荐：多用户 + 同步）

支持多用户、跨设备数据同步、完整的用户权限管理：

```yaml
# docker-compose.yml
version: '3.8'

services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      # 基础配置
      - SITE_NAME=KatelyaTV 影视站
      - ANNOUNCEMENT=支持多用户注册，请合理使用！

      # 管理员账号（重要！）
      - USERNAME=admin
      - PASSWORD=admin_super_secure_password

      # Redis 存储配置
      - NEXT_PUBLIC_STORAGE_TYPE=redis
      - REDIS_URL=redis://katelyatv-redis:6379

      # 用户功能
      - NEXT_PUBLIC_ENABLE_REGISTER=true

      # 可选：搜索配置
      - NEXT_PUBLIC_SEARCH_MAX_PAGE=8
    networks:
      - katelyatv-network
    depends_on:
      katelyatv-redis:
        condition: service_healthy
    # 可选：挂载自定义配置和持久化数据
    # volumes:
    #   - ./config.json:/app/config.json:ro
    #   - ./logs:/app/logs
    healthcheck:
      test:
        [
          'CMD',
          'wget',
          '--quiet',
          '--tries=1',
          '--spider',
          'http://localhost:3000',
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  katelyatv-redis:
    image: redis:7-alpine
    container_name: katelyatv-redis
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    networks:
      - katelyatv-network
    volumes:
      # Redis 数据持久化
      - katelyatv-redis-data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s
    # 可选：端口映射（用于外部访问 Redis）
    # ports:
    #   - '6379:6379'

networks:
  katelyatv-network:
    driver: bridge
    name: katelyatv-network

volumes:
  katelyatv-redis-data:
    driver: local
    name: katelyatv-redis-data
```

**完整部署流程：**

```bash
# 1. 创建项目目录
mkdir katelyatv && cd katelyatv

# 2. 创建 docker-compose.yml 文件（复制上面的内容）
nano docker-compose.yml

# 3. 检查配置文件语法
docker compose config

# 4. 启动所有服务
docker compose up -d

# 5. 查看服务状态
docker compose ps

# 6. 查看启动日志
docker compose logs -f

# 7. 等待服务完全启动（通常需要 30-60 秒）
# 检查健康状态
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# 8. 首次访问 http://your-server:3000
# 使用管理员账号 admin / admin_super_secure_password 登录
# 然后访问 /admin 进行管理员配置
```

**🔍 部署验证步骤：**

```bash
# 验证 Redis 连接
docker compose exec katelyatv-redis redis-cli ping
# 应该返回 "PONG"

# 验证 KatelyaTV 服务
curl -I http://localhost:3000
# 应该返回 HTTP 200 状态码

# 查看服务启动顺序
docker compose logs --timestamps | grep "Ready in"
```

### 🔄 管理与维护

```bash
# 更新到最新版本
docker compose pull && docker compose up -d

# 备份 Redis 数据
docker compose exec katelyatv-redis redis-cli BGSAVE
docker run --rm -v katelyatv-redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup-$(date +%Y%m%d).tar.gz /data

# 查看资源使用情况
docker compose stats

# 重启特定服务
docker compose restart katelyatv

# 查看特定服务日志
docker compose logs -f katelyatv-redis

# 进入容器调试
docker compose exec katelyatv /bin/sh

# 完全清理（注意：会删除所有数据！）
docker compose down -v --remove-orphans
```

### 🚨 重要注意事项

1. **修改默认密码**：部署后请立即修改 `admin` 账号的默认密码
2. **数据备份**：定期备份 Redis 数据卷，避免数据丢失
3. **端口安全**：确保服务器防火墙正确配置，只开放必要端口
4. **资源监控**：定期检查容器资源使用情况，必要时调整配置
5. **日志管理**：配置日志轮转，避免日志文件过大

### 🛠️ 常见部署问题排查

**问题 1：容器启动失败**

```bash
# 检查容器状态
docker compose ps

# 查看详细错误日志
docker compose logs katelyatv

# 常见原因：端口被占用、环境变量配置错误、镜像拉取失败
```

**问题 2：Redis 连接失败**

```bash
# 检查 Redis 容器状态
docker compose exec katelyatv-redis redis-cli ping

# 检查网络连通性
docker compose exec katelyatv ping katelyatv-redis

# 验证环境变量
docker compose exec katelyatv env | grep REDIS
```

**问题 3：Upstash Redis 连接问题**

```bash
# 验证 Upstash 配置
curl -H "Authorization: Bearer YOUR_TOKEN" YOUR_UPSTASH_URL/ping

# 检查环境变量格式
echo $UPSTASH_URL  # 应该是 https://xxx.upstash.io
echo $UPSTASH_TOKEN  # 应该是长字符串令牌
```

**问题 4：Cloudflare D1 初始化失败**

- 确保在 D1 控制台中正确执行了所有 SQL 语句
- 检查数据库绑定名称是否为 `DB`
- 验证环境变量 `NEXT_PUBLIC_STORAGE_TYPE=d1`

**问题 5：Vercel 部署问题**

- 检查环境变量是否正确设置
- 确保 `config.json` 文件格式正确
- 查看 Vercel 部署日志中的错误信息

## 🔄 自动同步最近更改

建议在 fork 的仓库中启用本仓库自带的 GitHub Actions 自动同步功能（见 `.github/workflows/sync.yml`）。

如需手动同步主仓库更新，也可以使用 GitHub 官方的 [Sync fork](https://docs.github.com/cn/github/collaborating-with-issues-and-pull-requests/syncing-a-fork) 功能。

## ⚙️ 环境变量

### 📋 变量说明表

| 变量                        | 说明                                                        | 可选值                           | 默认值                                                                                                                     |
| --------------------------- | ----------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| USERNAME                    | redis 部署时的管理员账号                                    | 任意字符串                       | （空）                                                                                                                     |
| PASSWORD                    | 默认部署时为唯一访问密码，redis 部署时为管理员密码          | 任意字符串                       | （空）                                                                                                                     |
| SITE_NAME                   | 站点名称                                                    | 任意字符串                       | KatelyaTV                                                                                                                  |
| ANNOUNCEMENT                | 站点公告                                                    | 任意字符串                       | 本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。 |
| NEXT_PUBLIC_STORAGE_TYPE    | 播放记录/收藏的存储方式                                     | localstorage、redis、d1、upstash | localstorage                                                                                                               |
| REDIS_URL                   | redis 连接 url，若 NEXT_PUBLIC_STORAGE_TYPE 为 redis 则必填 | 连接 url                         | 空                                                                                                                         |
| UPSTASH_URL                 | upstash redis 连接 url                                      | 连接 url                         | 空                                                                                                                         |
| UPSTASH_TOKEN               | upstash redis 连接 token                                    | 连接 token                       | 空                                                                                                                         |
| NEXT_PUBLIC_ENABLE_REGISTER | 是否开放注册，仅在非 localstorage 部署时生效                | true / false                     | false                                                                                                                      |
| NEXT_PUBLIC_SEARCH_MAX_PAGE | 搜索接口可拉取的最大页数                                    | 1-50                             | 5                                                                                                                          |
| NEXT_PUBLIC_IMAGE_PROXY     | 默认的浏览器端图片代理                                      | url prefix                       | (空)                                                                                                                       |
| NEXT_PUBLIC_DOUBAN_PROXY    | 默认的浏览器端豆瓣数据代理                                  | url prefix                       | (空)                                                                                                                       |

### 🔧 配置验证

**部署后可通过以下方式验证环境变量是否生效：**

1. **访问服务状态页**：`http://your-domain/api/server-config`
2. **检查管理员面板**：使用管理员账号登录后访问 `/admin`
3. **查看容器日志**：

   ```bash
   # Docker 单容器
   docker logs katelyatv

   # Docker Compose
   docker compose logs katelyatv
   ```

## � 配置说明

所有可自定义项集中在根目录的 `config.json` 中：

```json
{
  "cache_time": 7200,
  "api_site": {
    "example": {
      "api": "https://example.com/api.php/provide/vod",
      "name": "示例资源站",
      "detail": "https://example.com"
    }
    // ...更多站点
  }
}
```

- `cache_time`：接口缓存时间（秒）。
- `api_site`：你可以增删或替换任何资源站，字段说明：
  - `key`：唯一标识，保持小写字母/数字。
  - `api`：资源站提供的 `vod` JSON API 根地址。
  - `name`：在人机界面中展示的名称。
  - `detail`：（可选）部分无法通过 API 获取剧集详情的站点，需要提供网页详情根 URL，用于爬取。

KatelyaTV 支持标准的苹果 CMS V10 API 格式。

修改后 **无需重新构建**，服务会在启动时读取一次。

## 👨‍💼 管理员配置

**该特性目前仅支持通过非 localstorage 存储的部署方式使用**

支持在运行时动态变更服务配置

设置环境变量 USERNAME 和 PASSWORD 即为站长用户，站长可设置用户为管理员

站长或管理员访问 `/admin` 即可进行管理员配置

## 📱 AndroidTV 使用

目前该项目可以配合 [OrionTV](https://github.com/zimplexing/OrionTV) 在 Android TV 上使用，可以直接作为 OrionTV 后端

暂时收藏夹与播放记录和网页端隔离，后续会支持同步用户数据

## 🗓️ Roadmap

- [x] 深色模式
- [x] 持久化存储
- [x] 多账户
- [x] 观看历史记录
- [x] PWA 支持
- [x] 豆瓣集成
- [ ] 弹幕系统
- [ ] 字幕支持
- [ ] 下载功能
- [ ] 社交分享

## ⚠️ 安全与隐私提醒

### 强烈建议设置密码保护

为了您的安全和避免潜在的法律风险，我们**强烈建议**在部署时设置密码保护：

- **避免公开访问**：不设置密码的实例任何人都可以访问，可能被恶意利用
- **防范版权风险**：公开的视频搜索服务可能面临版权方的投诉举报
- **保护个人隐私**：设置密码可以限制访问范围，保护您的使用记录

### 部署建议

1. **设置环境变量 `PASSWORD`**：为您的实例设置一个强密码
2. **仅供个人使用**：请勿将您的实例链接公开分享或传播
3. **遵守当地法律**：请确保您的使用行为符合当地法律法规

### 重要声明

- 本项目仅供学习和个人使用
- 请勿将部署的实例用于商业用途或公开服务
- 如因公开分享导致的任何法律问题，用户需自行承担责任
- 项目开发者不对用户的使用行为承担任何法律责任

## 📄 License

[MIT](LICENSE) © 2025 KatelyaTV & Contributors

## ⭐ Star History

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=katelya77/KatelyaTV&type=Date)](https://star-history.com/#katelya77/KatelyaTV&Date)

</div>

## 💖 支持项目

如果这个项目对您有帮助，欢迎给个 ⭐️ Star 支持一下！

您也可以通过以下方式支持项目的持续开发：

<div align="center">

### 请开发者喝杯咖啡 ☕

<table>
  <tr>
    <td align="center">
      <img src="public/wechat.jpg" alt="微信支付" width="200">
      <br>
      <strong>微信支付</strong>
    </td>
  </tr>
</table>

> 💝 感谢您的支持！您的捐赠将用于项目的持续维护和功能改进。

</div>

## 🙏 致谢

- [ts-nextjs-tailwind-starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter) — 项目最初基于该脚手架。
- [LibreTV](https://github.com/LibreSpark/LibreTV) — 由此启发，站在巨人的肩膀上。
- [LunaTV-原 MoonTV](https://github.com/MoonTechLab/LunaTV) — 原始项目与作者社区，感谢原作奠定坚实基础。
- [ArtPlayer](https://github.com/zhw2590582/ArtPlayer) — 提供强大的网页视频播放器。
- [HLS.js](https://github.com/video-dev/hls.js) — 实现 HLS 流媒体在浏览器中的播放支持。
- 感谢所有提供免费影视接口的站点。
