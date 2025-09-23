/* eslint-disable @typescript-eslint/no-explicit-any, no-console, @typescript-eslint/no-non-null-assertion */

import { AdminConfig } from './admin.types';
import { getStorage } from './db';
import runtimeConfig from './runtime';

export interface ApiSite {
  key: string;
  api: string;
  name: string;
  detail?: string;
  type?: 'video' | 'audiobook';
}

interface ConfigFileStruct {
  cache_time?: number;
  api_site: {
    [key: string]: ApiSite;
  };
  custom_category?: {
    name?: string;
    type: 'movie' | 'tv';
    query: string;
  }[];
}

export const API_CONFIG = {
  search: {
    path: '?ac=videolist&wd=',
    pagePath: '?ac=videolist&wd={query}&pg={page}',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  },
  detail: {
    path: '?ac=videolist&ids=',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/json',
    },
  },
};

// 在模块加载时根据环境决定配置来源
let fileConfig: ConfigFileStruct;
let cachedConfig: AdminConfig;

async function initConfig() {
  if (cachedConfig) {
    return;
  }

  const isBrowser =
    typeof window !== 'undefined' && typeof window.document !== 'undefined';

  if (process.env.DOCKER_ENV === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const _require = eval('require') as NodeRequire;
    const fs = _require('fs') as typeof import('fs');
    const path = _require('path') as typeof import('path');

    const configPath = path.join(process.cwd(), 'config.json');
    const raw = fs.readFileSync(configPath, 'utf-8');
    fileConfig = JSON.parse(raw) as ConfigFileStruct;
    console.log('load dynamic config success');
  } else {
    // 默认使用编译时生成的配置
    fileConfig = runtimeConfig as unknown as ConfigFileStruct;
  }

  const createFileBasedConfig = () =>
  ({
    SiteConfig: {
      SiteName: process.env.SITE_NAME || 'KatelyaTV',
      Announcement:
        process.env.ANNOUNCEMENT ||
        '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。',
      SearchDownstreamMaxPage:
        Number(process.env.NEXT_PUBLIC_SEARCH_MAX_PAGE) || 5,
      SiteInterfaceCacheTime: fileConfig.cache_time || 7200,
      ImageProxy: process.env.NEXT_PUBLIC_IMAGE_PROXY || '',
      DoubanProxy: process.env.NEXT_PUBLIC_DOUBAN_PROXY || '',
    },
    UserConfig: {
      AllowRegister: process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true',
      Users: [],
    },
    SourceConfig: Object.entries(fileConfig.api_site).map(([key, site]) => ({
      key,
      name: site.name,
      api: site.api,
      detail: site.detail,
      from: 'config',
      disabled: false,
      is_adult: (site as any).is_adult || false,
      type: (site as any).type,
    })),
    CustomCategories:
      fileConfig.custom_category?.map((category) => ({
        name: category.name,
        type: category.type,
        query: category.query,
        from: 'config',
        disabled: false,
      })) || [],
  } as AdminConfig);

  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';

  if (storageType === 'localstorage' || isBrowser) {
    cachedConfig = createFileBasedConfig();
    return;
  }

  // 数据库存储，读取并补全管理员配置 (仅限服务器端)
  const storage = getStorage();
  try {
    // 尝试从数据库获取管理员配置
    let adminConfig: AdminConfig | null = null;
    if (storage && typeof (storage as any).getAdminConfig === 'function') {
      adminConfig = await (storage as any).getAdminConfig();
    }

    // 获取所有用户名，用于补全 Users
    let userNames: string[] = [];
    if (storage && typeof (storage as any).getAllUsers === 'function') {
      try {
        userNames = await (storage as any).getAllUsers();
      } catch (e) {
        console.error('获取用户列表失败:', e);
      }
    }

    // 从文件中获取源信息，用于补全源
    const apiSiteEntries = Object.entries(fileConfig.api_site);
    const customCategories = fileConfig.custom_category || [];

    if (adminConfig) {
      // 补全 SourceConfig
      const existed = new Set(
        (adminConfig.SourceConfig || []).map((s) => s.key)
      );
      apiSiteEntries.forEach(([key, site]) => {
        if (!existed.has(key)) {
          adminConfig!.SourceConfig.push({
            key,
            name: site.name,
            api: site.api,
            detail: site.detail,
            from: 'config',
            disabled: false,
            is_adult: (site as any).is_adult || false, // 确保 is_adult 字段被正确处理
            type: (site as any).type,
          });
        }
      });

      // 检查现有源是否在 fileConfig.api_site 中，如果不在则标记为 custom
      const apiSiteKeys = new Set(apiSiteEntries.map(([key]) => key));
      adminConfig.SourceConfig.forEach((source) => {
        if (!apiSiteKeys.has(source.key)) {
          source.from = 'custom';
        } else {
          // 更新现有源的 is_adult 字段
          const siteConfig = fileConfig.api_site[source.key];
          if (siteConfig) {
            source.is_adult = (siteConfig as any).is_adult || false;
            source.type = (siteConfig as any).type;
          }
        }
      });

      // 确保 CustomCategories 被初始化
      if (!adminConfig.CustomCategories) {
        adminConfig.CustomCategories = [];
      }

      // 始终使用文件中的 CustomCategories 覆盖
      adminConfig.CustomCategories = customCategories.map((category) => ({
        name: category.name,
        type: category.type,
        query: category.query,
        from: 'config',
        disabled: false,
      }));

      const existedUsers = new Set(
        (adminConfig.UserConfig.Users || []).map((u) => u.username)
      );
      userNames.forEach((uname) => {
        if (!existedUsers.has(uname)) {
          adminConfig!.UserConfig.Users.push({
            username: uname,
            role: 'user',
          });
        }
      });
      // 站长
      const ownerUser = process.env.USERNAME;
      if (ownerUser) {
        adminConfig!.UserConfig.Users = adminConfig!.UserConfig.Users.filter(
          (u) => u.username !== ownerUser
        );
        adminConfig!.UserConfig.Users.unshift({
          username: ownerUser,
          role: 'owner',
        });
      }
    } else {
      // 数据库中没有配置，创建新的管理员配置
      let allUsers = userNames.map((uname) => ({
        username: uname,
        role: 'user',
      }));
      const ownerUser = process.env.USERNAME;
      if (ownerUser) {
        allUsers = allUsers.filter((u) => u.username !== ownerUser);
        allUsers.unshift({
          username: ownerUser,
          role: 'owner',
        });
      }
      adminConfig = {
        SiteConfig: {
          SiteName: process.env.SITE_NAME || 'KatelyaTV',
          Announcement:
            process.env.ANNOUNCEMENT ||
            '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。',
          SearchDownstreamMaxPage:
            Number(process.env.NEXT_PUBLIC_SEARCH_MAX_PAGE) || 5,
          SiteInterfaceCacheTime: fileConfig.cache_time || 7200,
          ImageProxy: process.env.NEXT_PUBLIC_IMAGE_PROXY || '',
          DoubanProxy: process.env.NEXT_PUBLIC_DOUBAN_PROXY || '',
        },
        UserConfig: {
          AllowRegister: process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true',
          Users: allUsers as any,
        },
        SourceConfig: apiSiteEntries.map(([key, site]) => ({
          key,
          name: site.name,
          api: site.api,
          detail: site.detail,
          from: 'config',
          disabled: false,
          is_adult: (site as any).is_adult || false, // 确保 is_adult 字段被正确处理
          type: (site as any).type,
        })),
        CustomCategories: customCategories.map((category) => ({
          name: category.name,
          type: category.type,
          query: category.query,
          from: 'config',
          disabled: false,
        })),
      };
    }

    // 写回数据库（更新/创建）
    if (storage && typeof (storage as any).setAdminConfig === 'function') {
      await (storage as any).setAdminConfig(adminConfig);
    }

    // 更新缓存
    cachedConfig = adminConfig;
  } catch (err) {
    console.error('加载管理员配置失败, 回退到文件配置:', err);
    cachedConfig = createFileBasedConfig();
  }
}

