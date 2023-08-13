import { styled } from 'styled-components';

export const SearchBar = styled.input`
  background: #efe284;
  border: 0;
  font-family: TTE, 'Courier New', Courier, monospace;
  padding: 1em 3vw;
  font-size: 1em;

  @media (max-width: 900px) {
    padding: 1em 4.5vw;
  }
  @media (max-width: 650px) {
    padding: 1em 6vw;
  }

  &:focus {
    outline: 2px solid #d2bb3d;
  }
`;
