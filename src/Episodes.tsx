import { css, styled } from "styled-components";
import { useDb } from "./dbHooks";
import { ReactNode } from "react";

const formatDate = (date: string) =>
  date
    ? new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(date))
    : "";

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

const StyledTable = styled.table`
  background-color: #f8e44f;
  border-collapse: collapse;

  & .description {
    // Some descriptions end in <br> tags
    // which add unwanted line breaks
    & > :last-child > br:last-child {
      display: none;
    }

    // Some descriptions are wrapped in a <p>
    // which adds unwanted margin
    & > p {
      margin: 0;
    }
  }

  & tr {
    position: relative;
    z-index: 0;

    &:not(:last-child) {
      border-bottom: 2px solid #d2bb3d;
    }

    &:hover {
      background-color: #fff189;
    }

    &::after {
      content: " ";
      display: inline-block;
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
  }
`;

const StyledTr = styled(
  ({ image: __, ...props }: { image: any; children: ReactNode }) => (
    <tr {...props} />
  )
)`
  &::after {
    ${({ image }) => css`
      background-image: url(${image});
    `}
  }
`;

export const Episodes = () => {
  const { episodes, episodeWords } = useDb();
  console.log(episodeWords);
  return (
    <StyledTable>
      <tbody>
        {episodes.map(
          ({
            episode,
            title,
            pubDate,
            image,
            description,
            duration,
          }: Episode) => (
            <StyledTr image={image} key={episode}>
              <td
                style={{
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "stretch",
                  padding: "4vw 3vw",
                }}
              >
                <h3 style={{ marginTop: 0, flexGrow: 1 }}>
                  {episode}: {title}
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
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
          )
        )}
      </tbody>
    </StyledTable>
  );
};
