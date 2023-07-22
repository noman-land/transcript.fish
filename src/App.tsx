import styled from 'styled-components';
import { ErrorBoundary } from './ErrorBoundary';
import { EpisodeSearch } from './EpisodesSearch';
import { UnderConstructionBanner } from './UnderConstructionBanner';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;

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

    @media (max-width: 400px) {
      h1 {
        font-size: 1.8em;
      }

      h2 {
        font-size: 1.4em;
      }
    }

    @media (max-width: 360px) {
      h1 {
        font-size: 1.6em;
      }

      h2 {
        font-size: 1.2em;
      }
    }

    @media (max-width: 320px) {
      h1 {
        font-size: 1.4em;
      }

      h2 {
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
          <img width={32} src="/images/github-logo.png" />
        </a>
      </header>
      <div className="app-body">
        <h1>transcript.fish</h1>
        <UnderConstructionBanner />
        <img className="nstaaf-logo" src="/images/logo.jpg" />
        <ErrorBoundary>
          <EpisodeSearch />
        </ErrorBoundary>
      </div>
    </Wrapper>
  );
};
