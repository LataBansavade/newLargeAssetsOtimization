import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import type { ReactElement } from 'react';
import { quotesData } from './namesData';

const ITEMS_PER_PAGE = 15;
const QUOTE_HEIGHT = 200; 

// Memoized Quote Card Component
const QuoteCard = memo(({ quote }: { quote: typeof quotesData[0] }) => (
  <div 
    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    style={{ height: '100%' }}
  >
    <h2 className="text-xl font-semibold text-indigo-600 mb-2 line-clamp-2">{quote.title}</h2>
    <p className="text-gray-700 italic line-clamp-4">"{quote.quote}"</p>
    <div className="mt-4 text-xs text-gray-500">
      Quote #{quote.id}
    </div>
  </div>
));

// Virtualized List Component
interface VirtualizedListProps {
  items: typeof quotesData;
  itemHeight: number;
  renderItem: (item: typeof quotesData[0]) => ReactElement;
}

const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items,
  itemHeight,
  renderItem
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;  
    
    const updateVisibleRange = () => {
      if (!containerRef.current) return;
      const { scrollTop, clientHeight } = containerRef.current;
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
      const end = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + clientHeight) / itemHeight) + 5
      );
      setVisibleRange({ start, end });
    };

    setContainerHeight(items.length * itemHeight);
    updateVisibleRange();

    const currentRef = containerRef.current;
    currentRef.addEventListener('scroll', updateVisibleRange);
    window.addEventListener('resize', updateVisibleRange);

    return () => {
      currentRef.removeEventListener('scroll', updateVisibleRange);
      window.removeEventListener('resize', updateVisibleRange);
    };
  }, [items.length, itemHeight]);

  return (
    <div 
      ref={containerRef}
      className="overflow-y-auto"
      style={{ height: '70vh' }}
    >
      <div style={{ height: `${containerHeight}px`, position: 'relative' }}>
        {items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: `${(visibleRange.start + index) * itemHeight}px`,
              width: '100%',
              padding: '0.5rem',
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

const Quotes: React.FC = () => {
  const [visibleQuotes, setVisibleQuotes] = useState<typeof quotesData>([]);
  const [page, setPage] = useState(1);
  const loader = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const loadMoreQuotes = useCallback(() => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    
    // Use requestAnimationFrame to prevent UI blocking
    requestAnimationFrame(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      if (startIndex >= quotesData.length) {
        setHasMore(false);
        loadingRef.current = false;
        return;
      }

      const newQuotes = quotesData.slice(0, endIndex);
      setVisibleQuotes(newQuotes);
      
      if (endIndex >= quotesData.length) {
        setHasMore(false);
      } else {
        setPage(prevPage => prevPage + 1);
      }
      
      loadingRef.current = false;
    });
  }, [page]);

  // Initial load
  useEffect(() => {
    loadMoreQuotes();
  }, []);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target?.isIntersecting && hasMore) {
          loadMoreQuotes();
        }
      },
      { 
        root: null,
        rootMargin: '100px',
        threshold: 0.1 
      }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreQuotes, hasMore]);

  // Memoize the rendered items to prevent unnecessary re-renders
  const renderedQuotes = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleQuotes.map((quote: typeof quotesData[0]) => (
        <QuoteCard key={quote.id} quote={quote} />
      ))}
    </div>
  ), [visibleQuotes]);

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-400 mb-12">
          Inspirational Quotes
        </h1>
        
        {/* Use VirtualizedList for large screens */}
        <div className="hidden lg:block">
          <VirtualizedList 
            items={visibleQuotes}
            itemHeight={QUOTE_HEIGHT}
            renderItem={(quote) => <QuoteCard quote={quote} />}
          />
        </div>
        
        {/* Fallback for mobile/tablet */}
        <div className="lg:hidden">
          {renderedQuotes}
        </div>
        
        {hasMore && (
          <div 
            ref={loader} 
            className="h-10 flex items-center justify-center py-8"
          >
            <div className="animate-pulse text-gray-500">Loading more quotes...</div>
          </div>
        )}
        
        {!hasMore && visibleQuotes.length > 0 && (
          <div className="text-center text-gray-400 py-4">
            No more quotes to load
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;