export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  const apiKey = process.env.LONGZHU_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  const externalApiUrl = `https://sdkapi.hhlqilongzhu.cn/api/ximalaya/?key=${apiKey}&name=${encodeURIComponent(name)}`;

  try {
    const response = await fetch(externalApiUrl);
    if (!response.ok) {
      throw new Error(`External API call failed with status ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 502 });
  }
}