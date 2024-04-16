import { mediaUrl } from './utils';

export const Header = () => {
  return (
    <header>
      <a href="https://github.com/noman-land/transcript.fish">
        <img width={32} src={mediaUrl.images('github-logo.png')} />
      </a>
    </header>
  );
};
