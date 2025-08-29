'use client';

import { useState } from 'react';
import { Globe, Heart, Play, Search, Star, StarOff, Tv } from 'lucide-react';
import Image from 'next/image';

interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  country?: string;
  language?: string;
  isFavorite?: boolean;
}

interface IPTVChannelListProps {
  channels: IPTVChannel[];
  currentChannel?: IPTVChannel;
  onChannelSelect: (channel: IPTVChannel) => void;
  onToggleFavorite?: (channelId: string) => void;
}

export function IPTVChannelList({ 
  channels, 
  currentChannel, 
  onChannelSelect, 
  onToggleFavorite 
}: IPTVChannelListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 按组分类频道
  const groupedChannels = channels.reduce((acc, channel) => {
    const group = channel.group || '其他';
    if (!acc[group]) acc[group] = [];
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, IPTVChannel[]>);

  // 获取所有组名
  const groups = Object.keys(groupedChannels).sort();

  // 过滤频道
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || channel.group === selectedGroup;
    const matchesFavorite = !showFavoritesOnly || channel.isFavorite;
    
    return matchesSearch && matchesGroup && matchesFavorite;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 h-full flex flex-col">
      {/* 头部 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Tv className="mr-2" size={24} />
          IPTV 频道
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredChannels.length})
          </span>
        </h2>

        {/* 搜索框 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索频道..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* 过滤器 */}
        <div className="flex flex-wrap gap-2 mb-3">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">所有分组</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1 rounded-md text-sm flex items-center transition-colors ${
              showFavoritesOnly
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Heart size={14} className="mr-1" />
            收藏
          </button>
        </div>
      </div>

      {/* 频道列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                currentChannel?.id === channel.id
                  ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
              }`}
              onClick={() => onChannelSelect(channel)}
            >
              <div className="flex items-center space-x-3">
                {/* 频道Logo */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {channel.logo ? (
                    <Image
                      src={channel.logo}
                      alt={channel.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Tv className="text-gray-400" size={24} />
                  )}
                </div>

                {/* 频道信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {channel.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      {/* 收藏按钮 */}
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(channel.id);
                          }}
                          className={`p-1 rounded transition-colors ${
                            channel.isFavorite
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          {channel.isFavorite ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                        </button>
                      )}

                      {/* 播放按钮 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onChannelSelect(channel);
                        }}
                        className="p-1 rounded text-gray-400 hover:text-purple-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Play size={16} />
                      </button>
                    </div>
                  </div>

                  {/* 频道详情 */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {channel.group && (
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                        {channel.group}
                      </span>
                    )}
                    {channel.country && (
                      <span className="flex items-center">
                        <Globe size={12} className="mr-1" />
                        {channel.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChannels.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Tv size={48} className="mx-auto mb-2 opacity-50" />
            <p>没有找到匹配的频道</p>
            {searchQuery && (
              <p className="text-sm mt-1">
                尝试修改搜索关键词或切换分组
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default IPTVChannelList;