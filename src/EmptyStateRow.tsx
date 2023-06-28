export const EmptyStateRow = () => (
  <tr>
    <td
      style={{
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "stretch",
        padding: "4vw 3vw",
      }}
    >
      <h3 style={{ marginTop: 0, flexGrow: 1 }}>No results found</h3>
      <span>Try doing another search</span>
    </td>
  </tr>
);
