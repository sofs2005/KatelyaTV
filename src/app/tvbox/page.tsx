'use client';

import { useEffect, useState } from 'react';

import PageLayout from '@/components/PageLayout';

export default function TVBoxPage() {
  const [baseUrl, setBaseUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    // 获取当前域名
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      // 降级方案：使用document.execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const configs = [
    {
      name: 'TVBox JSON配置',
      description: '直接返回JSON格式的配置文件，适用于支持在线配置的TVBox应用',
      url: `${baseUrl}/api/tvbox`,
      type: 'json'
    },
    {
      name: 'TVBox Base64配置',
      description: '返回Base64编码的配置文件，适用于大部分TVBox应用',
      url: `${baseUrl}/api/tvbox?format=txt`,
      type: 'base64'
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📺 TVBox配置接口
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              将KatelyaTV的视频源导入到TVBox应用中使用
            </p>
          </div>

          {/* 功能介绍 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🎯 功能特点
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    自动同步KatelyaTV的所有视频源
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    支持TVBox标准JSON格式
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    内置视频解析接口
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    支持Base64编码格式
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    自动CORS跨域支持
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-500 text-sm">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    配置自动缓存优化
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 配置链接 */}
          <div className="space-y-6">
            {configs.map((config) => (
              <div
                key={config.type}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {config.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {config.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(config.url, config.type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      copySuccess === config.type
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copySuccess === config.type ? '已复制!' : '复制链接'}
                  </button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                    {config.url}
                  </code>
                </div>
              </div>
            ))}
          </div>

          {/* 使用说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              📖 使用说明
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  1. 复制配置链接
                </h3>
                <p className="text-sm ml-4">
                  选择上方任一配置链接，点击"复制链接"按钮复制到剪贴板
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  2. 导入到TVBox
                </h3>
                <p className="text-sm ml-4">
                  打开TVBox应用 → 设置 → 配置地址 → 粘贴复制的链接 → 确认导入
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  3. 刷新配置
                </h3>
                <p className="text-sm ml-4">
                  当KatelyaTV添加新的视频源时，在TVBox中刷新配置即可同步最新源站
                </p>
              </div>
            </div>
          </div>

          {/* API参数说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🔧 API参数说明
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      参数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      说明
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      示例
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      format
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      返回格式：json(默认) 或 txt(base64编码)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ?format=txt
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 解析接口说明 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              🎬 内置视频解析
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              KatelyaTV提供内置的视频解析接口，支持主流视频平台：
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <code className="text-sm text-gray-800 dark:text-gray-200">
                {baseUrl}/api/parse?url=视频地址
              </code>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>支持的平台：腾讯视频、爱奇艺、优酷、芒果TV、哔哩哔哩、搜狐视频等</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
