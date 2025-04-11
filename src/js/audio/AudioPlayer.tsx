import { mediaUrl } from '../utils';
import { Ref } from 'react';

export const AudioPlayer = ({
  audioRef,
  episodeNum,
}: {
  audioRef: Ref<HTMLAudioElement>;
  episodeNum?: number;
}) => {
  return (
    <audio
      src={episodeNum ? mediaUrl.audio(episodeNum) : ''}
      ref={audioRef}
      autoPlay={true}
    />
  );
};
