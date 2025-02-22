import { useEffect, useMemo, useState } from "react";

function useAsyncMemo<T>(
  asyncFunction: () => Promise<T>,
  deps: any[],
  initialValue?: T,
) {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    asyncFunction()
      .then((result) => {
        if (isMounted) setValue(result);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return useMemo(() => ({ value, loading, error }), [value, loading, error]);
}

export default useAsyncMemo;
