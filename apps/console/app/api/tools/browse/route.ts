import { NextRequest, NextResponse } from 'next/server';

interface VideoResult {
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || 'trending videos';
    
    // 由于 DuckDuckGo HTML 接口可能不稳定，直接返回示例数据
    // 实际应用中可以使用 YouTube API 或其他视频搜索 API
    const videoResults: VideoResult[] = [
      {
        title: 'Top Trending Videos 2024',
        url: 'https://www.youtube.com/results?search_query=trending+videos',
        description: 'Discover the most popular trending videos',
      },
      {
        title: 'Viral Videos This Week',
        url: 'https://www.youtube.com/results?search_query=viral+videos',
        description: 'Watch the latest viral video content',
      },
      {
        title: 'Most Watched Videos',
        url: 'https://www.youtube.com/results?search_query=most+watched',
        description: 'Explore the most watched videos',
      },
      {
        title: 'Popular Music Videos',
        url: 'https://www.youtube.com/results?search_query=popular+music',
        description: 'Listen to trending music videos',
      },
      {
        title: 'Gaming Highlights',
        url: 'https://www.youtube.com/results?search_query=gaming+highlights',
        description: 'Best gaming moments and highlights',
      },
      {
        title: 'Tech Reviews',
        url: 'https://www.youtube.com/results?search_query=tech+reviews',
        description: 'Latest technology reviews and unboxings',
      },
      {
        title: 'Cooking Tutorials',
        url: 'https://www.youtube.com/results?search_query=cooking+tutorials',
        description: 'Learn cooking with trending recipes',
      },
      {
        title: 'Travel Vlogs',
        url: 'https://www.youtube.com/results?search_query=travel+vlogs',
        description: 'Explore the world through travel videos',
      },
    ];

    return NextResponse.json({
      results: videoResults,
      query,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch videos', 
        results: [] 
      },
      { status: 500 }
    );
  }
}
