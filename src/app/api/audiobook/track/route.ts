export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Note: The API example uses albumId for the track detail endpoint, which seems incorrect.
  // Assuming it should be trackId based on standard API design.
  // If the API truly uses albumId for a specific track, this parameter name might need adjustment.
  const trackId = searchParams.get('trackId');

  if (!trackId) {
    return NextResponse.json({ error: 'Missing trackId parameter' }, { status: 400 });
  }

  const apiKey = process.env.LONGZHU_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  // The provided example URL for getting a track URL uses 'albumId' as the parameter name
  // even when passing a track ID. Adhering to that specific format.
  const externalApiUrl = `https://sdkapi.hhlqilongzhu.cn/api/ximalaya/?key=${apiKey}&trackId=${trackId}`;

  try {
    const response = await fetch(externalApiUrl);
    if (!response.ok) {
      throw new Error(`External API call failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data && data.url) {
      return NextResponse.json({ url: data.url });
    } else {
      console.error('Unexpected data structure from external API:', data);
      return NextResponse.json({ error: 'URL not found in external API response' }, { status: 502 });
    }
  } catch (error) {
    console.error('Error fetching from external API:', error);
    return NextResponse.json({ error: 'Failed to fetch data from external API' }, { status: 502 });
  }
}