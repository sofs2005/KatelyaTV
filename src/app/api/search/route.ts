import { NextResponse } from 'next/server';

import { getAvailableApiSites, getCacheTime, getAdultApiSites } from '@/lib/config';
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

    // 使用动态过滤方法，但不依赖缓存，实时获取设置
    // 获取常规资源站
    const regularSites = await getAvailableApiSites(true, type);

    let regularResults: any[] = [];
    if (regularSites.length > 0) {
      const regularPromises = regularSites.map((site) => searchFromApi(site, query));
      regularResults = (await Promise.all(regularPromises)).flat();
    }

    // 如果需要，获取成人内容资源站
    let adultResults: any[] = [];
    if (!finalShouldFilter) {
      const adultSites = await getAdultApiSites();
      if (adultSites.length > 0) {
        const adultPromises = adultSites.map((site) => searchFromApi(site, query));
        adultResults = (await Promise.all(adultPromises)).flat();
      }
    }

    const cacheTime = await getCacheTime();
    const response = NextResponse.json(
      {
        regular_results: regularResults,
        adult_results: adultResults,
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
