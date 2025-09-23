import { NextResponse } from 'next/server';

import { getAvailableApiSites, getCacheTime } from '@/lib/config';
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
    console.log(`[DETAIL_API] Step 1: Looking for source: ${sourceCode}`);
    const apiSites = await getAvailableApiSites(false);
    const apiSite = apiSites.find((site) => site.key === sourceCode);

    if (!apiSite) {
      console.error(`[DETAIL_API] Error: Invalid API source: ${sourceCode}`);
      const response = NextResponse.json({ error: '无效的API来源' }, { status: 400 });
      return addCorsHeaders(response);
    }

    console.log(`[DETAIL_API] Step 2: Found site, calling getDetailFromApi for id: ${id}`);
    const result = await getDetailFromApi(apiSite, id);
    console.log('[DETAIL_API] Step 3: Successfully got result from getDetailFromApi.');

    const cacheTime = await getCacheTime();
    console.log(`[DETAIL_API] Step 4: Got cache time: ${cacheTime}. Preparing response.`);

    const response = NextResponse.json(result, {
      headers: {
        'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
        'CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
        'Vercel-CDN-Cache-Control': `public, s-maxage=${cacheTime}`,
      },
    });

    console.log('[DETAIL_API] Step 5: Successfully created NextResponse.json. Returning response.');
    return addCorsHeaders(response);
  } catch (error) {
    console.error('--- DETAILED ERROR in /api/detail ---');
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
    } else {
      console.error('Caught a non-Error object:', error);
    }
    console.error('--- END DETAILED ERROR ---');

    const response = NextResponse.json(
      { error: '获取视频详情失败: ' + (error as Error).message },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}
