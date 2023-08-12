import { styled } from 'styled-components';

export const Tag = styled.span`
  background: black;
  color: white;
  padding: 0.3rem 0.5rem;
  margin-bottom: 0.8em;
  border-radius: 2px;

  & + & {
    margin-left: 0.8em;
  }
`;

export const TagWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
`;
