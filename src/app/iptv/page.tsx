'use client';

import { Suspense, useEffect, useState } from 'react';
import { ArrowLeft, Download, RefreshCw, Tv, Upload } from 'lucide-react';
import Link from 'next/link';

import IPTVChannelList from '@/components/IPTVChannelList';
import IPTVPlayer from '@/components/IPTVPlayer';
import PageLayout from '@/components/PageLayout';

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

function IPTVPageContent() {
  const [channels, setChannels] = useState<IPTVChannel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<IPTVChannel | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showChannelList, setShowChannelList] = useState(true);
  const [m3uUrl, setM3uUrl] = useState('');



  useEffect(() => {
    // 示例频道数据
    const defaultChannels: IPTVChannel[] = [
      {
        id: '1',
        name: 'CGTN',
        url: 'https://live.cgtn.com/1000/prog_index.m3u8',
        group: '新闻',
        country: '中国',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/CGTN.svg'
      },
      {
        id: '2', 
        name: 'CCTV1',
        url: 'http://[2409:8087:1a01:df::7005]:80/ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226559/index.m3u8',
        group: '央视',
        country: '中国'
      },
      {
        id: '3',
        name: 'CCTV新闻',
        url: 'http://[2409:8087:1a01:df::7005]:80/ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226537/index.m3u8',
        group: '央视',
        country: '中国'
      },
      {
        id: '4',
        name: '湖南卫视',
        url: 'http://[2409:8087:1a01:df::7005]:80/ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226307/index.m3u8',
        group: '卫视',
        country: '中国'
      },
      {
        id: '5',
        name: '浙江卫视',
        url: 'http://[2409:8087:1a01:df::7005]:80/ottrrs.hl.chinamobile.com/PLTV/88888888/224/3221226339/index.m3u8',
        group: '卫视',
        country: '中国'
      }
    ];

    // 从本地存储加载频道列表
    const savedChannels = localStorage.getItem('iptv-channels');
    if (savedChannels) {
      try {
        const parsed = JSON.parse(savedChannels);
        setChannels(parsed);
      } catch {
        // 加载失败时使用示例频道
        setChannels(defaultChannels);
      }
    } else {
      setChannels(defaultChannels);
    }

    // 加载上次选择的频道
    const savedCurrentChannel = localStorage.getItem('iptv-current-channel');
    if (savedCurrentChannel) {
      try {
        const parsed = JSON.parse(savedCurrentChannel);
        setCurrentChannel(parsed);
      } catch {
        // 加载当前频道失败时忽略
      }
    }
  }, []);

  // 保存频道列表到本地存储
  const saveChannelsToStorage = (channelList: IPTVChannel[]) => {
    localStorage.setItem('iptv-channels', JSON.stringify(channelList));
  };

  // 处理频道选择
  const handleChannelSelect = (channel: IPTVChannel) => {
    setCurrentChannel(channel);
    localStorage.setItem('iptv-current-channel', JSON.stringify(channel));
    // 在移动端选择频道后隐藏频道列表
    if (window.innerWidth < 768) {
      setShowChannelList(false);
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = (channelId: string) => {
    const updatedChannels = channels.map(channel =>
      channel.id === channelId
        ? { ...channel, isFavorite: !channel.isFavorite }
        : channel
    );
    setChannels(updatedChannels);
    saveChannelsToStorage(updatedChannels);
  };

  // 解析M3U文件
  const parseM3U = (content: string): IPTVChannel[] => {
    const lines = content.split('\n');
    const channels: IPTVChannel[] = [];
    let currentChannel: Partial<IPTVChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // 解析频道信息
        const nameMatch = line.match(/,(.+)$/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        
        currentChannel = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: nameMatch ? nameMatch[1] : 'Unknown',
          group: groupMatch ? groupMatch[1] : '其他',
          logo: logoMatch ? logoMatch[1] : undefined,
        };
      } else if (line && !line.startsWith('#') && currentChannel.name) {
        // 这行是URL
        currentChannel.url = line;
        channels.push(currentChannel as IPTVChannel);
        currentChannel = {};
      }
    }

    return channels;
  };

  // 从URL加载M3U
  const loadFromM3U = async () => {
    if (!m3uUrl.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(m3uUrl);
      const content = await response.text();
      const parsedChannels = parseM3U(content);
      
      if (parsedChannels.length > 0) {
        setChannels(parsedChannels);
        saveChannelsToStorage(parsedChannels);
        alert(`成功加载 ${parsedChannels.length} 个频道`);
      } else {
        alert('M3U文件解析失败，请检查文件格式');
      }
    } catch {
      // 加载M3U失败
      alert('加载M3U文件失败，请检查URL是否正确');
    } finally {
      setIsLoading(false);
    }
  };

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedChannels = parseM3U(content);
      
      if (parsedChannels.length > 0) {
        setChannels(parsedChannels);
        saveChannelsToStorage(parsedChannels);
        alert(`成功导入 ${parsedChannels.length} 个频道`);
      } else {
        alert('文件解析失败，请检查M3U文件格式');
      }
    };
    reader.readAsText(file);
    
    // 清空文件输入
    event.target.value = '';
  };

  // 导出频道列表
  const exportChannels = () => {
    if (channels.length === 0) {
      alert('没有频道可导出');
      return;
    }

    let m3uContent = '#EXTM3U\n';
    channels.forEach(channel => {
      m3uContent += `#EXTINF:-1 tvg-name="${channel.name}"`;
      if (channel.group) m3uContent += ` group-title="${channel.group}"`;
      if (channel.logo) m3uContent += ` tvg-logo="${channel.logo}"`;
      m3uContent += `,${channel.name}\n${channel.url}\n`;
    });

    const blob = new Blob([m3uContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'katelyatv-channels.m3u';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Tv className="mr-2 text-purple-500" size={28} />
              IPTV 直播
            </h1>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChannelList(!showChannelList)}
              className="md:hidden bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              频道
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              {/* M3U URL 输入 */}
              <input
                type="url"
                placeholder="输入M3U播放列表URL..."
                value={m3uUrl}
                onChange={(e) => setM3uUrl(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm w-64"
              />
              
              <button
                onClick={loadFromM3U}
                disabled={isLoading || !m3uUrl.trim()}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm flex items-center"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin mr-1" /> : <Download size={16} className="mr-1" />}
                加载
              </button>

              {/* 文件上传 */}
              <label className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer text-sm flex items-center">
                <Upload size={16} className="mr-1" />
                导入
                <input
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* 导出按钮 */}
              <button
                onClick={exportChannels}
                className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm flex items-center"
              >
                <Download size={16} className="mr-1" />
                导出
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* 频道列表 */}
          <div className={`lg:col-span-1 ${showChannelList ? 'block' : 'hidden lg:block'}`}>
            <IPTVChannelList
              channels={channels}
              currentChannel={currentChannel}
              onChannelSelect={handleChannelSelect}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* 播放器 */}
          <div className={`lg:col-span-3 ${!showChannelList ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-black rounded-lg h-full min-h-[400px]">
              {currentChannel ? (
                <IPTVPlayer
                  channels={channels}
                  currentChannel={currentChannel}
                  onChannelChange={handleChannelSelect}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <Tv size={64} className="mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">请选择一个频道开始观看</h3>
                    <p className="text-gray-400">
                      从左侧频道列表中选择您想观看的频道
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 移动端操作面板 */}
        <div className="md:hidden mt-4 bg-white dark:bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">M3U 播放列表</h3>
          <div className="space-y-3">
            <input
              type="url"
              placeholder="输入M3U播放列表URL..."
              value={m3uUrl}
              onChange={(e) => setM3uUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            
            <div className="flex space-x-2">
              <button
                onClick={loadFromM3U}
                disabled={isLoading || !m3uUrl.trim()}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center justify-center"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin mr-1" /> : <Download size={16} className="mr-1" />}
                加载
              </button>
              
              <label className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center justify-center">
                <Upload size={16} className="mr-1" />
                导入
                <input
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={exportChannels}
                className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
              >
                <Download size={16} className="mr-1" />
                导出
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function IPTVPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">加载IPTV播放器...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    }>
      <IPTVPageContent />
    </Suspense>
  );
}