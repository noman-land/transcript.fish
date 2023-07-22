import { useCallback, useEffect } from 'react';

export const EpisodeSearchFallback = ({ error }: { error: Error }) => {
  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  useEffect(() => {
    console.warn('Error boundary triggered:\n\n', error);
  }, [error]);

  return (
    <div className="text-center">
      <h3>Something went wrong.</h3>
      <div>
        Please <a onClick={reload}>reload page</a>.
      </div>
    </div>
  );
};
