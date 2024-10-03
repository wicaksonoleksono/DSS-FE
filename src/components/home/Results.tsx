import React from "react";

type Props = {
  scores: number[];
  alternativeNames: string[];
};

const Results: React.FC<Props> = ({ scores, alternativeNames }) => {
  return (
    <div>
      <h2>Calculation Results</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {alternativeNames[index]}: {score.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
