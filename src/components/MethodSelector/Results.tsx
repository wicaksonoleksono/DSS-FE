import React from "react";

// Tipe untuk menerima hasil dari API
type Props = {
  scores: Record<string, number>;
};

const Results: React.FC<Props> = ({ scores }) => {
  return (
    <div className="mt-4 p-4 bg-green-100 rounded">
      <h2 className="text-xl font-bold mb-4">Calculation Results</h2>
      <ul className="list-disc pl-6">
        {/* Loop melalui objek `scores` dan tampilkan key (nama alternatif) dan value (skor) */}
        {Object.entries(scores).map(([alternative, score]) => (
          <li key={alternative} className="mb-2">
            <span className="font-semibold">{alternative}:</span>{" "}
            <span>{score.toFixed(4)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
