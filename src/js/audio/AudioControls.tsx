import { MouseEventHandler, useContext } from 'react';
import styled, { css } from 'styled-components';
import { AudioContext } from './AudioContext';
import { formatDuration, formatTimestamp, mediaUrl } from '../utils';
import { Colors } from '../constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1em;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  position: relative;
  width: 3rem;
  height: 3rem;
  border: 1px solid ${Colors.night};
  border-radius: 50%;
`;

const Button = styled.button`
  cursor: pointer;
  color: ${Colors.night};
  font-size: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: none;
  border: none;
  background: none;
  width: 100%;
  padding: 0;
  margin: 0;
  height: 100%;
`;

const DurationWrapper = styled.span`
  display: flex;
  margin-left: 1.2rem;
  flex-grow: 1;
  align-items: center;
`;

const Timeline = styled.span<{
  $grow?: number;
  $unplayed?: boolean;
  $ended?: boolean;
}>`
  flex-grow: ${({ $grow = 1 }) => $grow};
  height: 1.4rem;
  cursor: pointer;
  border: none;
  margin: 0;
  color: ${Colors.white};
  display: flex;
  background: ${Colors.night};
  justify-content: flex-end;
  position: relative;
  border-right: 4px solid ${Colors.dimWhite};

  ${({ $ended }) =>
    $ended &&
    css`
      border: none;
    `}

  ${({ $unplayed = false }) =>
    $unplayed &&
    css`
      justify-content: flex-start;
      background-image: radial-gradient(${Colors.night} 1px, ${Colors.citrineDark} 1.5px);
      background-size: 5px 5px;
      border: none;
      margin-right: 1rem;
    `};
`;

const CurrentTime = styled.span.attrs({
  className: 'bold',
})`
  height: 1.4rem;
  display: flex;
  align-items: center;
  padding: 0 0.6rem;
  position: absolute;
`;

const Icon = styled.img`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66%;

  &[src*='play.'] {
    position: relative;
    left: 4px;
  }
`;

const PlayIcon = () => <Icon alt="play icon" src={mediaUrl.images('icons/play.svg')} />;

const PauseIcon = () => <Icon alt="pause icon" src={mediaUrl.images('icons/pause.svg')} />;

interface AudioTimelineProps {
  onSkipBack: MouseEventHandler<HTMLSpanElement>;
  onSkipForward: MouseEventHandler<HTMLSpanElement>;
  duration: number;
  currentTime: number;
  ended: boolean;
}

const AudioTimeline = ({
  onSkipBack,
  onSkipForward,
  duration,
  currentTime,
  ended,
}: AudioTimelineProps) => {
  const timeLeft = duration - currentTime;
  const halfwayDone = Boolean(Math.round(currentTime / duration));
  return (
    <>
      <Timeline onClick={onSkipBack} $grow={currentTime} $ended={ended}>
        {halfwayDone && !ended && <CurrentTime>{formatTimestamp(currentTime)}</CurrentTime>}
      </Timeline>
      <Timeline onClick={onSkipForward} $grow={timeLeft} $unplayed={true}>
        {!halfwayDone && <CurrentTime>{formatTimestamp(currentTime)}</CurrentTime>}
      </Timeline>
      {formatTimestamp(duration)}
    </>
  );
};

interface AudioControlsProps {
  episodeNum: number;
  duration: number;
}

export const AudioControls = ({ episodeNum, duration }: AudioControlsProps) => {
  const { isPlaying, playPause, currentTime, playingEpisode, seek, ended } =
    useContext(AudioContext);

  const handleSkipBack: MouseEventHandler<HTMLSpanElement> = ({ clientX, currentTarget }) => {
    const { left, width } = currentTarget.getBoundingClientRect();
    const newTime = ((clientX - left) / width) * currentTime;
    seek(newTime);
  };

  const handleSkipForward: MouseEventHandler<HTMLSpanElement> = ({ clientX, currentTarget }) => {
    const { left, width } = currentTarget.getBoundingClientRect();
    const newTime = ((clientX - left) / width) * (duration - currentTime);
    seek(currentTime + newTime);
  };

  return (
    <Wrapper>
      <ButtonWrapper>
        <Button onClick={() => playPause(episodeNum)}>
          {isPlaying(episodeNum) ? <PauseIcon /> : <PlayIcon />}
        </Button>
      </ButtonWrapper>
      <DurationWrapper>
        {playingEpisode === episodeNum ? (
          <AudioTimeline
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            duration={duration}
            currentTime={currentTime}
            ended={ended}
          />
        ) : (
          formatDuration(duration)
        )}
      </DurationWrapper>
    </Wrapper>
  );
};
