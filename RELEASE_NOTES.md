# KatelyaTV v0.1.0-katelya 发布说明

> 本项目在「MoonTV」基础上进行二创与继承，由 Katelya 持续维护。保留并致谢原作与社区贡献，在不改变核心理念的前提下，专注于更易部署、更友好体验与更稳定维护。

## 亮点

- 全面延续上游核心：多源聚合搜索、在线播放、收藏与观看历史、PWA 支持、响应式布局、多用户系统等
- 文档重写与梳理：README、QUICKSTART、PROJECT_STATUS、CONTRIBUTING、CHANGELOG 全面适配 KatelyaTV 品牌
- 部署指引优化：Vercel / Docker / Cloudflare Pages 一站式说明，提供 Compose 最佳实践
- 安全与隐私提醒：新增部署安全提示与法律风险说明

## 变更摘要

- 品牌与文档
  - 将项目品牌统一为 KatelyaTV，并明确二创与继承来源
  - 更新部署与使用说明，优化快速上手体验
  - 调整仓库路径、示例命令与 Docker 镜像示例名称（镜像仍沿用上游命名空间）
- 代码与配置
  - 保持与上游 MoonTV 的接口与行为兼容
  - 默认站点名改为 `KatelyaTV`（可通过 `SITE_NAME` 环境变量覆盖）

## 安装与升级

- 首次安装（Docker 推荐）

```bash
# 拉取镜像
docker pull ghcr.io/katelya77/katelyatv:latest

# 启动示例
docker run -d --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

- 或使用 README 中的 Docker Compose 示例

## 兼容性

- 保持与上游 MoonTV v0.1.0 行为一致
- 支持存储后端：localStorage / Redis / Cloudflare D1 / Upstash Redis
- 运行环境：Node.js 18+；容器镜像支持多架构

## 已知问题

- 部分第三方资源站可用性受其自身状态影响
- Android TV 端收藏与网页端暂未完全互通（后续版本优化）

## 后续路线

- 弹幕系统、字幕支持、下载功能、社交分享
- 数据同步与多端互通完善
- 性能与稳定性持续优化

## 鸣谢

- 原始项目 MoonTV 及其作者与社区
- 所有为本项目提供反馈、贡献代码与文档的开发者

— Katelya
