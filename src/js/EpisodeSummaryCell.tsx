import styled from 'styled-components';
import { Tag, TagWrapper } from './Tag';
import { EpisodeSummaryCellProps } from './types';
import { Hosts } from './Hosts';
import { Separator } from './Separator';
import { formatDate, formatDuration, stopPropagation } from './utils';

const TitleWrapper = styled.div`
  display: flex;

  @media (max-width: 700px) {
    flex-direction: column-reverse;
  }
`;

const Title = styled.h3`
  margin-top: 0;
  margin-right: 1em;
  flex-grow: 1;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 700px) {
    margin-right: 0;
  }
`;

const PublishedDate = styled.div`
  font-style: italic;
  margin-bottom: 1em;
`;

const Description = styled.span`
  text-align: justify;

  a {
    word-break: break-all;
  }

  // Some descriptions end in <br> tags
  // which add unwanted line breaks
  & > :last-child > br:last-child {
    display: none;
  }

  // Some descriptions are wrapped in a <p>
  // which adds unwanted margin
  & > p {
    margin: 0;
  }
`;

const Duration = styled.span`
  font-style: italic;
  margin-top: 1em;
`;

const StyledTd = styled.td<{ $isOpen: boolean }>`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  padding: 4vw 3vw ${({ $isOpen }) => ($isOpen ? 0 : 4)}vw 3vw;

  @media (max-width: 900px) {
    padding: 6vw 4.5vw ${({ $isOpen }) => ($isOpen ? 0 : 6)}vw 4.5vw;
  }
  @media (max-width: 650px) {
    padding: 8vw 6vw ${({ $isOpen }) => ($isOpen ? 0 : 8)}vw 6vw;
  }

  &:hover {
    background-color: #fff189;

    & + td {
      background-color: #fff189;
    }
  }
`;

export const EpisodeSummaryCell = ({
  isOpen,
  onClick,
  episode: {
    episode: episodeNum,
    duration,
    title,
    live,
    compilation,
    pubDate,
    description,
    presenter1,
    presenter2,
    presenter3,
    presenter4,
  },
}: EpisodeSummaryCellProps) => {
  const presenters = [presenter1, presenter2, presenter3, presenter4];
  return (
    <StyledTd $isOpen={isOpen} onClick={onClick}>
      <TitleWrapper>
        <Title>
          <span>{episodeNum}</span>: {title}
        </Title>
        <TagWrapper>
          {!!live && <Tag>Live</Tag>}
          {!!compilation && <Tag>Compilation</Tag>}
        </TagWrapper>
      </TitleWrapper>
      <PublishedDate>{formatDate(pubDate)}</PublishedDate>
      <Description
        onClick={stopPropagation}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <Hosts $presenters={presenters} />
      <Duration>{formatDuration(duration)}</Duration>
      {isOpen && <Separator />}
    </StyledTd>
  );
};
