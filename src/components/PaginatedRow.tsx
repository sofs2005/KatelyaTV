'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

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
  const [currentPage, setCurrentPage] = useState(0);

  // 计算总页数
  const totalPages = Math.ceil(children.length / itemsPerPage);

  // 获取当前页的项目
  const currentItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return children.slice(startIndex, endIndex);
  }, [children, currentPage, itemsPerPage]);

  // 是否显示左右按钮
  const showLeftButton = currentPage > 0;
  const showRightButton = currentPage < totalPages - 1;

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 如果没有足够的内容需要分页，就不显示按钮
  const needsPagination = totalPages > 1;

  return (
    <div className={`relative group ${className}`}>
      {/* 内容区域 */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {currentItems}
      </div>

      {/* 左箭头按钮 */}
      {needsPagination && showLeftButton && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <div className='-translate-x-6'>
            <button
              onClick={handlePrevPage}
              className='w-12 h-12 bg-white/95 rounded-full shadow-lg flex items-center justify-center hover:bg-white border border-gray-200 transition-transform hover:scale-105 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600'
              aria-label='上一页'
            >
              <ChevronLeft className='w-6 h-6 text-gray-600 dark:text-gray-300' />
            </button>
          </div>
        </div>
      )}

      {/* 右箭头按钮 */}
      {needsPagination && showRightButton && (
        <div className='absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          <div className='translate-x-6'>
            <button
              onClick={handleNextPage}
              className='w-12 h-12 bg-white/95 rounded-full shadow-lg flex items-center justify-center hover:bg-white border border-gray-200 transition-transform hover:scale-105 dark:bg-gray-800/90 dark:hover:bg-gray-700 dark:border-gray-600'
              aria-label='下一页'
            >
              <ChevronRight className='w-6 h-6 text-gray-600 dark:text-gray-300' />
            </button>
          </div>
        </div>
      )}

      {/* 页码指示器 (可选) */}
      {needsPagination && (
        <div className='flex justify-center mt-4 space-x-2'>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage
                  ? 'bg-purple-500 dark:bg-purple-400'
                  : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
              }`}
              aria-label={`第 ${index + 1} 页`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
