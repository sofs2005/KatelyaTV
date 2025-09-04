import { NextResponse } from 'next/server';

import { getAdultApiSites, getAvailableApiSites, getCacheTime } from '@/lib/config';
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
  const includeAdult = searchParams.get('include_adult') === 'true';
  const userName = searchParams.get('user'); // 用于获取用户设置

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
    // 获取用户设置以确定是否需要过滤成人内容
    let shouldFilterAdult = true; // 默认过滤成人内容
    
    if (userName) {
      const storage = getStorage();
      const userSettings = await storage.getUserSettings(userName);
      shouldFilterAdult = userSettings?.filter_adult_content !== false;
    }

    // 获取常规资源站
    const regularSites = await getAvailableApiSites(true); // 总是过滤成人内容
    console.log('搜索API - 获取到的常规站点数量:', regularSites.length);
    console.log('搜索API - 常规站点列表:', regularSites.map(s => s.name).join(', '));
    
    const regularSearchPromises = regularSites.map((site) => searchFromApi(site, query));
    const regularResults = (await Promise.all(regularSearchPromises)).flat();
    console.log('搜索API - 常规搜索结果数量:', regularResults.length);

    let adultResults: unknown[] = [];
    
    // 如果用户设置允许且明确请求包含成人内容，则搜索成人资源站
    if (!shouldFilterAdult && includeAdult) {
      const adultSites = await getAdultApiSites();
      const adultSearchPromises = adultSites.map((site) => searchFromApi(site, query));
      adultResults = (await Promise.all(adultSearchPromises)).flat();
    }

    const cacheTime = await getCacheTime();
    const response = NextResponse.json(
      { 
        regular_results: regularResults,
        adult_results: adultResults
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
