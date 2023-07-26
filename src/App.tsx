import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { EpisodeSearch } from './EpisodesSearch';
import { UnderConstructionBanner } from './UnderConstructionBanner';
import { EpisodeSearchFallback } from './EpisodeSearchFallback';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  & header {
    display: flex;
    justify-content: end;
    padding: 32px 32px 0 32px;
  }

  & a {
    color: black;
  }

  .app-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      @media (max-width: 400px) {
        font-size: 1.8em;
      }
      @media (max-width: 360px) {
        font-size: 1.6em;
      }
      @media (max-width: 320px) {
        font-size: 1.4em;
      }
    }

    h2 {
      @media (max-width: 400px) {
        font-size: 1.4em;
      }
      @media (max-width: 360px) {
        font-size: 1.2em;
      }
      @media (max-width: 320px) {
        font-size: 1em;
      }
    }

    .nstaaf-logo {
      margin-bottom: 1.5em;
      width: 80%;
      max-width: 316px;
    }
  }
`;

export const App = () => {
  return (
    <Wrapper>
      <header>
        <a href="https://github.com/noman-land/transcript.fish">
          <img
            width={32}
            src="https://media.transcript.fish/images/github-logo.png"
          />
        </a>
      </header>
      <div className="app-body">
        <h1>transcript.fish</h1>
        <UnderConstructionBanner />
        <img
          className="nstaaf-logo"
          src="https://media.transcript.fish/images/logo.jpg"
        />
        <ErrorBoundary FallbackComponent={EpisodeSearchFallback}>
          <EpisodeSearch />
        </ErrorBoundary>
      </div>
    </Wrapper>
  );
};
