import styled from 'styled-components';

const formatTimestamp = (duration: number) => {
  const minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(duration % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const StyledH4 = styled.h4`
  text-align: center;
  margin: 1rem 0;
  font-style: italic;

  &::before {
    content: '[';
  }

  &::after {
    content: ']';
  }
`;

export const Timestamp = ({ value }: { value: number }) => {
  const time = formatTimestamp(value);
  return (
    <StyledH4 aria-label="timestamp">
      <time dateTime={time}>{time}</time>
    </StyledH4>
  );
};
