'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { BackButton } from './BackButton';
import MobileBottomNav from './MobileBottomNav';
import MobileHeader from './MobileHeader';
import Sidebar from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

interface PageLayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

// 新的轻量级 Header 组件
const Header = () => {
  return (
    <header className='absolute top-0 right-0 z-20 p-4 hidden md:flex items-center gap-3'>
      <ThemeToggle />
      <UserMenu />
    </header>
  );
};

const PageLayout = ({ children, activePath = '/' }: PageLayoutProps) => {
  const pathname = usePathname();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  useEffect(() => {
    const setVh = () => {
      // 我们将视口高度的 1% 定义为一个 CSS 变量 --vh
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    window.addEventListener('resize', setVh);
    setVh(); // 初始设置

    return () => window.removeEventListener('resize', setVh);
  }, []);

  // 根据当前路径判断是否需要特殊布局（例如播放页面）
  const isSpecialLayout = ['/play'].includes(pathname);

  return (
    <div
      className='w-full bg-gray-50 dark:bg-gray-900'
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* 移动端头部 (fixed) */}
      <MobileHeader showBackButton={isSpecialLayout} />

      {/* 桌面端左侧导航栏 (fixed) */}
      <Sidebar onToggle={handleSidebarToggle} activePath={activePath} />

      {/* 主内容区域 */}
      <div
        data-collapsed={isSidebarCollapsed}
        className='relative min-w-0 transition-all duration-300 md:ml-64 data-[collapsed=true]:md:ml-16'
      >
        {/* 桌面端右上角 Header */}
        <Header />

        {/* 桌面端左上角返回按钮 (仅在特定页面显示) */}
        {isSpecialLayout && (
          <div className='absolute top-3 left-1 z-20 hidden md:flex'>
            <BackButton />
          </div>
        )}

        {/* 主内容容器 */}
        <main
          className='mb-14 md:mb-0 p-4 sm:p-6 lg:p-8'
          style={{
            paddingBottom: 'calc(3.5rem + env(safe-area-inset-bottom))',
          }}
        >
          {/* 增加一个容器来约束内容的最大宽度，但允许背景铺满 */}
          <div className='w-full max-w-screen-2xl mx-auto'>
            {children}
          </div>
        </main>
      </div>

      {/* 移动端底部导航 */}
      <div className='md:hidden'>
        <MobileBottomNav activePath={activePath} />
      </div>
    </div>
  );
};

export default PageLayout;
