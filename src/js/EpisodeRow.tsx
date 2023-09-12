import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { EpisodeRowProps } from './types';
import { EpisodeSummaryCell } from './EpisodeSummaryCell';
import { EpisodeTranscriptCell } from './EpisodeTranscriptCell';
import { useDb } from './dbHooks';
import { makeImageUrl } from './utils';

const StyledTr = styled.tr<{ $isOpen: boolean }>`
  background-color: ${({ $isOpen }) => $isOpen && '#fff189'};
  display: block;
  position: relative;
  z-index: 0;

  &:not(:last-child) {
    border-bottom: 2px solid #d2bb3d;
  }

  &::after {
    content: ' ';
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
    width: 100%;
    opacity: 0.08;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
`;

const TrWithBackground = styled(StyledTr)<{ $image: string }>`
  &::after {
    background-image: url(${({ $image }) => $image});
  }
`;

export const EpisodeRow = ({ episode }: EpisodeRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    transcript: { get: getTranscript, data },
  } = useDb();

  const handleClick = useCallback(() => {
    if (!data) {
      getTranscript(episode.episode);
    }

    setIsOpen(open => !open);
  }, [episode, data, getTranscript]);

  return (
    <TrWithBackground
      $isOpen={isOpen}
      $image={makeImageUrl(episode.episode, episode.image)}
      key={episode.episode}
    >
      <EpisodeSummaryCell
        isOpen={isOpen}
        onClick={handleClick}
        episode={episode}
      />
      {isOpen && data && <EpisodeTranscriptCell words={data} />}
    </TrWithBackground>
  );
};