export async function getConfig(): Promise<AdminConfig> {
  if (!cachedConfig) {
    await initConfig();
  }
  return cachedConfig;
}

export function invalidateConfigCache() {
  cachedConfig = undefined as any;
}

export async function resetConfig() {
  const storage = getStorage();
  // 获取所有用户名，用于补全 Users
  let userNames: string[] = [];
  if (storage && typeof (storage as any).getAllUsers === 'function') {
    try {
      userNames = await (storage as any).getAllUsers();
    } catch (e) {
      console.error('获取用户列表失败:', e);
    }
  }

  if (process.env.DOCKER_ENV === 'true') {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const _require = eval('require') as NodeRequire;
    const fs = _require('fs') as typeof import('fs');
    const path = _require('path') as typeof import('path');

    const configPath = path.join(process.cwd(), 'config.json');
    const raw = fs.readFileSync(configPath, 'utf-8');
    fileConfig = JSON.parse(raw) as ConfigFileStruct;
    console.log('load dynamic config success');
  } else {
    // 默认使用编译时生成的配置
    fileConfig = runtimeConfig as unknown as ConfigFileStruct;
  }

  // 从文件中获取源信息，用于补全源
  const apiSiteEntries = Object.entries(fileConfig.api_site);
  const storageType = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage';
  const customCategories = fileConfig.custom_category || [];
  let allUsers = userNames.map((uname) => ({
    username: uname,
    role: 'user',
  }));
  const ownerUser = process.env.USERNAME;
  if (ownerUser) {
    allUsers = allUsers.filter((u) => u.username !== ownerUser);
    allUsers.unshift({
      username: ownerUser,
      role: 'owner',
    });
  }
  const adminConfig = {
    SiteConfig: {
      SiteName: process.env.SITE_NAME || 'KatelyaTV',
      Announcement:
        process.env.ANNOUNCEMENT ||
        '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。',
      SearchDownstreamMaxPage:
        Number(process.env.NEXT_PUBLIC_SEARCH_MAX_PAGE) || 5,
      SiteInterfaceCacheTime: fileConfig.cache_time || 7200,
      ImageProxy: process.env.NEXT_PUBLIC_IMAGE_PROXY || '',
      DoubanProxy: process.env.NEXT_PUBLIC_DOUBAN_PROXY || '',
    },
    UserConfig: {
      AllowRegister: process.env.NEXT_PUBLIC_ENABLE_REGISTER === 'true',
      Users: allUsers as any,
    },
    SourceConfig: apiSiteEntries.map(([key, site]) => ({
      key,
      name: site.name,
      api: site.api,
      detail: site.detail,
      from: 'config',
      disabled: false,
      is_adult: (site as any).is_adult || false,
      type: (site as any).type,
    })),
    CustomCategories:
      storageType === 'redis'
        ? customCategories?.map((category) => ({
          name: category.name,
          type: category.type,
          query: category.query,
          from: 'config',
          disabled: false,
        })) || []
        : [],
  } as AdminConfig;

  if (storage && typeof (storage as any).setAdminConfig === 'function') {
    await (storage as any).setAdminConfig(adminConfig);
  }
  if (cachedConfig == null) {
    // serverless 环境，直接使用 adminConfig
    cachedConfig = adminConfig;
  }
  cachedConfig.SiteConfig = adminConfig.SiteConfig;
  cachedConfig.UserConfig = adminConfig.UserConfig;
  cachedConfig.SourceConfig = adminConfig.SourceConfig;
  cachedConfig.CustomCategories = adminConfig.CustomCategories;
}

