'use client';

import { CheckCircle, Heart, PlayCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  type Favorite,
  deleteFavorite,
  deletePlayRecord,
  generateStorageKey,
  isFavorited,
  saveFavorite,
  subscribeToDataUpdates,
} from '@/lib/db.client';

interface AudiobookCardProps {
  albumId: string | number;
  title: string;
  cover: string;
  intro: string;
  from: 'playrecord' | 'favorite' | 'search';
  progress?: number;
  currentEpisode?: number;
  totalEpisodes?: number;
  source?: string;
  id?: string;
  onDelete?: () => void;
  source_name?: string;
  year?: string;
}

export default function AudiobookCard({
  albumId,
  title,
  cover,
  intro,
  progress,
  currentEpisode,
  totalEpisodes,
  from,
  source,
  id,
  onDelete,
  source_name,
  year,
}: AudiobookCardProps) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(false);

  const storageKey = useMemo(
    () => generateStorageKey('audiobook', String(albumId)),
    [albumId]
  );

  useEffect(() => {
    if (!storageKey) return;

    const fetchFavoriteStatus = async () => {
      try {
        const fav = await isFavorited(storageKey);
        setFavorited(fav);
      } catch (err) {
        console.error('检查收藏状态失败:', err);
      }
    };

    fetchFavoriteStatus();

    const unsubscribe = subscribeToDataUpdates(
      'favoritesUpdated',
      (newFavorites: Record<string, Favorite>) => {
        const isNowFavorited = !!newFavorites[storageKey];
        setFavorited(isNowFavorited);
      }
    );

    return unsubscribe;
  }, [storageKey]);

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!storageKey) return;

      try {
        if (favorited) {
          await deleteFavorite(storageKey);
          setFavorited(false);
        } else {
          const favoriteData: Favorite = {
            title: title,
            source_name: source_name || '',
            year: year || '',
            cover: cover,
            total_episodes: totalEpisodes ?? 1,
            save_time: Date.now(),
            type: 'audiobook',
            albumId: String(albumId),
          };
          await saveFavorite(storageKey, favoriteData);
          setFavorited(true);
        }
      } catch (err) {
        console.error('切换收藏状态失败:', err);
      }
    },
    [
      storageKey,
      favorited,
      title,
      source_name,
      year,
      cover,
      totalEpisodes,
      albumId,
    ]
  );

  const handleDeleteRecord = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (from !== 'playrecord' || !source || !id) return;
      try {
        // Assuming audiobooks also use source and id for play records
        await deletePlayRecord(source, id);
        onDelete?.();
      } catch (err) {
        console.error('删除播放记录失败:', err);
      }
    },
    [from, source, id, onDelete]
  );

  const handleClick = useCallback(() => {
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
    router.push(`/play?${queryParams}`);
  }, [router, albumId, title, cover, intro, currentEpisode]);

  const config = useMemo(() => {
    const configs = {
      playrecord: {
        showPlayButton: true,
        showHeart: true,
        showCheckCircle: true,
      },
      favorite: {
        showPlayButton: true,
        showHeart: true,
        showCheckCircle: false,
      },
      search: {
        showPlayButton: true,
        showHeart: false, // Per requirement, search result doesn't need favorite button for audiobook
        showCheckCircle: false,
      },
    };
    return configs[from] || configs.search;
  }, [from]);

  return (
    <div
      className="group relative w-full rounded-lg bg-transparent cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.05] hover:z-[500]"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />

        {config.showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 ease-in-out delay-75 group-hover:opacity-100 group-hover:scale-100">
            <PlayCircleIcon
              size={50}
              strokeWidth={0.8}
              className="text-white fill-transparent transition-all duration-300 ease-out hover:fill-green-500 hover:scale-[1.1]"
            />
          </div>
        )}

        {(config.showHeart || config.showCheckCircle) && (
          <div className="absolute bottom-3 right-3 flex gap-3 opacity-0 translate-y-2 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
            {config.showCheckCircle && (
              <CheckCircle
                onClick={handleDeleteRecord}
                size={20}
                className="text-white transition-all duration-300 ease-out hover:stroke-green-500 hover:scale-[1.1]"
              />
            )}
            {config.showHeart && (
              <Heart
                onClick={handleToggleFavorite}
                size={20}
                className={`transition-all duration-300 ease-out ${favorited
                  ? 'fill-red-600 stroke-red-600'
                  : 'fill-transparent stroke-white hover:stroke-red-400'
                  } hover:scale-[1.1]`}
              />
            )}
          </div>
        )}

        {totalEpisodes && totalEpisodes > 1 && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md transition-all duration-300 ease-out group-hover:scale-110">
            {currentEpisode
              ? `${currentEpisode}/${totalEpisodes}`
              : totalEpisodes}
          </div>
        )}
      </div>
      {progress !== undefined && progress > 0 && (
        <div className="mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="mt-2 text-center">
        <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400">
          {title}
        </h3>
        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
          {intro}
        </p>
      </div>
    </div>
  );
}