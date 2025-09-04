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
  const [currentPage, setCurrentPage] = useState(0);
  const uniqueId = useId(); // 为每个实例生成唯一ID

  // 计算总页数
  const totalPages = Math.ceil(children.length / itemsPerPage);

  // 获取当前页的项目
  const currentItems = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return children.slice(startIndex, endIndex);
  }, [children, currentPage, itemsPerPage]);

  // 无限循环翻页
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  // 如果没有足够的内容需要分页，就不显示按钮
  const needsPagination = totalPages > 1;

  return (
    <div
      className={`relative group ${className}`}
      data-paginated-row={uniqueId}
    >
      {/* 内容区域 */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative'>
        {currentItems}

        {/* 改进的导航按钮 - 放在网格中间位置 */}
        {needsPagination && (
          <>
            {/* 左箭头按钮 - 精确定位在两行中间 */}
            <button
              onClick={handlePrevPage}
              className='absolute -left-12 z-20 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 opacity-0 group-hover:opacity-100'
              style={{
                // 确保按钮在两行中间
                top: 'calc(50% - 20px)',
              }}
              aria-label='上一页'
            >
              <ChevronLeft className='w-5 h-5 text-white' />
            </button>

            {/* 右箭头按钮 - 精确定位在两行中间 */}
            <button
              onClick={handleNextPage}
              className='absolute -right-12 z-20 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 opacity-0 group-hover:opacity-100'
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

      {/* 优化的页码指示器 */}
      {needsPagination && (
        <div className='flex justify-center mt-4 space-x-2'>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPage
                  ? 'bg-purple-500 dark:bg-purple-400 scale-125'
                  : 'bg-gray-300 hover:bg-purple-300 dark:bg-gray-600 dark:hover:bg-purple-500 hover:scale-110'
              }`}
              aria-label={`第 ${index + 1} 页`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
