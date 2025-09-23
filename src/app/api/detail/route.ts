import { NextResponse } from 'next/server';

import { getAuthInfoFromCookie } from '@/lib/auth';
import { getFilteredApiSites, getCacheTime } from '@/lib/config';
import { addCorsHeaders, handleOptionsRequest } from '@/lib/cors';
import { getDetailFromApi } from '@/lib/downstream';

export const runtime = 'edge';

// 处理OPTIONS预检请求（OrionTV客户端需要）
export async function OPTIONS() {
  return handleOptionsRequest();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const sourceCode = searchParams.get('source');

  if (!id || !sourceCode) {
    const response = NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    return addCorsHeaders(response);
  }

  if (!/^[\w-]+$/.test(id)) {
    const response = NextResponse.json({ error: '无效的视频ID格式' }, { status: 400 });
    return addCorsHeaders(response);
  }

  try {
    const authInfo = getAuthInfoFromCookie(request as any);
    const apiSites = await getFilteredApiSites(authInfo?.username);
    const apiSite = apiSites.find((site) => site.key === sourceCode);

    if (!apiSite) {
      const response = NextResponse.json({ error: '无效的API来源' }, { status: 400 });
      return addCorsHeaders(response);
    }

    const result = await getDetailFromApi(apiSite, id);
    const cacheTime = await getCacheTime();

    console.log('\n--- [DEBUG] Variable 1: `result` (raw object from downstream) ---');
    try {
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.log('Could not stringify raw result:', e);
    }

    const resultAsString = JSON.stringify(result);
    console.log('\n--- [DEBUG] Variable 2: `resultAsString` (the string passed to JSON.parse) ---');
    console.log(resultAsString);

    // [FINAL FIX] Purify the result object before sending it to NextResponse.json
    const purifiedResult = JSON.parse(resultAsString);
    console.log('\n--- [DEBUG] Variable 3: `purifiedResult` (the final object after re-parsing) ---');
    console.log(JSON.stringify(purifiedResult, null, 2));
    console.log('---------------------------------------------------------------------\n');

    const response = NextResponse.json(purifiedResult, {
      headers: {
        'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
        'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
        'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
      },
    });
    return addCorsHeaders(response);
  } catch (error) {
    const response = NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
