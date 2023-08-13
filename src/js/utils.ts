export const mediaUrl = () => {
  const url = new URL(import.meta.url);
  return url.hostname === 'localhost'
    ? url.origin
    : 'https://media.transcript.fish';
};
