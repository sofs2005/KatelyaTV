# KatelyaTV Docker 部署指南

> 本文档提供 KatelyaTV 的完整 Docker 部署指南，确保用户能够成功拉取和部署镜像。

## 📦 镜像信息

- **镜像地址**: `ghcr.io/katelya77/katelyatv:latest`
- **支持架构**: linux/amd64, linux/arm64
- **基础镜像**: node:20-alpine
- **暴露端口**: 3000

## 🚀 快速部署

### 1. 单容器部署（推荐新手）

```bash
# 拉取最新镜像
docker pull ghcr.io/katelya77/katelyatv:latest

# 启动容器
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_secure_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest

# 查看运行状态
docker ps | grep katelyatv

# 查看日志
docker logs katelyatv
```

### 2. Docker Compose 部署（推荐生产环境）

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - PASSWORD=your_secure_password
      - SITE_NAME=KatelyaTV
    volumes:
      # 可选：挂载自定义配置
      # - ./config.json:/app/config.json:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

启动服务：

```bash
# 启动服务
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 🗄️ 数据持久化部署（Redis）

对于需要多用户支持和数据同步的场景：

```yaml
version: '3.8'

services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    container_name: katelyatv
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - USERNAME=admin
      - PASSWORD=admin_password
      - NEXT_PUBLIC_STORAGE_TYPE=redis
      - REDIS_URL=redis://redis:6379
      - NEXT_PUBLIC_ENABLE_REGISTER=true
    depends_on:
      - redis
    networks:
      - katelyatv-network

  redis:
    image: redis:7-alpine
    container_name: katelyatv-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - katelyatv-network
    command: redis-server --appendonly yes

volumes:
  redis_data:

networks:
  katelyatv-network:
    driver: bridge
```

## 🔧 环境变量配置

| 变量名 | 描述 | 默认值 | 示例 |
|--------|------|--------|------|
| `PASSWORD` | 访问密码 | - | `my_secure_password` |
| `USERNAME` | 管理员用户名（Redis模式） | - | `admin` |
| `SITE_NAME` | 站点名称 | `KatelyaTV` | `我的影视站` |
| `NEXT_PUBLIC_STORAGE_TYPE` | 存储类型 | `localstorage` | `redis`, `d1`, `upstash` |
| `REDIS_URL` | Redis连接地址 | - | `redis://redis:6379` |
| `NEXT_PUBLIC_ENABLE_REGISTER` | 开放注册 | `false` | `true` |
| `NEXT_PUBLIC_SEARCH_MAX_PAGE` | 搜索最大页数 | `5` | `10` |

## 🔍 故障排查

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看详细错误信息
   docker logs katelyatv
   
   # 检查端口占用
   netstat -tulpn | grep :3000
   ```

2. **镜像拉取失败**
   ```bash
   # 确认镜像地址正确
   docker pull ghcr.io/katelya77/katelyatv:latest
   
   # 如果是私有仓库，需要先登录
   docker login ghcr.io
   ```

3. **数据丢失问题**
   - localStorage 模式：数据存储在浏览器，清除缓存会丢失
   - 建议使用 Redis 模式进行数据持久化

### 健康检查

```bash
# 检查容器状态
docker ps

# 检查容器健康状态
docker inspect katelyatv | grep -A 5 "Health"

# 测试应用响应
curl -I http://localhost:3000
```

## 🔄 更新升级

### 更新到最新版本

```bash
# 停止旧容器
docker stop katelyatv
docker rm katelyatv

# 拉取最新镜像
docker pull ghcr.io/katelya77/katelyatv:latest

# 启动新容器（使用相同配置）
docker run -d \
  --name katelyatv \
  -p 3000:3000 \
  --env PASSWORD=your_secure_password \
  --restart unless-stopped \
  ghcr.io/katelya77/katelyatv:latest
```

### Docker Compose 更新

```bash
# 拉取最新镜像
docker-compose pull

# 重新创建容器
docker-compose up -d --force-recreate
```

## 🔐 安全建议

1. **设置强密码**: 使用复杂密码保护访问
2. **限制访问**: 配置防火墙或反向代理限制访问来源
3. **定期更新**: 保持镜像版本最新
4. **数据备份**: 定期备份 Redis 数据（如果使用）
5. **监控日志**: 关注异常访问和错误日志

## 📊 性能优化

### 资源限制

```yaml
services:
  katelyatv:
    image: ghcr.io/katelya77/katelyatv:latest
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### 反向代理（Nginx）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🆘 获取帮助

- 📖 [项目文档](README.md)
- 🐛 [问题反馈](https://github.com/katelya77/KatelyaTV/issues)
- 💬 [讨论区](https://github.com/katelya77/KatelyaTV/discussions)

---

**注意**: 本项目仅供学习和个人使用，请遵守当地法律法规。