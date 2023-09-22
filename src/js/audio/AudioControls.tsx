import { useContext } from 'react';
import { AudioContext } from './AudioContext';
import styled from 'styled-components';

const icons = {
  play: '⏵',
  pause: '⏸',
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  position: relative;
  width: 3rem;
  height: 3rem;
  border: 1px solid black;
  border-radius: 50%;
  margin-top: 1em;
`;

const Button = styled.button`
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

export const AudioControls = ({ episodeNum }: { episodeNum: number }) => {
  const { isPlaying, playPause } = useContext(AudioContext);
  return (
    <Wrapper>
      <Button onClick={() => playPause(episodeNum)}>
        {isPlaying(episodeNum) ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </Wrapper>
  );
};
