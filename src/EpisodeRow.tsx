import styled from 'styled-components';

const formatDate = (date: string) =>
  date
    ? new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date(date))
    : '';

const formatDuration = (duration: number) => {
  return `${Math.floor(duration / 60)} minutes`;
};

export interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
}

const StyledTr = styled.tr<{ $image: string }>`
  &::after {
    ${({ $image }) => `
      background-image: url(${$image});
    `}
  }
`;

export const EpisodeRow = ({
  episode: { image, episode, title, description, pubDate, duration },
}: {
  episode: Episode;
}) => (
  <StyledTr $image={image} key={episode}>
    <td
      style={{
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'stretch',
        padding: '4vw 3vw',
      }}
    >
      <h3 style={{ marginTop: 0, flexGrow: 1 }}>
        <span>{episode}</span>: {title}
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <span
          style={{
            opacity: 0.5,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {formatDate(pubDate)}
        </span>
      </div>
      <span
        className="description"
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <span
        style={{
          opacity: 0.5,
          fontWeight: 600,
          marginTop: 16,
        }}
      >
        {formatDuration(duration)}
      </span>
    </td>
  </StyledTr>
);
