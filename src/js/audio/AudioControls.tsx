import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { AudioContext } from './AudioContext';
import { formatDuration, formatTimestamp } from '../utils';
import { Colors } from '../constants';

const icons = {
  play: '⏵',
  pause: '⏸',
};

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
  border: 1px solid black;
  border-radius: 50%;
`;

const Button = styled.button`
  cursor: pointer;
  font-size: 3.2rem;
  display: block;
  position: relative;
  box-shadow: none;
  border: none;
  background: none;
  width: 100%;
  padding: 0;
  margin: 0;
  height: 100%;
`;

const PlayIcon = styled.span.attrs({ children: icons.play })`
  position: relative;
  left: 0.1rem;
  bottom: 0.5rem;
`;

const PauseIcon = styled.span.attrs({ children: icons.pause })`
  position: relative;
  left: 0rem;
  bottom: 0.5rem;
`;

const DurationWrapper = styled.span`
  font-style: italic;
  display: flex;
  margin-left: 1rem;
  flex-grow: 1;
  align-items: center;
`;

const Duration = styled.span`
  padding: 0 0 0 0.4rem;
  &::selection {
    background: none;
  }
`;

const Timeline = styled.span<{
  $grow?: number;
  $unplayed?: boolean;
  $ended?: boolean;
}>`
  flex-grow: ${({ $grow = 1 }) => $grow};
  height: 24px;
  cursor: pointer;
  border: none;
  margin: 0;
  color: white;
  display: flex;
  background: ${Colors.night};
  justify-content: flex-end;
  border-right: 4px solid #eee;
  position: relative;

  ${({ $ended }) =>
    $ended &&
    css`
      border: none;
    `}

  ${({ $unplayed = false }) =>
    $unplayed &&
    css`
      justify-content: flex-start;
      color: ${Colors.night};
      background: ${Colors.citrineDark};
      border: none;
    `};
`;

const CurrentTime = styled.span`
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 0.6rem 0 0.2rem;
  position: absolute;

  &::selection {
    background: none;
  }
`;

interface AudioControlsProps {
  episodeNum: number;
  duration: number;
}

export const AudioControls = ({ episodeNum, duration }: AudioControlsProps) => {
  const { isPlaying, playPause, currentTime, playingEpisode, seek, ended } =
    useContext(AudioContext);
  const playing = isPlaying(episodeNum);
  const isCurrent = playingEpisode === episodeNum;
  const halfwayDone = Boolean(Math.round(currentTime / duration));

  return (
    <Wrapper>
      <ButtonWrapper>
        <Button onClick={() => playPause(episodeNum)}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </Button>
      </ButtonWrapper>
      <DurationWrapper>
        {isCurrent ? (
          <>
            <Timeline
              onClick={() => seek(currentTime - 20)}
              $grow={currentTime}
              $ended={ended}
            >
              {halfwayDone && !ended && (
                <CurrentTime>{formatTimestamp(currentTime)}</CurrentTime>
              )}
            </Timeline>
            <Timeline
              onClick={() => seek(currentTime + 20)}
              $unplayed={true}
              $grow={duration - currentTime}
            >
              {!halfwayDone && (
                <CurrentTime>{formatTimestamp(currentTime)}</CurrentTime>
              )}
            </Timeline>
            <Duration>{formatTimestamp(duration)}</Duration>
          </>
        ) : (
          <Duration>{formatDuration(duration)}</Duration>
        )}
      </DurationWrapper>
    </Wrapper>
  );
};
