'use client';

import Link from 'next/link';
import Image from 'next/image';
interface AudiobookCardProps {
  albumId: string | number;
  title: string;
  cover: string;
  intro: string;
  from?: 'search' | 'favorite' | 'history';
  progress?: number;
  currentEpisode?: number;
  totalEpisodes?: number;
  // 允许多余的属性，以便从 VideoCard 传递属性
  [key: string]: any;
}

export default function AudiobookCard({ albumId, title, cover, intro, progress, currentEpisode, totalEpisodes }: AudiobookCardProps) {

  // Encode the necessary data for the URL
  const params: Record<string, string> = {
    type: 'audiobook',
    albumId: albumId.toString(),
    title: title,
    cover: cover,
    intro: intro,
  };

  if (currentEpisode) {
    params.episode = currentEpisode.toString();
  }

  const queryParams = new URLSearchParams(params).toString();

  return (
    <Link href={`/play?${queryParams}`} passHref>
      <div className="group cursor-pointer">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
          <Image
            src={cover}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {totalEpisodes && totalEpisodes > 1 && (
            <div className='absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md transition-all duration-300 ease-out group-hover:scale-110'>
              {currentEpisode
                ? `${currentEpisode}/${totalEpisodes}`
                : totalEpisodes}
            </div>
          )}
        </div>
        {progress !== undefined && progress > 0 && (
          <div className='mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full bg-green-500 transition-all duration-500 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <div className="mt-2">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{intro}</p>
        </div>
      </div>
    </Link>
  );
}