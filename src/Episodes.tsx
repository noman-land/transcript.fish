import { css, styled } from "styled-components";
import { useDb } from "./dbHooks";

const formatDate = (date: string) =>
  date ? new Intl.DateTimeFormat().format(new Date(date)) : "";

const formatDuration = (duration: number) => {
  return `${Math.floor(duration / 60)} minutes`;
};

interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
}

const StyledTable = styled.table`
  background-color: #f8e44f;
  border-spacing: 0;

  & tr {
    position: relative;

    &:hover {
      background-color: #fff189;
    }

    &::after {
      content: " ";
      display: inline-block;
      height: 100%;
      width: 100%;
      opacity: 0.09;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
`;

const StyledTr = styled(({ image: __, ...props }) => <tr {...props} />)`
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
                  padding: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "stretch",
                    alignItems: "baseline",
                  }}
                >
                  <h3 style={{ marginTop: 0, flexGrow: 1 }}>
                    {episode}: {title}
                  </h3>
                  <span
                    style={{
                      marginLeft: 16,
                      opacity: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    {formatDate(pubDate)}
                  </span>
                </div>
                <span
                  style={{
                    opacity: 0.4,
                    fontSize: 17,
                    fontWeight: 600,
                  }}
                >
                  {formatDuration(duration)}
                </span>
                <p dangerouslySetInnerHTML={{ __html: description }} />
              </td>
            </StyledTr>
          )
        )}
      </tbody>
    </StyledTable>
  );
};
