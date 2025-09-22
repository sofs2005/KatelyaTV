/* eslint-disable no-console */
import { AdminConfig, EpisodeSkipConfig, Favorite, IStorage, PlayRecord, UserSettings } from './types';

// Define D1Database and related types locally to avoid dependency on @cloudflare/workers-types
// This makes the code runnable in environments where the package is not installed (e.g., local dev)
// but still provides type safety.
interface D1PreparedStatement {
  bind(...values: (string | number | null)[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<{ success: boolean; error?: string }>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[]; success?: boolean; error?: string }>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

/**
 * D1 数据库存储实现
 * 用于 Cloudflare Workers/D1 部署场景
 */
export class D1Storage implements IStorage {
  constructor(private db: D1Database) { }

  // ---------- 辅助函数 ----------
  private async getUserIdByUsername(username: string): Promise<number | null> {
    const stmt = this.db.prepare('SELECT id FROM users WHERE username = ?1').bind(username);
    const { results } = await stmt.all<{ id: number }>();
    return results.length > 0 ? results[0].id : null;
  }

  private async ensureUserExists(username: string, password: string): Promise<number> {
    let userId = await this.getUserIdByUsername(username);
    if (!userId) {
      const stmt = this.db.prepare('INSERT INTO users (username, password) VALUES (?1, ?2)').bind(username, password);
      await stmt.run();
      userId = await this.getUserIdByUsername(username);
    }
    if (!userId) {
      throw new Error('Failed to create or retrieve user');
    }
    return userId;
  }

  // ---------- 播放记录 ----------
  async getPlayRecord(userName: string, key: string): Promise<PlayRecord | null> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return null;

    const stmt = this.db.prepare('SELECT * FROM play_records WHERE user_id = ?1 AND record_key = ?2').bind(userId, key);
    const { results } = await stmt.all<Record<string, unknown>>();
    if (results.length === 0) return null;

    const record = results[0];
    return {
      title: record.title as string,
      source_name: record.source_name as string,
      cover: record.cover_url as string,
      year: record.year as string,
      index: record.episode_index as number,
      total_episodes: record.total_episodes as number,
      play_time: record.current_time as number,
      total_time: record.duration as number,
      save_time: new Date(record.updated_at as string).getTime(),
      search_title: record.search_title as string,
      type: record.type as 'video' | 'audiobook' | undefined,
      albumId: record.album_id as string | undefined,
      source: record.source as string | undefined,
      id: record.id as string | undefined,
      intro: record.intro as string | undefined,
    };
  }

  async setPlayRecord(userName: string, key: string, record: PlayRecord): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return; // Or throw an error

    const stmt = this.db.prepare(`
      INSERT INTO play_records (user_id, record_key, title, source_name, cover_url, year, episode_index, total_episodes, current_time, duration, search_title, type, album_id, source, intro, video_url, episode_url)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)
      ON CONFLICT(user_id, record_key) DO UPDATE SET
        title = excluded.title,
        source_name = excluded.source_name,
        cover_url = excluded.cover_url,
        year = excluded.year,
        episode_index = excluded.episode_index,
        total_episodes = excluded.total_episodes,
        current_time = excluded.current_time,
        duration = excluded.duration,
        search_title = excluded.search_title,
        type = excluded.type,
        album_id = excluded.album_id,
        source = excluded.source,
        intro = excluded.intro,
        video_url = excluded.video_url,
        episode_url = excluded.episode_url,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId, key, record.title, record.source_name, record.cover, record.year,
      record.index, record.total_episodes, record.play_time, record.total_time,
      record.search_title, record.type ?? null, record.albumId ?? null, record.source ?? null, record.intro ?? null,
      record.id ?? null, record.id ?? null // Assuming video_url and episode_url map to record.id for now
    );
    await stmt.run();
  }

  async getAllPlayRecords(userName: string): Promise<{ [key: string]: PlayRecord }> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return {};

    const stmt = this.db.prepare('SELECT * FROM play_records WHERE user_id = ?1').bind(userId);
    const { results } = await stmt.all<Record<string, unknown>>();

    const records: { [key: string]: PlayRecord } = {};
    for (const record of results) {
      records[record.record_key as string] = {
        title: record.title as string,
        source_name: record.source_name as string,
        cover: record.cover_url as string,
        year: record.year as string,
        index: record.episode_index as number,
        total_episodes: record.total_episodes as number,
        play_time: record.current_time as number,
        total_time: record.duration as number,
        save_time: new Date(record.updated_at as string).getTime(),
        search_title: record.search_title as string,
        type: record.type as 'video' | 'audiobook' | undefined,
        albumId: record.album_id as string | undefined,
        source: record.source as string | undefined,
        id: record.id as string | undefined,
        intro: record.intro as string | undefined,
      };
    }
    return records;
  }

  async deletePlayRecord(userName: string, key: string): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    const stmt = this.db.prepare('DELETE FROM play_records WHERE user_id = ?1 AND record_key = ?2').bind(userId, key);
    await stmt.run();
  }

  // ---------- 收藏 ----------
  async getFavorite(userName: string, key: string): Promise<Favorite | null> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return null;

    const stmt = this.db.prepare('SELECT * FROM favorites WHERE user_id = ?1 AND favorite_key = ?2').bind(userId, key);
    const { results } = await stmt.all<Record<string, unknown>>();
    if (results.length === 0) return null;

    const fav = results[0];
    return {
      source_name: fav.source_name as string,
      total_episodes: fav.total_episodes as number,
      title: fav.title as string,
      year: fav.year as string,
      cover: fav.cover_url as string,
      video_url: fav.video_url as string | undefined,
      save_time: new Date(fav.updated_at as string).getTime(),
      search_title: fav.search_title as string,
      type: fav.type as 'video' | 'audiobook' | undefined,
      albumId: fav.album_id as string | undefined,
      source: fav.source as string | undefined,
      id: fav.id as string | undefined,
      intro: fav.description as string | undefined,
    };
  }

  async setFavorite(userName: string, key: string, favorite: Favorite): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    const stmt = this.db.prepare(`
      INSERT INTO favorites (user_id, favorite_key, title, cover_url, video_url, rating, year, area, category, actors, director, description, source_name, total_episodes, search_title, type, album_id, source)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)
      ON CONFLICT(user_id, favorite_key) DO UPDATE SET
        title = excluded.title,
        cover_url = excluded.cover_url,
        video_url = excluded.video_url,
        rating = excluded.rating,
        year = excluded.year,
        area = excluded.area,
        category = excluded.category,
        actors = excluded.actors,
        director = excluded.director,
        description = excluded.description,
        source_name = excluded.source_name,
        total_episodes = excluded.total_episodes,
        search_title = excluded.search_title,
        type = excluded.type,
        album_id = excluded.album_id,
        source = excluded.source,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId, key, favorite.title, favorite.cover, favorite.id ?? null, null, favorite.year, null, null, null, null, favorite.intro ?? null,
      favorite.source_name, favorite.total_episodes, favorite.search_title, favorite.type ?? null, favorite.albumId ?? null, favorite.source ?? null
    );
    await stmt.run();
  }

  async getAllFavorites(userName: string): Promise<{ [key: string]: Favorite }> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return {};

    const stmt = this.db.prepare('SELECT * FROM favorites WHERE user_id = ?1').bind(userId);
    const { results } = await stmt.all<Record<string, unknown>>();

    const favorites: { [key: string]: Favorite } = {};
    for (const fav of results) {
      favorites[fav.favorite_key as string] = {
        source_name: fav.source_name as string,
        total_episodes: fav.total_episodes as number,
        title: fav.title as string,
        year: fav.year as string,
        cover: fav.cover_url as string,
        video_url: fav.video_url as string | undefined,
        save_time: new Date(fav.updated_at as string).getTime(),
        search_title: fav.search_title as string,
        type: fav.type as 'video' | 'audiobook' | undefined,
        albumId: fav.album_id as string | undefined,
        source: fav.source as string | undefined,
        id: fav.id as string | undefined,
        intro: fav.description as string | undefined,
      };
    }
    return favorites;
  }

  async deleteFavorite(userName: string, key: string): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    const stmt = this.db.prepare('DELETE FROM favorites WHERE user_id = ?1 AND favorite_key = ?2').bind(userId, key);
    await stmt.run();
  }

  // ---------- 用户管理 ----------
  async registerUser(userName: string, password: string): Promise<void> {
    await this.ensureUserExists(userName, password);
  }

  async verifyUser(userName: string, password: string): Promise<boolean> {
    const stmt = this.db.prepare('SELECT password FROM users WHERE username = ?1').bind(userName);
    const { results } = await stmt.all<{ password: string }>();
    if (results.length === 0) return false;
    return results[0].password === password;
  }

  async checkUserExist(userName: string): Promise<boolean> {
    const userId = await this.getUserIdByUsername(userName);
    return userId !== null;
  }

  async changePassword(userName: string, newPassword: string): Promise<void> {
    const stmt = this.db.prepare('UPDATE users SET password = ?1, updated_at = CURRENT_TIMESTAMP WHERE username = ?2').bind(newPassword, userName);
    const { success } = await stmt.run();
    if (!success) {
      throw new Error('User not found or password update failed');
    }
  }

  async deleteUser(userName: string): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    // D1's ON DELETE CASCADE should handle deleting related records in other tables.
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?1').bind(userId);
    await stmt.run();
  }

  // ---------- 用户设置 ----------
  async getUserSettings(userName: string): Promise<UserSettings | null> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return null;

    const stmt = this.db.prepare('SELECT * FROM user_settings WHERE user_id = ?1').bind(userId);
    const { results } = await stmt.all<Record<string, unknown>>();
    if (results.length === 0) {
      // Return default settings if not found
      return {
        filter_adult_content: true,
        theme: 'auto',
        language: 'zh-CN',
        auto_play: true,
        video_quality: 'auto',
      };
    }

    const settings = results[0];
    return {
      filter_adult_content: settings.filter_adult_content === 1,
      theme: settings.theme as 'light' | 'dark' | 'auto',
      language: settings.language as string,
      auto_play: settings.auto_play === 1,
      video_quality: settings.video_quality as string,
    };
  }

  async setUserSettings(userName: string, settings: UserSettings): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    const stmt = this.db.prepare(`
      INSERT INTO user_settings (user_id, username, filter_adult_content, theme, language, auto_play, video_quality)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
      ON CONFLICT(user_id, username) DO UPDATE SET
        filter_adult_content = excluded.filter_adult_content,
        theme = excluded.theme,
        language = excluded.language,
        auto_play = excluded.auto_play,
        video_quality = excluded.video_quality,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId, userName,
      settings.filter_adult_content ? 1 : 0,
      settings.theme,
      settings.language,
      settings.auto_play ? 1 : 0,
      settings.video_quality
    );
    await stmt.run();
  }

  async updateUserSettings(userName: string, settings: Partial<UserSettings>): Promise<void> {
    const currentSettings = await this.getUserSettings(userName);
    if (!currentSettings) return;

    const newSettings = { ...currentSettings, ...settings };
    // Filter out undefined values before setting
    const filteredSettings = Object.fromEntries(
      Object.entries(newSettings).filter(([, value]) => value !== undefined)
    );
    await this.setUserSettings(userName, filteredSettings as UserSettings);
  }

  // ---------- 搜索历史 ----------
  async getSearchHistory(userName: string): Promise<string[]> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return [];

    const stmt = this.db.prepare('SELECT keyword FROM search_history WHERE user_id = ?1 ORDER BY created_at DESC').bind(userId);
    const { results } = await stmt.all<{ keyword: string }>();
    return results.map((r: { keyword: string }) => r.keyword);
  }

  async addSearchHistory(userName: string, keyword: string): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    // First, delete the keyword if it already exists to avoid duplicates and re-insert to update timestamp
    await this.db.prepare('DELETE FROM search_history WHERE user_id = ?1 AND keyword = ?2').bind(userId, keyword).run();
    const stmt = this.db.prepare('INSERT INTO search_history (user_id, keyword) VALUES (?1, ?2)').bind(userId, keyword);
    await stmt.run();
  }

  async deleteSearchHistory(userName: string, keyword?: string): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    if (!keyword) {
      const stmt = this.db.prepare('DELETE FROM search_history WHERE user_id = ?1').bind(userId);
      await stmt.run();
    } else {
      const stmt = this.db.prepare('DELETE FROM search_history WHERE user_id = ?1 AND keyword = ?2').bind(userId, keyword);
      await stmt.run();
    }
  }

  // ---------- 跳过配置 ----------
  async getSkipConfig(userName: string, key: string): Promise<EpisodeSkipConfig | null> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return null;

    const stmt = this.db.prepare('SELECT * FROM skip_configs WHERE user_id = ?1 AND config_key = ?2').bind(userId, key);
    const { results } = await stmt.all<Record<string, unknown>>();
    if (results.length === 0) return null;

    const config = results[0];
    return {
      source: config.source as string,
      id: config.id as string,
      title: config.title as string,
      segments: JSON.parse(config.segments as string || '[]'),
      updated_time: new Date(config.updated_at as string).getTime(),
    };
  }

  async setSkipConfig(userName: string, key: string, config: EpisodeSkipConfig): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    const stmt = this.db.prepare(`
      INSERT INTO skip_configs (user_id, config_key, source, id, title, segments, start_time, end_time)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      ON CONFLICT(user_id, config_key) DO UPDATE SET
        source = excluded.source,
        id = excluded.id,
        title = excluded.title,
        segments = excluded.segments,
        start_time = excluded.start_time,
        end_time = excluded.end_time,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId, key, config.source, config.id, config.title, JSON.stringify(config.segments),
      config.segments[0]?.start || 0, config.segments[0]?.end || 0
    );
    await stmt.run();
  }

  async getAllSkipConfigs(userName: string): Promise<{ [key: string]: EpisodeSkipConfig }> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return {};

    const stmt = this.db.prepare('SELECT * FROM skip_configs WHERE user_id = ?1').bind(userId);
    const { results } = await stmt.all<Record<string, unknown>>();

    const configs: { [key: string]: EpisodeSkipConfig } = {};
    for (const config of results) {
      configs[config.config_key as string] = {
        source: config.source as string,
        id: config.id as string,
        title: config.title as string,
        segments: JSON.parse(config.segments as string || '[]'),
        updated_time: new Date(config.updated_at as string).getTime(),
      };
    }
    return configs;
  }

  async deleteSkipConfig(userName: string, key: string): Promise<void> {
    const userId = await this.getUserIdByUsername(userName);
    if (!userId) return;

    const stmt = this.db.prepare('DELETE FROM skip_configs WHERE user_id = ?1 AND config_key = ?2').bind(userId, key);
    await stmt.run();
  }

  // ---------- 用户列表 ----------
  async getAllUsers(): Promise<string[]> {
    const stmt = this.db.prepare('SELECT username FROM users');
    const { results } = await stmt.all<{ username: string }>();
    return results.map((r: { username: string }) => r.username);
  }

  // ---------- 管理员配置 ----------
  async getAdminConfig(): Promise<AdminConfig | null> {
    const stmt = this.db.prepare('SELECT config_value FROM admin_configs WHERE config_key = ?1').bind('main_config');
    const result = await stmt.first<{ config_value: string }>();
    if (!result) return null;

    try {
      return JSON.parse(result.config_value) as AdminConfig;
    } catch (error) {
      console.error('Failed to parse admin config from D1:', error);
      return null;
    }
  }

  async setAdminConfig(config: AdminConfig): Promise<void> {
    const value = JSON.stringify(config);
    const stmt = this.db.prepare(`
      INSERT INTO admin_configs (config_key, config_value) VALUES (?1, ?2)
      ON CONFLICT(config_key) DO UPDATE SET config_value = excluded.config_value, updated_at = CURRENT_TIMESTAMP
    `).bind('main_config', value);
    await stmt.run();
  }
}
