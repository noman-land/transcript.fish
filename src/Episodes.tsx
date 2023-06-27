import { useDb } from "./dbHooks";

const formatDate = (date: string) =>
  date ? new Intl.DateTimeFormat().format(new Date(date)) : "";

export const Episodes = () => {
  const episodes = useDb();
  return (
    <table>
      <tbody>
        {episodes.map(
          ({
            episode,
            title,
            pubDate,
          }: {
            episode: number;
            title: string;
            pubDate: string;
          }) => (
            <tr key={episode}>
              <td style={{ textAlign: "right" }}>{episode}:</td>
              <td style={{ textAlign: "left" }}>{title}</td>
              <td style={{ textAlign: "right" }}>{formatDate(pubDate)}</td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};
