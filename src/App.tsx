import styled from "styled-components";
import { ErrorBoundary } from "./ErrorBoundary";
import { EpisodeSearch } from "./EpisodesSearch";

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
          <img
            width={32}
            src="https://logos-download.com/wp-content/uploads/2016/09/GitHub_logo.png"
          />
        </a>
      </header>
      <div>
        <h1>transcript.fish</h1>
        <h2>coming soon</h2>
        <img
          style={{ marginBottom: 32 }}
          width={316}
          src="https://upload.wikimedia.org/wikipedia/en/e/e1/No_Such_Thing_As_A_Fish_logo.jpg"
        />
        <ErrorBoundary>
          <EpisodeSearch />
        </ErrorBoundary>
      </div>
    </Wrapper>
  );
};
