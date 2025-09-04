'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, useMemo, useState } from 'react';

interface PaginatedRowProps {
  children: React.ReactNode[];
  itemsPerPage?: number;
  className?: string;
}

export default function PaginatedRow({
  children,
  itemsPerPage = 10,
  className = '',
}: PaginatedRowProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const uniqueId = useId(); // 为每个实例生成唯一ID

  // 获取当前显示的项目 - 支持无限向前浏览
  const currentItems = useMemo(() => {
    const endIndex = startIndex + itemsPerPage;
    // 如果超出范围，循环显示
    if (endIndex <= children.length) {
      return children.slice(startIndex, endIndex);
    } else {
      // 当超出范围时，从头开始循环
      const firstPart = children.slice(startIndex);
      const secondPart = children.slice(0, endIndex - children.length);
      return [...firstPart, ...secondPart];
    }
  }, [children, startIndex, itemsPerPage]);

  // 向前翻页 - 只有不在第一页时才能向前
  const handlePrevPage = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => Math.max(0, prev - itemsPerPage));
    }
  };

  // 向后翻页 - 支持无限浏览，到达末尾时循环到开头
  const handleNextPage = () => {
    setStartIndex((prev) => {
      const newIndex = prev + itemsPerPage;
      // 当超出总长度时，从头开始，实现无限循环
      return newIndex >= children.length ? 0 : newIndex;
    });
  };

  // 检查是否可以向前翻页
  const canGoPrev = startIndex > 0;
  // 检查是否需要显示翻页按钮
  const needsPagination = children.length > itemsPerPage;

  return (
    <div
      className={`relative ${className}`}
      data-paginated-row={uniqueId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 内容区域 - 移除group类以避免悬停效果冲突 */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative'>
        {currentItems}

        {/* 改进的导航按钮 - 仅在容器悬停时显示 */}
        {needsPagination && (
          <>
            {/* 左箭头按钮 - 只有不在第一页时才显示 */}
            {canGoPrev && (
              <button
                onClick={handlePrevPage}
                className={`absolute -left-12 z-20 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  // 确保按钮在两行中间
                  top: 'calc(50% - 20px)',
                }}
                aria-label='上一页'
              >
                <ChevronLeft className='w-5 h-5 text-white' />
              </button>
            )}

            {/* 右箭头按钮 - 始终显示 */}
            <button
              onClick={handleNextPage}
              className={`absolute -right-12 z-20 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                // 确保按钮在两行中间
                top: 'calc(50% - 20px)',
              }}
              aria-label='下一页'
            >
              <ChevronRight className='w-5 h-5 text-white' />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
