import { useDb } from "./dbHooks";

const formatDate = (date: string) =>
  date ? new Intl.DateTimeFormat().format(new Date(date)) : "";

export const Episodes = () => {
  const episodes = useDb();
  return (
    <table>
      <tbody>
        {episodes.map(([number, title, , pubDate]) => (
          <tr key={number}>
            <td style={{ textAlign: "right" }}>{number}:</td>
            <td style={{ textAlign: "left" }}>{title}</td>
            <td style={{ textAlign: "right" }}>{formatDate(pubDate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
