import styled from 'styled-components';
import { ErrorBoundary } from './ErrorBoundary';
import { EpisodeSearch } from './EpisodesSearch';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  & header {
    padding: 32px 32px 0 32px;
  }

  & a {
    color: black;
  }

  header {
    display: flex;
    justify-content: end;
  }

  .app-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    .under-construction-banner {
      font-size: 0.8em;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5em;

      h2 {
        margin-left: 1vw;
        margin-right: 1vw;
      }
    }

    .nstaaf-logo {
      margin-bottom: 1.5em;
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
        <div className="under-construction-banner">
          <img width={50} src="/images/construction-sign.gif" />
          <h2>under construction</h2>
          <img width={50} src="/images/construction-sign.gif" />
        </div>
        <img className="nstaaf-logo" width={316} src="/images/logo.jpg" />
        <ErrorBoundary>
          <EpisodeSearch />
        </ErrorBoundary>
      </div>
    </Wrapper>
  );
};
