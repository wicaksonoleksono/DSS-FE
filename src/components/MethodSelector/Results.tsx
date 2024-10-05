import React from "react";

// Type untuk menerima hasil dari API
type Props = {
  scores: Record<string, number>;
};

const Results: React.FC<Props> = ({ scores }) => {
  // Convert scores object to an array of [alternative, score] pairs
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  // Extract the top 3 alternatives
  const topThree = sortedScores.slice(0, 3);

  return (
    <div className="mt-4 p-4 bg-green-100 rounded">
      <h2 className="text-xl font-bold mb-4">Calculation Results</h2>

      {/* Ranking Alternatif Terbaik */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Ranking Alternatif Terbaik
        </h3>
        <ol className="list-decimal list-inside">
          {topThree.map(([alternative]) => (
            <li key={alternative} className="mb-1">
              {alternative}
            </li>
          ))}
        </ol>
      </div>

      {/* Sorted Scores List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Semua skor alternatif</h3>
        <ul className="list-disc pl-6">
          {sortedScores.map(([alternative, score]) => (
            <li key={alternative} className="mb-1">
              <span className="font-semibold">{alternative}:</span>{" "}
              <span>{score.toFixed(4)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results;
