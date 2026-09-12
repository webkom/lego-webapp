import { useCallback, useEffect, useState } from 'react';

const useCarousel = (count: number) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((current) => (current < count ? current : 0));
  }, [count]);

  const goTo = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  return {
    index,
    goTo,
    next: useCallback(() => goTo(index + 1), [goTo, index]),
    previous: useCallback(() => goTo(index - 1), [goTo, index]),
  };
};

export default useCarousel;
