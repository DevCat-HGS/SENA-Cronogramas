import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseInfiniteScrollProps<T> {
  fetchNextPage: () => Promise<T[]>;
  hasNextPage: boolean;
}

export function useInfiniteScroll<T>({
  fetchNextPage,
  hasNextPage,
}: UseInfiniteScrollProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const entry = useIntersectionObserver(loadMoreRef, {});
  const isVisible = !!entry?.isIntersecting;

  useEffect(() => {
    if (isVisible && hasNextPage && !isLoading) {
      setIsLoading(true);
      fetchNextPage()
        .then((newItems) => {
          setItems((prev) => [...prev, ...newItems]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isVisible, hasNextPage, fetchNextPage, isLoading]);

  return {
    items,
    isLoading,
    loadMoreRef,
  };
} 