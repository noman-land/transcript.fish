import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { EpisodeRowProps } from './types';
import { EpisodeSummaryCell } from './EpisodeSummaryCell';
import { EpisodeTranscriptCell } from './EpisodeTranscriptCell';
import { makeEpisodeCoverUrl } from './utils';
import { Colors } from './constants';
import { useTranscript } from './database/dbHooks';

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

export const EpisodeRow = ({
  episode,
  expanded,
  searchTerm,
}: EpisodeRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { get: getTranscript, data: transcript } = useTranscript();

  const handleClick = useCallback(() => {
    setIsOpen(open => !open);
  }, []);

  const opened = isOpen || expanded;

  useEffect(() => {
    if (opened && !transcript) {
      getTranscript(episode.episode);
    }
  }, [transcript, episode.episode, getTranscript, opened]);

  return (
    <TrWithBackground
      $isOpen={opened}
      $image={makeEpisodeCoverUrl(episode.episode, episode.image)}
      key={episode.episode}
    >
      <EpisodeSummaryCell
        isOpen={opened}
        onClick={handleClick}
        episode={episode}
      />
      {opened && transcript && (
        <EpisodeTranscriptCell
          words={transcript}
          episode={episode.episode}
          searchTerm={searchTerm}
        />
      )}
    </TrWithBackground>
  );
};
