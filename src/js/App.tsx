import styled from 'styled-components';
import { Outlet } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { UnderConstructionBanner } from './UnderConstructionBanner';
import { EpisodeSearchFallback } from './EpisodeSearchFallback';
import { mediaUrl } from './utils';
import { AudioContextProvider } from './audio/AudioContextProvider';
import { Colors } from './constants';
import { FiltersContextProvider } from './filters/FiltersContextProvider';
import { DatabaseContextProvider } from './database/DatabaseContextProvider';
import { Header } from './Header';

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
    color: ${Colors.night};
  }

  .app-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      @media (max-width: 400px) {
        font-size: 9.5vw;
      }
    }

    h2 {
      @media (max-width: 400px) {
        font-size: 5.7vw;
      }
    }

    .logo {
      margin-bottom: 1.5em;
      width: 80%;
      max-width: 316px;
    }
  }
`;

export const App = () => {
  return (
    <Wrapper>
      <DatabaseContextProvider>
        <AudioContextProvider>
          <>
            <Header />
            <div className="app-body">
              <h1>transcript.fish</h1>
              <UnderConstructionBanner />
              <img className="logo" src={mediaUrl.images('logo-transparent.png')} />
              <ErrorBoundary FallbackComponent={EpisodeSearchFallback}>
                <FiltersContextProvider>
                  <Outlet />
                </FiltersContextProvider>
              </ErrorBoundary>
            </div>
          </>
        </AudioContextProvider>
      </DatabaseContextProvider>
    </Wrapper>
  );
};
