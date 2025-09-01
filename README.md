<div align="center">
  <img src="public/logo.png" alt="KatelyaTV Logo" width="128" />
  <h1>KatelyaTV</h1>
  <p><strong>跨平台 · 聚合搜索 · 即开即用 · 自托管影视聚合播放器</strong></p>
  <p>基于 <code>Next.js 14</code> · <code>TypeScript</code> · <code>Tailwind CSS</code> · 多源聚合 / 播放记录 / 收藏同步 / PWA</p>
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

## 🚀 部署（概览 + 实操）

支持 3 大路径：**Docker（推荐生产） / Vercel（免服务器） / Cloudflare Pages + Workers（适合 D1）**。

### 1. 选型快速指引
| 你的需求 | 推荐方案 | 存储模式 | 说明 |
| -------- | -------- | -------- | ---- |
| 个人本机 / NAS / VPS 一条命令跑起来 | Docker 单容器 | localstorage | 无账号体系，仅本设备浏览器保存记录 |
| 多用户 / 同步观看记录 / 简单可维护 | Docker + Redis (Compose) | redis | 稳定高性能，可控数据 |
| 免费托管 + 轻度使用 | Vercel | localstorage / upstash | localstorage 无多用户；Upstash 提供云 Redis |
| 需要使用 Cloudflare D1 | Cloudflare Pages + D1 | d1 | 使用 Cloudflare 边缘与 D1 数据库 |
| 不方便自建 Redis 又要同步 | Vercel + Upstash / Docker + Upstash | upstash | Upstash 提供 HTTP API |

### 2. 存储支持矩阵
|               | Docker | Vercel | Cloudflare |
| :-----------: | :----: | :----: | :--------: |
| localstorage  |   ✅   |   ✅   |     ✅     |
| 原生 redis    |   ✅   |        |            |
| Cloudflare D1 |        |        |     ✅     |
| Upstash Redis |   ✅   |   ✅   |     ☑️     |

说明：非 localstorage 模式才有多账户、云同步、管理后台 `/admin`。

---
### 3. Docker 最小启动
```bash
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=替换为你的访问密码 \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```
访问：http://服务器IP:3000 （首次输入 PASSWORD）

挂载自定义源：
```bash
docker run -d --name katelyatv -p 3000:3000 \
  -v $(pwd)/config.json:/app/config.json:ro \
  --env PASSWORD=你的密码 \
  ghcr.io/katelya77/katelyatv:latest
```
PowerShell 可用：`-v C:/data/katelya/config.json:/app/config.json:ro`

需要多用户：请看下文 Docker Compose Redis。

---
### 4. Vercel 部署
#### 4.1 localstorage
1. Fork 仓库 → Import 到 Vercel
2. 添加环境变量：`PASSWORD=你的访问密码`
3. Deploy
4. （可选）修改 `config.json` 后 Push 自动重建

#### 4.2 Upstash 模式
1. 完成 4.1
2. Upstash 创建 Redis 获取 HTTPS Endpoint & REST Token
3. 添加变量：`UPSTASH_URL` / `UPSTASH_TOKEN` / `NEXT_PUBLIC_STORAGE_TYPE=upstash` / `USERNAME` / `PASSWORD`
4. Redeploy → 登录 admin → `/admin`

---
### 5. Cloudflare Pages
输出目录：`.vercel/output/static`；启用：`nodejs_compat`。

构建命令三选一：
```bash
npm install && npm run pages:build
corepack enable && pnpm install --frozen-lockfile && pnpm run pages:build
npm i -g pnpm@8 && pnpm install --frozen-lockfile && pnpm run pages:build
```
#### 5.1 localstorage
1. Fork → Pages 导入
2. 设置构建命令 & 输出目录
3. 首次构建后添加 `PASSWORD`
4. 重新部署

#### 5.2 D1
1. 完成 5.1 可访问
2. 创建 D1 数据库并执行 `D1初始化.md` 里的 SQL
3. Pages 绑定 D1 变量名 `DB`
4. 添加：`NEXT_PUBLIC_STORAGE_TYPE=d1`、`USERNAME`、`PASSWORD`
5. 重新部署 → admin 登录配置

#### 5.3 常见问题
| 问题 | 现象 | 解决 |
| ---- | ---- | ---- |
| 未找到静态输出 | 404 | 确认构建命令正确执行 & 日志无报错 |
| 访问被拒 | 403 | 检查是否设置 PASSWORD |
| D1 失败 | 500/绑定错误 | 确认绑定名 `DB` 且 SQL 初始化完成 |

---
### 6. Redis（Docker Compose）快速示例
```yaml
services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    environment:
      - USERNAME=admin
      - PASSWORD=强密码
      - NEXT_PUBLIC_STORAGE_TYPE=redis
      - REDIS_URL=redis://katelyatv-redis:6379
      - NEXT_PUBLIC_ENABLE_REGISTER=true
    depends_on:
      katelyatv-redis:
        condition: service_healthy
  katelyatv-redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
```
启动：`docker compose up -d`

---
### 7. 环境变量最小清单
| 场景 | 必填 | 说明 |
| ---- | ---- | ---- |
| localstorage | PASSWORD | 全站访问密码 |
| redis | USERNAME / PASSWORD / NEXT_PUBLIC_STORAGE_TYPE=redis / REDIS_URL | 多用户 + 同步 |
| upstash | USERNAME / PASSWORD / NEXT_PUBLIC_STORAGE_TYPE=upstash / UPSTASH_URL / UPSTASH_TOKEN | 云 Redis |
| d1 | USERNAME / PASSWORD / NEXT_PUBLIC_STORAGE_TYPE=d1 / DB | 需预初始化 |

---
### 8. 升级 / 备份
| 操作 | Docker | Compose |
| ---- | ------ | ------- |
| 升级 | 拉新镜像重建容器 | pull + up -d |
| 备份 | 复制 config.json | 备份 Redis 卷 |
| 日志 | docker logs -f | docker compose logs -f |

到这里你已经可以完成部署；继续阅读下方获取更全面的 Docker / Compose 说明。
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

## � Docker Compose 最佳实践
## 🐙 Docker Compose 最佳实践
Docker Compose 是管理多容器应用的最佳方式，特别适合需要数据库支持的部署场景。
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
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
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
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
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
      test: ["CMD", "redis-cli", "ping"]
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
- [LunaTV-原MoonTV](https://github.com/MoonTechLab/LunaTV) — 原始项目与作者社区，感谢原作奠定坚实基础。
- [ArtPlayer](https://github.com/zhw2590582/ArtPlayer) — 提供强大的网页视频播放器。
- [HLS.js](https://github.com/video-dev/hls.js) — 实现 HLS 流媒体在浏览器中的播放支持。
- 感谢所有提供免费影视接口的站点。
