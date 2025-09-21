/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SelectorOption {
  label: string;
  value: string;
}

interface CustomCategory {
  name?: string;
  type: 'movie' | 'tv';
  query: string;
}

interface DoubanCustomSelectorProps {
  customCategories: CustomCategory[];
  primarySelection: string;
  secondarySelection: string;
  onPrimaryChange: (value: string) => void;
  onSecondaryChange: (value: string) => void;
}

const DoubanCustomSelector: React.FC<DoubanCustomSelectorProps> = ({
  customCategories,
  primarySelection,
  secondarySelection,
  onPrimaryChange,
  onSecondaryChange,
}) => {
  const primaryContainerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [primaryIndicatorStyle, setPrimaryIndicatorStyle] = useState({ left: 0, width: 0 });

  const secondaryContainerRef = useRef<HTMLDivElement>(null);
  const secondaryButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [secondaryIndicatorStyle, setSecondaryIndicatorStyle] = useState({ left: 0, width: 0 });

  const [primaryOptions, setPrimaryOptions] = useState<SelectorOption[]>([]);
  const [secondaryOptions, setSecondaryOptions] = useState<SelectorOption[]>([]);

  // 从 customCategories 生成一级和二级选项
  useEffect(() => {
    const types = Array.from(new Set(customCategories.map((cat) => cat.type)));
    setPrimaryOptions(
      types.map((type) => ({
        label: type === 'movie' ? '电影' : '剧集',
        value: type,
      }))
    );
  }, [customCategories]);

  // 实现二级联动
  useEffect(() => {
    if (primarySelection) {
      const queries = customCategories
        .filter((cat) => cat.type === primarySelection)
        .map((cat) => ({
          label: cat.name || cat.query,
          value: cat.query,
        }));
      setSecondaryOptions(queries);
    }
  }, [primarySelection, customCategories]);

  // 更新指示器位置的通用函数
  const updateIndicatorPosition = (
    activeIndex: number,
    containerRef: React.RefObject<HTMLDivElement>,
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>,
    setIndicatorStyle: React.Dispatch<React.SetStateAction<{ left: number; width: number }>>
  ) => {
    if (activeIndex >= 0 && buttonRefs.current[activeIndex] && containerRef.current) {
      const timeoutId = setTimeout(() => {
        const button = buttonRefs.current[activeIndex];
        const container = containerRef.current;
        if (button && container) {
          const buttonRect = button.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          if (buttonRect.width > 0) {
            setIndicatorStyle({
              left: buttonRect.left - containerRect.left,
              width: buttonRect.width,
            });
          }
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  };

  // 监听一级选择变化
  useEffect(() => {
    const activeIndex = primaryOptions.findIndex((opt) => opt.value === primarySelection);
    const cleanup = updateIndicatorPosition(
      activeIndex,
      primaryContainerRef,
      primaryButtonRefs,
      setPrimaryIndicatorStyle
    );
    return cleanup;
  }, [primarySelection, primaryOptions]);

  // 监听二级选择变化
  useEffect(() => {
    const activeIndex = secondaryOptions.findIndex((opt) => opt.value === secondarySelection);
    const cleanup = updateIndicatorPosition(
      activeIndex,
      secondaryContainerRef,
      secondaryButtonRefs,
      setSecondaryIndicatorStyle
    );
    // 当二级选项重置时，也需要重置指示器
    if (activeIndex < 0) {
      setSecondaryIndicatorStyle({ left: 0, width: 0 });
    }
    return cleanup;
  }, [secondarySelection, secondaryOptions]);

  // 渲染胶囊式选择器
  const renderCapsuleSelector = (
    options: SelectorOption[],
    activeValue: string | undefined,
    onChange: (value: string) => void,
    isPrimary = false
  ) => {
    const containerRef = isPrimary ? primaryContainerRef : secondaryContainerRef;
    const buttonRefs = isPrimary ? primaryButtonRefs : secondaryButtonRefs;
    const indicatorStyle = isPrimary ? primaryIndicatorStyle : secondaryIndicatorStyle;

    return (
      <div
        ref={containerRef}
        className='relative inline-flex bg-gray-200/60 rounded-full p-0.5 sm:p-1 dark:bg-gray-700/60 backdrop-blur-sm'
      >
        {indicatorStyle.width > 0 && (
          <div
            className='absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 bg-white dark:bg-gray-500 rounded-full shadow-sm transition-all duration-300 ease-out'
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        )}
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            onClick={() => onChange(option.value)}
            className={`relative z-10 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${activeValue === option.value
                ? 'text-gray-900 dark:text-gray-100 cursor-default'
                : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='space-y-3 sm:space-y-4'>
        {/* 一级选择器 */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
            类型
          </span>
          <div className='overflow-x-auto'>
            {renderCapsuleSelector(
              primaryOptions,
              primarySelection,
              onPrimaryChange,
              true
            )}
          </div>
        </div>

        {/* 二级选择器 */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[48px]'>
            分类
          </span>
          <div className='overflow-x-auto'>
            {renderCapsuleSelector(
              secondaryOptions,
              secondarySelection,
              onSecondaryChange,
              false
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubanCustomSelector;