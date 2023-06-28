import { useDb } from "./dbHooks";

const formatDate = (date: string) =>
  date ? new Intl.DateTimeFormat().format(new Date(date)) : "";

const formatDuration = (duration: number) => {
  const min = Math.floor(duration / 60);
  const sec = `${duration - min * 60}`.padEnd(2, "0");
  return `${min}:${sec}`;
};
interface Episode {
  image: string;
  description: string;
  duration: number;
  episode: number;
  title: string;
  pubDate: string;
}

export const Episodes = () => {
  const { episodes, episodeWords } = useDb();
  console.log(episodeWords);
  return (
    <table>
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
            <tr key={episode}>
              <td style={{ verticalAlign: "top", padding: 16 }}>
                <img width={128} src={image} />
              </td>
              <td
                style={{
                  textAlign: "left",
                  display: "flex",
                  alignContent: "stretch",
                  padding: "16px 16px 16px 8px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>
                      {episode}: {title}
                    </h3>
                    <span
                      style={{ marginLeft: 16, opacity: 0.4, fontWeight: 600 }}
                    >
                      {formatDate(pubDate)}
                    </span>
                  </div>
                  <p style={{ opacity: 0.4, fontWeight: 600, marginTop: 8 }}>
                    Runtime: {formatDuration(duration)}
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: description }} />
                </div>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};
