import { useEffect, useState } from "react";

export const Episodes = () => {
  const [episodes] = useState([]);
  useEffect(() => {
    // fetch('').then().catch();
  }, []);

  return (
    <ul>
      {episodes.map((episode) => (
        <li>{episode}</li>
      ))}
    </ul>
  );
};
