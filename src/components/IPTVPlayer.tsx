'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize, Pause, Play, Settings, Volume2, VolumeX } from 'lucide-react';

interface IPTVChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

interface IPTVPlayerProps {
  channels: IPTVChannel[];
  currentChannel?: IPTVChannel;
  onChannelChange?: (channel: IPTVChannel) => void;
}

export function IPTVPlayer({ channels: _channels, currentChannel, onChannelChange: _onChannelChange }: IPTVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentChannel) return;

    setIsLoading(true);
    setError(null);

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      if (isPlaying) {
        video.play().catch(() => {
          // 忽略播放错误
        });
      }
    };
    const handleError = () => {
      setIsLoading(false);
      setError('无法加载频道，请检查网络连接或尝试其他频道');
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // 加载新频道
    video.src = currentChannel.url;
    video.load();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentChannel, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {
        // 忽略播放错误
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen().catch(() => {
        // 忽略全屏错误
      });
    }
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // 按组分类频道（暂未使用，为未来功能预留）
  // const groupedChannels = _channels.reduce((acc, channel) => {
  //   const group = channel.group || '其他';
  //   if (!acc[group]) acc[group] = [];
  //   acc[group].push(channel);
  //   return acc;
  // }, {} as Record<string, IPTVChannel[]>);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      {/* 视频播放器 */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        onMouseMove={resetControlsTimeout}
        onTouchStart={resetControlsTimeout}
      />

      {/* 加载指示器 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex items-center space-x-3 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>加载中...</span>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white p-6">
            <div className="mb-4">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* 控制栏 */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center space-x-4">
          {/* 播放/暂停 */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-purple-400 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* 音量控制 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* 频道信息 */}
          <div className="flex-1 text-white">
            <div className="text-sm opacity-80">正在播放</div>
            <div className="font-medium">{currentChannel?.name || '未选择频道'}</div>
          </div>

          {/* 全屏 */}
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-purple-400 transition-colors"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>

      {/* 频道列表 */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <button className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors">
            <Settings size={20} />
          </button>
          
          {/* 这里可以添加频道选择下拉菜单 */}
        </div>
      </div>
    </div>
  );
}

export default IPTVPlayer;
