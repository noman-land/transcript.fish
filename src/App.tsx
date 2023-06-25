import { useEffect, useState } from "react";

export const App = () => {
  const [episodes] = useState([]);
  useEffect(() => {
    // fetch('').then().catch();
  }, []);

  return (
    <>
      <h1>transcript.fish</h1>
      <img src="https://upload.wikimedia.org/wikipedia/en/e/e1/No_Such_Thing_As_A_Fish_logo.jpg" />
      {/* <img src="/images/logo.jpg" /> */}
      <ul>
        {episodes.map((episode) => (
          <li>{episode}</li>
        ))}
      </ul>
    </>
  );
};
