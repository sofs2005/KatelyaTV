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

    // [FINAL TEST] Bypassing getDetailFromApi to isolate the fetch call.
    const detailUrl = `${apiSite.api}?ac=videolist&ids=${id}`;
    const requestHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    };

    console.log('--- [FINAL TEST] REQUEST ---');
    console.log(`URL: ${detailUrl}`);
    console.log('Headers:', JSON.stringify(requestHeaders, null, 2));
    console.log('--------------------------');

    const testResponse = await fetch(detailUrl, { headers: requestHeaders });

    const responseHeaders: { [key: string]: string } = {};
    testResponse.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const responseBody = await testResponse.text();

    console.log('--- [FINAL TEST] RESPONSE ---');
    console.log(`Status: ${testResponse.status}`);
    console.log('Headers:', JSON.stringify(responseHeaders, null, 2));
    console.log('Body:', responseBody);
    console.log('---------------------------');

    if (!testResponse.ok) {
      throw new Error(`[FINAL TEST] Downstream failed with status ${testResponse.status}`);
    }

    const result = JSON.parse(responseBody);

    const cacheTime = await getCacheTime();

    const response = NextResponse.json(result, {
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
