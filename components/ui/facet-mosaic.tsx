const gridRows = [
  [[0, 0], [112, 0], [246, 0], [365, 0], [494, 0], [610, 0], [720, 0]],
  [[0, 76], [132, 76], [238, 76], [388, 76], [472, 76], [632, 76], [720, 76]],
  [[0, 164], [106, 164], [267, 164], [352, 164], [514, 164], [596, 164], [720, 164]],
  [[0, 250], [124, 250], [252, 250], [379, 250], [488, 250], [620, 250], [720, 250]],
] as const;

const colorRows = [
  [
    ["blue", "stone"], ["terracotta", "blue"], ["mustard", "green"],
    ["charcoal", "mustard"], ["green", "stone"], ["terracotta", "blue"],
  ],
  [
    ["green", "blue"], ["mustard", "charcoal"], ["stone", "terracotta"],
    ["blue", "mustard"], ["terracotta", "green"], ["charcoal", "stone"],
  ],
  [
    ["terracotta", "mustard"], ["blue", "green"], ["charcoal", "terracotta"],
    ["green", "stone"], ["mustard", "blue"], ["stone", "terracotta"],
  ],
] as const;

type FacetMosaicProps = {
  className: string;
  fit?: "meet" | "stretch";
};

export function FacetMosaic({ className, fit = "meet" }: FacetMosaicProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 720 250"
      preserveAspectRatio={fit === "stretch" ? "none" : "xMidYMid meet"}
      aria-hidden="true"
      focusable="false"
    >
      {gridRows.slice(0, -1).map((topRow, rowIndex) => {
        const bottomRow = gridRows[rowIndex + 1];

        return topRow.slice(0, -1).flatMap((topLeft, columnIndex) => {
          const topRight = topRow[columnIndex + 1];
          const bottomLeft = bottomRow[columnIndex];
          const bottomRight = bottomRow[columnIndex + 1];
          const diagonal = (rowIndex + columnIndex) % 2 === 0;
          const faces = diagonal
            ? [
                [topLeft, topRight, bottomRight],
                [topLeft, bottomRight, bottomLeft],
              ]
            : [
                [topLeft, topRight, bottomLeft],
                [topRight, bottomRight, bottomLeft],
              ];

          return faces.map((points, faceIndex) => {
            const pointList = points.map(([x, y]) => `${x},${y}`).join(" ");
            const color = colorRows[rowIndex][columnIndex][faceIndex];

            return (
              <polygon
                key={`${rowIndex}-${columnIndex}-${faceIndex}`}
                className={`facet-mosaic__face facet-mosaic__face--${color}`}
                points={pointList}
              />
            );
          });
        });
      })}
    </svg>
  );
}
