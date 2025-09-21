-- KatelyaTV 用户数据导入脚本
--
-- 使用说明:
-- 将此文件的全部内容复制到您的 KatelyaTV D1 数据库的 SQL 查询控制台中，然后执行。
-- 脚本使用 INSERT OR IGNORE，可以安全地重复执行，已存在的用户将被忽略。

INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('15851588566', 'ZH19791010zh', datetime(1756218461, 'unixepoch'), datetime(1756218461, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('mytv', '314159', datetime(1756226469, 'unixepoch'), datetime(1756226469, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('kikitao520', '123457', datetime(1756255769, 'unixepoch'), datetime(1756255769, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('dmh', 'feitianwu2020', datetime(1756272156, 'unixepoch'), datetime(1756272156, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('inglish', '806090', datetime(1756786522, 'unixepoch'), datetime(1756786522, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('moontv', 'moontv', datetime(1757674967, 'unixepoch'), datetime(1757674967, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('ttt', 'uuu', datetime(1757675268, 'unixepoch'), datetime(1757675268, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('bingxi', '20040518', datetime(1757676426, 'unixepoch'), datetime(1757676426, 'unixepoch'));
INSERT OR IGNORE INTO users (username, password, created_at, updated_at) VALUES ('mayatea', 'mayatea123', datetime(1757680594, 'unixepoch'), datetime(1757680594, 'unixepoch'));

SELECT '用户数据导入成功！';