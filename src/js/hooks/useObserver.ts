import { useEffect, useRef, useState } from 'react';

const nArray = (n: number) => [...Array(n), 1].map((_, i) => i / n);

const options = {
  root: null,
  threshold: nArray(4),
};

export const useObserver = () => {
  const ref = useRef(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
    }, options);

    const { current } = ref;

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return {
    entry,
    ref,
  };
};
