import { useCallback, useEffect, useOptimistic, useRef, useState } from "react";

export type OptimisticListQueryResult<T> = {
  data: T[];
  error: string | null;
};

export type MergeOptimisticFn<T> = (state: T[], optimisticItem: T) => T[];

export type UseOptimisticListOptions<T> = {
  /** Loading list (Server Action, fetch ...) */
  queryFn: () => Promise<OptimisticListQueryResult<T>>;

  mergeOptimistic?: MergeOptimisticFn<T>;

  loadErrorMessage?: string;

  fetchOnMount?: boolean;
};

export type UseOptimisticListReturn<T> = {
  optimisticItems: T[];
  addOptimistic: (item: T) => void;
  appendItem: (item: T) => void;
  updateItems: (updater: (prev: T[]) => T[]) => void;
  reload: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const defaultMerge = <T>(state: T[], item: T) => [...state, item];

/**
 * Багаторазовий хук: список з сервера + useOptimistic + append після підтвердження.
 * `queryFn` можна передавати інлайн — всередині зберігається в ref, щоб уникнути зайвих перезапусків effect.
 */
export default function useOptimisticList<T>(
  options: UseOptimisticListOptions<T>,
): UseOptimisticListReturn<T> {
  const {
    queryFn,
    mergeOptimistic = defaultMerge,
    loadErrorMessage = "Failed to load",
    fetchOnMount = true,
  } = options;

  const runOnMount = fetchOnMount !== false;

  const queryRef = useRef(queryFn);
  queryRef.current = queryFn;

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(runOnMount);
  const [error, setError] = useState<string | null>(null);

  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    mergeOptimistic,
  );

  const appendItem = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const updateItems = useCallback((updater: (prev: T[]) => T[]) => {
    setItems(updater);
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: nextError } = await queryRef.current();
      setItems(data);
      setError(nextError);
    } catch {
      setItems([]);
      setError(loadErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadErrorMessage]);

  useEffect(() => {
    if (!runOnMount) return;
    reload();
  }, [runOnMount, reload]);

  return {
    optimisticItems,
    addOptimistic,
    appendItem,
    updateItems,
    reload,
    loading,
    error,
  };
}
