import { NextResponse } from 'next/server';

import { getAvailableApiSites, getCacheTime, getConfig } from '@/lib/config';
import { addCorsHeaders, handleOptionsRequest } from '@/lib/cors';
import { getStorage } from '@/lib/db';
import { searchFromApi } from '@/lib/downstream';

export const runtime = 'edge';

// 处理OPTIONS预检请求（OrionTV客户端需要）
export async function OPTIONS() {
  return handleOptionsRequest();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const type = searchParams.get('type') as 'video' | 'audiobook' | null;

  // 从 Authorization header 或 query parameter 获取用户名
  let userName: string | undefined = searchParams.get('user') || undefined;
  if (!userName) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      userName = authHeader.substring(7);
    }
  }

  if (!query) {
    const cacheTime = await getCacheTime();
    const response = NextResponse.json(
      {
        regular_results: [],
        adult_results: []
      },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
          'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
          'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
        },
      }
    );
    return addCorsHeaders(response);
  }

  try {
    // 检查是否明确要求包含成人内容（用于关闭过滤时的明确请求）
    const includeAdult = searchParams.get('include_adult') === 'true';

    // 获取用户的成人内容过滤设置
    let shouldFilterAdult = true; // 默认过滤
    if (userName) {
      try {
        const storage = getStorage();
        const userSettings = await storage.getUserSettings(userName);
        // 如果用户设置存在且明确设为false，则不过滤；否则默认过滤
        shouldFilterAdult = userSettings?.filter_adult_content !== false;
      } catch (error) {
        // 出错时默认过滤成人内容
        shouldFilterAdult = true;
      }
    }

    // 根据用户设置和明确请求决定最终的过滤策略
    const finalShouldFilter = shouldFilterAdult && !includeAdult;

    // 1. 获取所有启用的资源站，不过滤成人内容
    const allEnabledSites = await getAvailableApiSites(false, type);

    if (!allEnabledSites || allEnabledSites.length === 0) {
      const cacheTime = await getCacheTime();
      const response = NextResponse.json({
        regular_results: [],
        adult_results: []
      }, {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
          'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
          'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
        },
      });
      return addCorsHeaders(response);
    }

    // 2. 并行搜索所有站点
    const searchPromises = allEnabledSites.map((site) => searchFromApi(site, query));
    const allSearchResults = (await Promise.all(searchPromises)).flat();

    // 3. 获取完整的站点配置，以便区分成人内容
    const config = await getConfig();
    const adultSiteKeys = new Set(
      config.SourceConfig.filter(s => s.is_adult).map(s => s.key)
    );

    // 4. 根据来源将结果分类
    const regular_results: any[] = [];
    const adult_results: any[] = [];

    allSearchResults.forEach(result => {
      if (adultSiteKeys.has(result.source)) {
        adult_results.push(result);
      } else {
        regular_results.push(result);
      }
    });

    // 5. 根据最终过滤策略决定是否返回成人内容
    const final_adult_results = finalShouldFilter ? [] : adult_results;

    const cacheTime = await getCacheTime();
    const response = NextResponse.json(
      {
        regular_results: regular_results,
        adult_results: final_adult_results
      },
      {
        headers: {
          'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
          'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
          'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
        },
      }
    );
    return addCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json(
      {
        regular_results: [],
        adult_results: [],
        error: '搜索失败'
      },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
