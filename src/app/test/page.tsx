'use client';

import React from 'react';

import EpisodeSelector from '@/components/EpisodeSelector';

export default function TestPage() {
  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        🧪 剧集选择器测试页面
      </h1>
      
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="h-96">
          <EpisodeSelector
            totalEpisodes={50}
            episodesPerPage={10}
            value={5}
            onChange={(_episode) => {
              // 选择了第 {_episode + 1} 集
            }}
            availableSources={[]}
            sourceSearchLoading={false}
            sourceSearchError={null}
          />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
        <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">测试说明:</h2>
        <ul className="text-blue-800 dark:text-blue-200 space-y-1">
          <li>• 应该看到红色的调试信息条</li>
          <li>• 应该看到彩色的测试网格</li>
          <li>• 左右导航按钮应该可见</li>
          <li>• 剧集按钮应该是彩色的(黄橙红渐变)</li>
          <li>• 激活的按钮应该是红粉紫渐变</li>
          <li>• 改变浏览器窗口大小，网格应该响应式变化</li>
        </ul>
      </div>
    </div>
  );
}
