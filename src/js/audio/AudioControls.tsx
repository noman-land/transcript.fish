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
`;

const Timeline = styled.span<{ $grow?: number; $unplayed?: boolean }>`
  flex-grow: ${({ $grow = 1 }) => $grow};
  height: 24px;
  border: none;
  margin: 0;
  color: white;
  background: ${Colors.night};
  border-right: 4px solid #eee;

  ${({ $unplayed = false }) =>
    $unplayed &&
    css`
      justify-content: flex-end;
      color: ${Colors.night};
      background: ${Colors.citrineDark};
      border-right: none;
    `};
`;

const CurrenTime = styled.span`
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 0.6rem 0 0.2rem;
`;

interface AudioControlsProps {
  episodeNum: number;
  duration: number;
}

export const AudioControls = ({ episodeNum, duration }: AudioControlsProps) => {
  const { isPlaying, playPause, currentTime, playingEpisode } =
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
            <Timeline $grow={currentTime}>
              {halfwayDone && (
                <CurrenTime>{formatTimestamp(currentTime)}</CurrenTime>
              )}
            </Timeline>
            <Timeline $unplayed={true} $grow={duration - currentTime}>
              {!halfwayDone && (
                <CurrenTime>{formatTimestamp(currentTime)}</CurrenTime>
              )}
            </Timeline>
            <Duration>{formatTimestamp(duration)}</Duration>
          </>
        ) : (
          formatDuration(duration)
        )}
      </DurationWrapper>
    </Wrapper>
  );
};
