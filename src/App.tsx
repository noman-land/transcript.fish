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
`;

export const App = () => {
  return (
    <Wrapper>
      <header>
        <a href="https://github.com/noman-land/transcript.fish">
          <img width={32} src="/images/github-logo.png" />
        </a>
      </header>
      <div>
        <h1>transcript.fish</h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
          }}
        >
          <img width={72} src="/images/construction-sign.gif" />
          <h2 style={{ marginLeft: '1vw', marginRight: '1vw' }}>
            under construction
          </h2>
          <img width={72} src="/images/construction-sign.gif" />
        </div>

        <img style={{ marginBottom: 32 }} width={316} src="/images/logo.jpg" />
        <ErrorBoundary>
          <EpisodeSearch />
        </ErrorBoundary>
      </div>
    </Wrapper>
  );
};
