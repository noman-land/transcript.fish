import { Episodes } from "./Episodes";
import styled from "styled-components";
import { ErrorBoundary } from "./ErrorBoundary";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  header {
    height: 32px;
    display: flex;
    justify-content: end;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const StyledBackground = styled.div`
  background-color: #f8e44f;
  table {
    border-spacing: 0;

    td {
      padding: 6px;
    }
    tr:hover {
      background-color: #fff189;
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
            src="https://logos-download.com/wp-content/uploads/2016/09/GitHub_logo.png"
          />
        </a>
      </header>
      <div className="content">
        <h1>transcript.fish</h1>
        <h2>coming soon</h2>
        <img
          width={316}
          src="https://upload.wikimedia.org/wikipedia/en/e/e1/No_Such_Thing_As_A_Fish_logo.jpg"
        />
        <ErrorBoundary>
          <StyledBackground>
            <Episodes />
          </StyledBackground>
        </ErrorBoundary>
      </div>
    </Wrapper>
  );
};
