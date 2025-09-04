# Kvrocks 部署指南

本文档介绍如何使用 Docker + Kvrocks 部署 KatelyaTV。

## 🚀 快速开始

### 方案一：无密码部署（推荐用于开发环境）

1. **准备环境变量文件**

```bash
# 复制环境变量示例文件
cp .env.kvrocks.example .env

# 编辑环境变量
nano .env
```

2. **环境变量配置**

```bash
# 数据库配置
NEXT_PUBLIC_STORAGE_TYPE=kvrocks
KVROCKS_URL=redis://kvrocks:6666
# 不设置密码
# KVROCKS_PASSWORD=
KVROCKS_DATABASE=0

# 应用配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

3. **启动服务**

```bash
docker-compose -f docker-compose.kvrocks.yml up -d
```

### 方案二：密码认证部署（推荐用于生产环境）

1. **准备环境变量文件**

```bash
# 复制环境变量示例文件
cp .env.kvrocks.example .env

# 编辑环境变量
nano .env
```

2. **环境变量配置**

```bash
# 数据库配置
NEXT_PUBLIC_STORAGE_TYPE=kvrocks
KVROCKS_URL=redis://kvrocks:6666
# 设置强密码
KVROCKS_PASSWORD=your_secure_password_here
KVROCKS_DATABASE=0

# 应用配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

3. **启动服务**

```bash
docker-compose -f docker-compose.kvrocks.auth.yml up -d
```

## 🔧 故障排除

### 问题 1：密码认证错误

```
❌ Kvrocks Client Error: [Error]: ERR Client sent AUTH, but no password is set
```

**解决方案：**

- 确保使用正确的 docker-compose 文件
- 检查环境变量 `KVROCKS_PASSWORD` 的设置
- 无密码部署使用：`docker-compose.kvrocks.yml`
- 密码认证部署使用：`docker-compose.kvrocks.auth.yml`

### 问题 2：连接超时

```
❌ Failed to connect to Kvrocks: connect ECONNREFUSED
```

**解决方案：**

1. 检查 Kvrocks 服务是否正常启动

```bash
docker-compose logs kvrocks
```

2. 检查网络连接

```bash
docker-compose exec katelyatv ping kvrocks
```

3. 检查端口映射

```bash
docker-compose ps
```

### 问题 3：数据持久化问题

**解决方案：**

1. 确保数据卷正确挂载

```bash
docker volume ls | grep kvrocks
```

2. 检查数据目录权限

```bash
docker-compose exec kvrocks ls -la /var/lib/kvrocks/data
```

## 📊 健康检查

### 检查服务状态

```bash
# 查看所有服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 检查 Kvrocks 连接
docker-compose exec kvrocks redis-cli -p 6666 ping
```

### 性能监控

```bash
# 查看 Kvrocks 信息
docker-compose exec kvrocks redis-cli -p 6666 info

# 查看内存使用
docker-compose exec kvrocks redis-cli -p 6666 info memory

# 查看连接数
docker-compose exec kvrocks redis-cli -p 6666 info clients
```

## 🔒 安全建议

1. **生产环境必须设置密码**
2. **定期备份数据**
3. **限制网络访问**
4. **监控日志异常**

## 📁 文件结构

```
project/
├── docker-compose.kvrocks.yml         # 无密码部署配置
├── docker-compose.kvrocks.auth.yml    # 密码认证部署配置
├── .env.kvrocks.example               # 环境变量示例
├── docker/
│   └── kvrocks/
│       ├── kvrocks.conf               # 无密码配置文件
│       └── kvrocks.auth.conf          # 密码认证配置文件
└── .env                               # 实际环境变量（需要创建）
```

## 🆘 获取帮助

如果遇到问题，请：

1. 检查日志：`docker-compose logs -f`
2. 验证环境变量：`docker-compose config`
3. 重启服务：`docker-compose restart`
4. 重新构建：`docker-compose up -d --force-recreate`
