import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { EpisodeRowProps } from './types';
import { EpisodeSummaryCell } from './EpisodeSummaryCell';
import { EpisodeTranscriptCell } from './EpisodeTranscriptCell';
import { useDb } from './dbHooks';
import { makeEpisodeCoverUrl } from './utils';
import { Colors } from './constants';

const StyledTr = styled.tr<{ $isOpen: boolean }>`
  background-color: ${({ $isOpen }) => $isOpen && Colors.cirtineWhite};
  display: block;
  position: relative;
  z-index: 0;

  &:not(:last-child) {
    border-bottom: 2px solid ${Colors.citrineDim};
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
    transcript: { get: getTranscript, data: transcript },
  } = useDb();

  const handleClick = useCallback(() => {
    if (!transcript) {
      getTranscript(episode.episode);
    }

    setIsOpen(open => !open);
  }, [episode, transcript, getTranscript]);

  return (
    <TrWithBackground
      $isOpen={isOpen}
      $image={makeEpisodeCoverUrl(episode.episode, episode.image)}
      key={episode.episode}
    >
      <EpisodeSummaryCell
        isOpen={isOpen}
        onClick={handleClick}
        episode={episode}
      />
      {isOpen && transcript && (
        <EpisodeTranscriptCell words={transcript} episode={episode.episode} />
      )}
    </TrWithBackground>
  );
};