export async function getCacheTime(): Promise<number> {
  const config = await getConfig();
  return config.SiteConfig.SiteInterfaceCacheTime || 7200;
}

export async function getAvailableApiSites(
  filterAdult = false,
  type: 'video' | 'audiobook' | null = null
): Promise<ApiSite[]> {
  const config = await getConfig();

  // 防御性检查：确保 SourceConfig 存在且为数组
  if (!config.SourceConfig || !Array.isArray(config.SourceConfig)) {
    console.warn('SourceConfig is missing or not an array, returning empty array');
    return [];
  }

  let sites = config.SourceConfig.filter((s) => !s.disabled);

  // 如果需要过滤成人内容，则排除标记为成人内容的资源站
  if (filterAdult) {
    sites = sites.filter((s) => s.is_adult !== true);
  }

  // 根据类型过滤
  if (type) {
    if (type === 'video') {
      // 视频类型：包含 type 为 'video' 或没有 type 属性的源（为了向后兼容）
      sites = sites.filter((s: any) => !s.type || s.type === 'video');
    } else {
      // 其他类型（如 audiobook）：严格匹配 type
      sites = sites.filter((s: any) => s.type === type);
    }
  }

  return sites.map((s: any) => ({
    key: s.key,
    name: s.name,
    api: s.api,
    detail: s.detail,
    type: s.type,
  }));
}

