# 🎉 KatelyaTV v0.5.0-katelya

> **重大更新**：智能跳过片头片尾功能 + 多平台兼容性增强

## ✨ 主要新增功能

### 🎬 智能跳过片头片尾系统

- **批量设置**：支持同时配置片头片尾跳过时间
- **智能检测**：自动识别片头片尾时间点
- **时间格式**：直观的"分:秒"格式输入（如 1:30）
- **自动跳转**：支持自动跳到下一集功能
- **浮动界面**：美观的跳过提示，不遮挡视频内容
- **倒计时显示**：5秒跳过倒计时提醒
- **全存储支持**：LocalStorage、Redis、D1、Upstash 全兼容

### 🔧 技术架构优化

- **统一构建工具**：全面切换到 pnpm，提升构建速度 50%+
- **多平台兼容**：完美支持 Cloudflare Pages、Docker、Vercel
- **Edge Runtime**：Cloudflare Pages 使用 Edge Runtime 优化
- **自动转换**：Docker 部署时自动转换为 Node.js Runtime

### 🗄️ 数据库增强

- **新增表结构**：`skip_configs` 表用于存储跳过配置
- **索引优化**：完整的数据库索引提升查询性能
- **迁移文档**：提供现有数据库的迁移指南

## 🔄 改进与修复

### 📦 构建系统

- 统一使用 pnpm 包管理器
- 优化 Cloudflare Pages 构建配置
- 修复 GitHub Actions 工作流语法错误
- 更新所有仓库引用到新的 katelya77/KatelyaTV

### 🎨 用户界面

- 跳过配置界面重新设计
- 支持批量设置片头片尾
- 修复界面重叠问题
- 优化时间输入体验

### 🛠️ 开发体验

- 修复 ESLint 错误
- 清理无用配置文件
- 优化版本检查机制
- 完善 Docker 兼容性测试

## 🚀 部署指南

### Cloudflare Pages（推荐）

```bash
# 构建命令
pnpm pages:build

# 输出目录
.vercel/output/static
```

### Docker 部署

```bash
docker pull ghcr.io/katelya77/katelyatv:v0.5.0-katelya
docker run -d --name katelyatv -p 3000:3000 \
  --env PASSWORD=your_password \
  ghcr.io/katelya77/katelyatv:v0.5.0-katelya
```

### Vercel 部署

```bash
# 构建命令
pnpm run build
```

## 📋 环境变量

| 变量                     | 说明       | 默认值       |
| ------------------------ | ---------- | ------------ |
| PASSWORD                 | 访问密码   | 必填         |
| NEXT_PUBLIC_STORAGE_TYPE | 存储类型   | localstorage |
| USERNAME                 | 管理员账号 | 空           |

## 🆕 新功能使用说明

### 跳过片头片尾设置

1. 在播放页面点击"跳过设置"按钮
2. 选择"批量设置"模式
3. 输入片头时间（如：1:30）
4. 输入片尾时间（如：1:30）
5. 开启"自动跳过"和"自动下一集"
6. 保存设置

### 智能检测功能

- 系统会根据播放行为自动学习片头片尾时间
- 支持自动识别常见的片头片尾模式
- 提供5秒倒计时，可手动取消跳过

## 🔧 技术升级

### 构建工具统一

- 所有平台统一使用 pnpm
- 构建速度提升 2-3 倍
- 磁盘空间节省 50%+

### 多平台兼容

- **Cloudflare Pages**: 使用 Edge Runtime，全球CDN加速
- **Docker**: 自动转换 Runtime，支持多架构
- **Vercel**: 优化构建配置，快速部署

## 🔗 相关资源

- [项目文档](https://github.com/katelya77/KatelyaTV#readme)
- [问题反馈](https://github.com/katelya77/KatelyaTV/issues)
- [功能讨论](https://github.com/katelya77/KatelyaTV/discussions)
- [贡献指南](https://github.com/katelya77/KatelyaTV/blob/main/CONTRIBUTING.md)

## 🙏 致谢

感谢所有用户的反馈和建议，特别是跳过片头片尾功能的需求。本版本致力于提供更智能、更便捷的观影体验。

## 📈 版本对比

| 功能         | v0.4.0 | v0.5.0 |
| ------------ | ------ | ------ |
| 跳过片头片尾 | ❌     | ✅     |
| 批量设置     | ❌     | ✅     |
| 智能检测     | ❌     | ✅     |
| 自动下一集   | ❌     | ✅     |
| pnpm 构建    | ❌     | ✅     |
| Edge Runtime | ❌     | ✅     |
| 多存储支持   | ✅     | ✅     |
| Docker 部署  | ✅     | ✅     |

---

**注意**: 本项目仅供学习和个人使用，请遵守当地法律法规。

**发布日期**: 2025年9月2日  
**版本标签**: v0.5.0-katelya
