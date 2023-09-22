import styled from 'styled-components';
import { mediaUrl } from '../utils';
import { Ref, useMemo } from 'react';

const Audio = styled.audio``;

export const AudioPlayer = ({
  audioRef,
  episodeNum,
}: {
  audioRef: Ref<HTMLAudioElement>;
  episodeNum?: number;
}) => {
  const src = useMemo(() => mediaUrl(`audio/${episodeNum}.mp3`), [episodeNum]);
  return <Audio src={src} ref={audioRef} autoPlay={true} />;
};