// 根据用户设置动态获取可用资源站（你的想法实现）
export async function getFilteredApiSites(userName?: string): Promise<ApiSite[]> {
  console.log(`[getFilteredApiSites] Starting for user: '${userName || 'Guest'}'`);
  const config = await getConfig();

  // 防御性检查：确保 SourceConfig 存在且为数组
  if (!config.SourceConfig || !Array.isArray(config.SourceConfig)) {
    console.warn('[getFilteredApiSites] SourceConfig is missing or not an array, returning empty array');
    return [];
  }

  // 默认过滤成人内容
  let shouldFilterAdult = true;

  // 如果提供了用户名，获取用户设置
  if (userName) {
    try {
      const storage = getStorage();
      const userSettings = await storage.getUserSettings(userName);
      console.log(`[getFilteredApiSites] User settings for '${userName}':`, userSettings);
      shouldFilterAdult = userSettings?.filter_adult_content !== false; // 默认为 true
    } catch (error) {
      // 获取用户设置失败时，默认过滤成人内容
      console.warn(`[getFilteredApiSites] Failed to get user settings for '${userName}', using default filter:`, error);
    }
  }
  console.log(`[getFilteredApiSites] Final decision: shouldFilterAdult = ${shouldFilterAdult}`);

  // 防御性处理：为每个源确保 is_adult 字段存在
  let sites = config.SourceConfig
    .filter((s) => !s.disabled)
    .map((s) => ({
      ...s,
      is_adult: s.is_adult === true // 严格检查，只有明确为 true 的才是成人内容
    }));

  console.log('[getFilteredApiSites] All available sites before filtering:', sites.map(s => ({ key: s.key, is_adult: s.is_adult })));

  // 根据用户设置动态过滤成人内容源
  if (shouldFilterAdult) {
    sites = sites.filter((s) => !s.is_adult);
    console.log('[getFilteredApiSites] Sites after filtering adult content:', sites.map(s => s.key));
  } else {
    console.log('[getFilteredApiSites] Adult content filtering is disabled for this user.');
  }

  const finalSites = sites.map((s) => ({
    key: s.key,
    name: s.name,
    api: s.api,
    detail: s.detail,
  }));

  console.log('[getFilteredApiSites] Returning final sites:', finalSites.map(s => s.key));
  return finalSites;
}

// 获取成人内容资源站
export async function getAdultApiSites(): Promise<ApiSite[]> {
  const config = await getConfig();

  // 防御性检查：确保 SourceConfig 存在且为数组
  if (!config.SourceConfig || !Array.isArray(config.SourceConfig)) {
    console.warn('SourceConfig is missing or not an array, returning empty array');
    return [];
  }

  // 防御性处理：严格检查成人内容标记
  const adultSites = config.SourceConfig
    .filter((s) => !s.disabled && s.is_adult === true); // 只有明确为 true 的才被认为是成人内容

  return adultSites.map((s) => ({
    key: s.key,
    name: s.name,
    api: s.api,
    detail: s.detail,
  }));
}

