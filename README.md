# KatelyaTV

<div align="center">
  <img src="public/logo.png" alt="KatelyaTV Logo" width="120">
</div>

> 🎬 **KatelyaTV** 是一个开箱即用的、跨平台的影视聚合播放器。它基于 **Next.js 14** + **Tailwind CSS** + **TypeScript** 构建，支持多资源搜索、在线播放、IPTV直播、收藏同步、播放记录、本地/云端存储，让你可以随时随地畅享海量免费影视内容。

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178c6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)
![Cloudflare Ready](https://img.shields.io/badge/Cloudflare-ready-orange?logo=cloudflare)

</div>

---

## ✨ 功能特性

- 🔍 **多源聚合搜索**：内置数十个免费资源站点，一次搜索立刻返回全源结果
- 📄 **丰富详情页**：支持剧集列表、演员、年份、简介等完整信息展示
- ▶️ **流畅在线播放**：集成 HLS.js & ArtPlayer，支持多种视频格式
- 📺 **IPTV直播功能**：支持M3U播放列表，观看电视直播频道
- ❤️ **收藏 + 继续观看**：支持 Cloudflare D1/Upstash Redis 存储，多端同步进度
- 📱 **PWA支持**：离线缓存、安装到桌面/主屏，移动端原生体验
- 🌗 **响应式布局**：桌面侧边栏 + 移动底部导航，自适应各种屏幕尺寸
- 🚀 **极简部署**：专为Cloudflare Pages优化，免费部署到全球CDN
- 🎨 **精美UI设计**：酷炫特效、iOS Safari兼容，现代化界面设计
- 🌍 **多平台支持**：Web、移动端、AndroidTV完美适配

<details>
  <summary>点击查看项目截图</summary>
  <img src="public/screenshot1.png" alt="项目截图" style="max-width:600px">
  <img src="public/screenshot2.png" alt="项目截图" style="max-width:600px">
  <img src="public/screenshot3.png" alt="项目截图" style="max-width:600px">
</details>

## 🗺 目录

- [技术栈](#技术栈)
- [快速部署](#快速部署)
- [Cloudflare Pages 部署](#cloudflare-pages-部署)
- [环境变量](#环境变量)
- [配置说明](#配置说明)
- [IPTV功能](#iptv功能)
- [管理员配置](#管理员配置)
- [AndroidTV 使用](#androidtv-使用)
- [安全与隐私提醒](#安全与隐私提醒)
- [更新日志](#更新日志)
- [License](#license)
- [致谢](#致谢)

## 技术栈

| 分类      | 主要依赖                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------- |
| 前端框架  | [Next.js 14](https://nextjs.org/) · App Router                                                        |
| UI & 样式 | [Tailwind CSS 3](https://tailwindcss.com/)                                                       |
| 语言      | TypeScript 4                                                                                          |
| 播放器    | [ArtPlayer](https://github.com/zhw2590582/ArtPlayer) · [HLS.js](https://github.com/video-dev/hls.js/) |
| 代码质量  | ESLint · Prettier · Jest                                                                              |
| 部署      | Cloudflare Pages · Vercel                                                                    |

## 快速部署

本项目专为 **Cloudflare Pages** 优化，推荐使用Cloudflare部署以获得最佳性能。

### 一键部署到Cloudflare Pages

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/katelya77/KatelyaTV)

## Cloudflare Pages 部署

**Cloudflare Pages 的环境变量建议设置为密钥而非文本**

### 基础部署（localstorage）

1. **Fork** 本仓库到你的 GitHub 账户
2. 登陆 [Cloudflare](https://cloudflare.com)，点击 **Workers 和 Pages** → **创建应用程序** → **Pages**
3. 选择 **连接到 Git**，选择 Fork 后的仓库
4. 构建设置：
   - **构建命令**: `pnpm install --frozen-lockfile && pnpm run pages:build`
   - **构建输出目录**: `.vercel/output/static`
   - **Root目录**: `/` (留空)
5. 点击 **保存并部署**
6. 部署完成后，进入 **设置** → **环境变量**，添加 `PASSWORD` 变量（设置为密钥）
7. 在 **设置** → **函数** 中，将兼容性标志设置为 `nodejs_compat`
8. **重新部署**

### D1 数据库支持（推荐）

0. 完成基础部署并成功访问
1. 在Cloudflare控制台，点击 **Workers 和 Pages** → **D1 SQL 数据库** → **创建数据库**
2. 数据库名称可任意设置，点击创建
3. 进入数据库，点击 **控制台**，复制粘贴以下SQL并运行：

```sql
-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  isAdmin INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 播放记录表
CREATE TABLE IF NOT EXISTS play_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  vodId TEXT NOT NULL,
  episodeIndex INTEGER DEFAULT 0,
  currentTime REAL DEFAULT 0,
  duration REAL DEFAULT 0,
  title TEXT,
  episodeTitle TEXT,
  poster TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
);

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  vodId TEXT NOT NULL,
  title TEXT,
  poster TEXT,
  year TEXT,
  type TEXT,
  rating TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
  UNIQUE(userId, vodId)
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_play_records_user_vod ON play_records(userId, vodId);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(userId);
CREATE INDEX IF NOT EXISTS idx_play_records_updated ON play_records(updatedAt);
```

4. 返回Pages项目，进入 **设置** → **函数** → **D1 数据库绑定** → **添加绑定**
5. 变量名称填 `DB`，选择刚创建的数据库
6. 设置环境变量：
   - `NEXT_PUBLIC_STORAGE_TYPE`: `d1`
   - `USERNAME`: 管理员用户名
   - `PASSWORD`: 管理员密码
7. **重新部署**

### Upstash Redis 支持

如果你更喜欢使用Redis：

1. 在 [Upstash](https://upstash.com/) 注册并创建Redis实例
2. 复制 **HTTPS ENDPOINT** 和 **TOKEN**
3. 在Cloudflare Pages设置环境变量：
   - `NEXT_PUBLIC_STORAGE_TYPE`: `upstash`
   - `UPSTASH_URL`: Redis端点URL
   - `UPSTASH_TOKEN`: Redis令牌
   - `USERNAME`: 管理员用户名
   - `PASSWORD`: 管理员密码
4. **重新部署**

## 环境变量

| 变量                        | 说明                                                        | 可选值                           | 默认值                                                                                                                     |
| --------------------------- | ----------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| USERNAME                    | 管理员账号（非localstorage存储时必填）                                    | 任意字符串                       | （空）                                                                                                                     |
| PASSWORD                    | 访问密码/管理员密码          | 任意字符串                       | （空）                                                                                                                     |
| NEXT_PUBLIC_SITE_NAME       | 站点名称                                                    | 任意字符串                       | KatelyaTV                                                                                                                     |
| ANNOUNCEMENT                | 站点公告                                                    | 任意字符串                       | 本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。 |
| NEXT_PUBLIC_STORAGE_TYPE    | 播放记录/收藏的存储方式                                     | localstorage、d1、upstash | localstorage                                                                                                               |
| UPSTASH_URL                 | upstash redis 连接 url                                      | 连接 url                         | 空                                                                                                                         |
| UPSTASH_TOKEN               | upstash redis 连接 token                                    | 连接 token                       | 空                                                                                                                         |
| NEXT_PUBLIC_ENABLE_REGISTER | 是否开放注册，仅在非 localstorage 部署时生效                | true / false                     | false                                                                                                                      |
| NEXT_PUBLIC_SEARCH_MAX_PAGE | 搜索接口可拉取的最大页数                                    | 1-50                             | 5                                                                                                                          |

## 配置说明

所有可自定义项集中在根目录的 `config.json` 中：

```json
{
  "cache_time": 7200,
  "api_site": {
    "dyttzy": {
      "api": "http://caiji.dyttzyapi.com/api.php/provide/vod",
      "name": "电影天堂资源",
      "detail": "http://caiji.dyttzyapi.com"
    }
    // ...更多站点
  },
  "custom_category": [
    {
      "name": "华语",
      "type": "movie", 
      "query": "华语"
    }
  ]
}
```

- `cache_time`：接口缓存时间（秒）
- `api_site`：你可以增删或替换任何资源站，字段说明：
  - `key`：唯一标识，保持小写字母/数字
  - `api`：资源站提供的 `vod` JSON API 根地址
  - `name`：在人机界面中展示的名称
  - `detail`：（可选）部分无法通过 API 获取剧集详情的站点，需要提供网页详情根 URL，用于爬取
- `custom_category`：自定义分类配置，用于在导航中添加个性化的影视分类

KatelyaTV 支持标准的苹果 CMS V10 API 格式。

修改后 **无需重新构建**，服务会在启动时读取一次。

## IPTV功能

KatelyaTV 内置强大的IPTV直播功能，支持：

### 功能特性
- 📺 **M3U播放列表支持**：导入标准M3U/M3U8格式的频道列表
- 🔄 **多种导入方式**：支持URL加载、文件上传两种方式
- 💾 **频道管理**：分组显示、搜索过滤、收藏功能
- 🎮 **播放控制**：音量调节、全屏播放、频道切换
- 📱 **移动端优化**：响应式设计，移动设备完美适配
- 💫 **流畅播放**：基于HLS.js，支持各种直播流格式

### 使用方法
1. 访问 `/iptv` 页面
2. 通过以下方式导入频道：
   - **URL导入**：粘贴M3U播放列表链接，点击"加载"
   - **文件导入**：上传本地M3U文件
3. 从频道列表中选择要观看的频道
4. 享受高清直播内容

### 支持的频道源
- 免费的IPTV频道
- 公开的M3U播放列表
- 自建的直播源

## 管理员配置

**该特性仅支持通过非 localstorage 存储的部署方式使用**

支持在运行时动态变更服务配置

设置环境变量 USERNAME 和 PASSWORD 即为站长用户，站长可设置用户为管理员

站长或管理员访问 `/admin` 即可进行管理员配置

## AndroidTV 使用

目前该项目可以配合 [OrionTV](https://github.com/zimplexing/OrionTV) 在 Android TV 上使用，可以直接作为 OrionTV 后端

支持播放记录和网页端同步

## 安全与隐私提醒

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

## 更新日志

### v2.0.0 (最新)
- 🎉 **新增IPTV直播功能**：支持M3U播放列表，观看电视直播
- 🔧 **修复iOS Safari兼容性**：登录界面在iOS设备上完美显示
- 🚀 **优化Cloudflare部署**：专门为Cloudflare Pages优化
- 🎨 **UI界面升级**：更加现代化的设计，保留酷炫特效
- 📱 **移动端体验改进**：更好的响应式设计和触控体验
- 🛠️ **代码质量提升**：TypeScript严格模式，更好的错误处理

### v1.0.0
- 🔍 多源聚合搜索功能
- ▶️ 在线视频播放
- ❤️ 收藏和播放记录
- 📱 PWA支持
- 🌗 深色模式

## License

[MIT](LICENSE) © 2025 KatelyaTV & Contributors

## 致谢

- [LunaTV](https://github.com/MoonTechLab/LunaTV) — 功能参考和灵感来源
- [ts-nextjs-tailwind-starter](https://github.com/theodorusclarence/ts-nextjs-tailwind-starter) — 项目最初基于该脚手架
- [LibreTV](https://github.com/LibreSpark/LibreTV) — 由此启发，站在巨人的肩膀上
- [ArtPlayer](https://github.com/zhw2590582/ArtPlayer) — 提供强大的网页视频播放器
- [HLS.js](https://github.com/video-dev/hls.js) — 实现 HLS 流媒体在浏览器中的播放支持
- 感谢所有提供免费影视接口的站点

---

<div align="center">
  <p>如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！</p>
  <p>Made with ❤️ by KatelyaTV Team</p>
</div>