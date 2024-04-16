import { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { Tags } from './Tags';
import { EpisodeSummaryCellProps } from './types';
import { Hosts } from './Hosts';
import { Separator } from './Separator';
import { formatDate, formatVenueName, stopPropagation } from './utils';
import { AudioControls } from './audio/AudioControls';
import { DatabaseContext } from './database/DatabaseProvider';

const StyledTd = styled.td<{ $isOpen: boolean }>`
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
`;

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

  a {
    display: inline-block;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 700px) {
    margin-right: 0;
  }
`;

const Description = styled.span`
  text-align: justify;
  margin-top: 1em;

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
    venue,
    presenter1,
    presenter2,
    presenter3,
    presenter4,
  },
}: EpisodeSummaryCellProps) => {
  const presenters = useMemo(
    () => [presenter1, presenter2, presenter3, presenter4],
    [presenter1, presenter2, presenter3, presenter4]
  );
  const {
    venues: { data: venues },
  } = useContext(DatabaseContext);

  const venueText = venues && !!venue && formatVenueName(venues[venue]);

  return (
    <StyledTd $isOpen={isOpen}>
      <TitleWrapper>
        <Title>
          <a onClick={onClick}>
            {episodeNum}: {title}
          </a>
        </Title>
        <Tags live={live} compilation={compilation} />
      </TitleWrapper>
      <div>{formatDate(pubDate)}</div>
      <div>{venueText}</div>
      <Hosts $presenters={presenters} />
      <Description
        onClick={stopPropagation}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <AudioControls episodeNum={episodeNum} duration={duration} />
      {isOpen && <Separator />}
    </StyledTd>
  );
};
