import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { Episode } from './types';
import { EpisodeSummaryCell } from './EpisodeSummaryCell';
import { EpisodeTranscriptCell } from './EpisodeTranscriptCell';
import { useDb } from './dbHooks';
import { mediaUrl } from './utils';

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

const makeImageUrl = (episode: number, imageUrl: string) => {
  const extension = imageUrl.split('.').pop();
  return extension
    ? `${mediaUrl()}/images/episodes/${episode}.${extension}`
    : '';
};

interface EpisodeRowProps {
  episode: Episode;
}

export const EpisodeRow = ({
  episode: {
    image,
    episode,
    title,
    description,
    pubDate,
    duration,
    live,
    compilation,
  },
}: EpisodeRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { episodeWords, getEpisode } = useDb();

  const handleClick = useCallback(() => {
    if (!episodeWords) {
      getEpisode(episode);
    }

    setIsOpen(open => !open);
  }, [episode, episodeWords, getEpisode]);

  return (
    <TrWithBackground
      $isOpen={isOpen}
      $image={makeImageUrl(episode, image)}
      key={episode}
    >
      <EpisodeSummaryCell
        isOpen={isOpen}
        onClick={handleClick}
        episodeNum={episode}
        title={title}
        description={description}
        pubDate={pubDate}
        duration={duration}
        live={Boolean(live)}
        compilation={Boolean(compilation)}
      />
      {isOpen && episodeWords && <EpisodeTranscriptCell words={episodeWords} />}
    </TrWithBackground>
  );
};
