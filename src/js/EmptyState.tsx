import { styled } from 'styled-components';
import { Colors } from './constants';

const StyledDiv = styled.div`
  background-color: ${Colors.citrineLight};
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 4vw 3vw;

  @media (max-width: 900px) {
    padding: 6vw 4.5vw;
  }
  @media (max-width: 650px) {
    padding: 8vw 6vw;
  }
`;

export const EmptyState = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => (
  <StyledDiv>
    <h3 style={{ marginTop: 0, flexGrow: 1 }}>{title}</h3>
    <span>{body}</span>
  </StyledDiv>
);
