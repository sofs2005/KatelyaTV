# KatelyaTV v0.2.0 发布说明

> 本版本主要修复了 Docker 部署配置问题，确保用户能够正确使用 KatelyaTV 的 Docker 镜像进行部署。

## 🚀 重要更新

### Docker 部署修复

- **修复镜像路径**：将所有文档中的 Docker 镜像路径从 `ghcr.io/senshinya/moontv:latest` 更新为 `ghcr.io/katelya77/katelyatv:latest`
- **统一部署说明**：确保 README.md、QUICKSTART.md 和发布说明中的 Docker 部署指令一致
- **验证部署流程**：确认所有 Docker Compose 配置文件使用正确的镜像路径

### 代码兼容性验证

- **构建验证**：通过完整的构建测试，确保所有 KatelyaTV 品牌更改不影响功能
- **向后兼容**：保持与 MoonTV v0.1.0 的完全兼容性
- **环境变量支持**：支持通过 `SITE_NAME` 等环境变量自定义配置

## 🐳 Docker 部署指南

### 快速启动

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

### Docker Compose 部署

#### 基础版本（localStorage）

```yaml
services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - PASSWORD=your_password
```

#### Redis 版本（推荐，支持多用户）

```yaml
services:
  katelyatv-core:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - USERNAME=admin
      - PASSWORD=admin_password
      - NEXT_PUBLIC_STORAGE_TYPE=redis
      - REDIS_URL=redis://katelyatv-redis:6379
      - NEXT_PUBLIC_ENABLE_REGISTER=true
    networks:
      - katelyatv-network
    depends_on:
      - katelyatv-redis

  katelyatv-redis:
    image: redis
    container_name: katelyatv-redis
    restart: unless-stopped
    networks:
      - katelyatv-network
    volumes:
      - ./data:/data

networks:
  katelyatv-network:
    driver: bridge
```

## 📋 环境变量配置

| 变量名                        | 说明                                      | 默认值         | 示例                     |
| ----------------------------- | ----------------------------------------- | -------------- | ------------------------ |
| `PASSWORD`                    | 访问密码（localStorage 模式）或管理员密码 | -              | `your_password`          |
| `USERNAME`                    | 管理员用户名（非 localStorage 模式）      | -              | `admin`                  |
| `SITE_NAME`                   | 站点名称                                  | `KatelyaTV`    | `我的影视站`             |
| `NEXT_PUBLIC_STORAGE_TYPE`    | 存储类型                                  | `localstorage` | `redis`, `d1`, `upstash` |
| `REDIS_URL`                   | Redis 连接地址                            | -              | `redis://localhost:6379` |
| `NEXT_PUBLIC_ENABLE_REGISTER` | 是否开放注册                              | `false`        | `true`                   |

## 🔧 部署验证

部署完成后，请验证以下功能：

1. **基础访问**：浏览器访问 `http://localhost:3000` 能正常打开
2. **密码验证**：使用设置的密码能正常登录
3. **搜索功能**：能正常搜索和播放视频
4. **数据持久化**：重启容器后数据保持（Redis 模式）

## 🐛 已知问题

- 部分第三方资源站可用性受其自身状态影响
- Android TV 端收藏与网页端暂未完全互通（计划在后续版本优化）

## 📝 变更日志

### 修复

- 修复 README.md 中 Docker 镜像路径错误
- 修复 QUICKSTART.md 中 Docker 部署说明
- 修复 Docker Compose 配置示例中的镜像路径

### 改进

- 统一所有文档中的 Docker 部署说明
- 完善环境变量配置说明
- 添加部署验证步骤

### 兼容性

- 保持与 MoonTV v0.1.0 完全兼容
- 支持从旧版本无缝升级
- 保留所有现有功能和配置选项

## 🔄 升级指南

### 从 v0.1.0-katelya 升级

```bash
# 停止旧容器
docker stop katelyatv
docker rm katelyatv

# 拉取新镜像
docker pull ghcr.io/katelya77/katelyatv:latest

# 使用新镜像启动
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

### 从 MoonTV 迁移

如果您之前使用的是 MoonTV，只需将 Docker 镜像路径更改为 `ghcr.io/katelya77/katelyatv:latest`，其他配置保持不变。

## 🙏 鸣谢

- 感谢社区用户反馈的 Docker 部署问题
- 感谢原始项目 MoonTV 及其作者与社区
- 感谢所有为本项目提供反馈和建议的开发者

---

**完整部署文档**：请参考 [README.md](README.md) 和 [QUICKSTART.md](QUICKSTART.md)

— Katelya
