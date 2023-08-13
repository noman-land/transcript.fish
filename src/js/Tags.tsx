import { styled } from 'styled-components';

export const TagWrapper = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
`;

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

export const Tags = ({
  live,
  compilation,
}: {
  live: number;
  compilation: number;
}) => {
  const isLive = !!live;
  const isComp = !!compilation;
  return (
    (isLive || isComp) && (
      <TagWrapper>
        {isLive && <Tag>Live</Tag>}
        {isComp && <Tag>Compilation</Tag>}
      </TagWrapper>
    )
  );
};
