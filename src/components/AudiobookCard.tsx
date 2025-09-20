'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AudiobookSearchResult } from '@/lib/types';

interface AudiobookCardProps {
  item: AudiobookSearchResult;
}

export default function AudiobookCard({ item }: AudiobookCardProps) {
  const { albumId, title, cover, intro } = item;

  // Encode the necessary data for the URL
  const queryParams = new URLSearchParams({
    type: 'audiobook',
    albumId: albumId.toString(),
    title: title,
    cover: cover,
    intro: intro,
  }).toString();

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
        </div>
        <div className="mt-2">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">{item.Nickname}</p>
        </div>
      </div>
    </Link>
  );
}