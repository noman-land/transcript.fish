import { useDb } from "./dbHooks";

const formatDate = (date: string) =>
  date ? new Intl.DateTimeFormat().format(new Date(date)) : "";

interface Episode {
  episode: number;
  title: string;
  pubDate: string;
}

export const Episodes = () => {
  const episodes = useDb();
  return (
    <table>
      <tbody>
        {episodes.map(({ episode, title, pubDate }: Episode) => (
          <tr key={episode}>
            <td style={{ textAlign: "right" }}>{episode}:</td>
            <td style={{ textAlign: "left" }}>{title}</td>
            <td style={{ textAlign: "right" }}>{formatDate(pubDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
