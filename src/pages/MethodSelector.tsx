import React, { useState, useEffect } from "react";
import { calculateSawV2 } from "../services/sawService";
import { calculateWpV2 } from "../services/wpService";

import Results from "../components/MethodSelector/Results";
import DecisionMatrixForm from "../components/MethodSelector/DecisionMatrixForm";
// Tipe untuk struktur kriteria dan sub-kriteria
type SubCriteria = {
  name: string;
  weight: number;
  type: string;
};

type Criteria = {
  name: string;
  weight: number;
  type: string;
  subcriteria?: SubCriteria[];
};

type DecisionMatrix = {
  alternative: string;
  criteria_scores: { [key: string]: number };
}[];

const MethodSelector: React.FC = () => {
  // State management untuk kriteria, decision matrix, hasil, dan error
  const [criteria, setCriteria] = useState<Criteria[]>([
    { name: "Kriteria 1", weight: 1, type: "benefit" },
    { name: "Kriteria 2", weight: 2, type: "cost" },
    { name: "Kriteria 3", weight: 3, type: "benefit" },
  ]);
  const [matrix, setMatrix] = useState<DecisionMatrix>([]);
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [method, setMethod] = useState<"saw" | "wp">("saw");
  const [error, setError] = useState<string | null>(null); // State untuk menangani error

  const handleCalculation = async () => {
    setError(null);
    setScores(null);
    const data = { criteria, decision_matrix: matrix };
    try {
      const response =
        method === "saw"
          ? await calculateSawV2(data)
          : await calculateWpV2(data);
      setScores(response.scores);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred.");
    }
  };

  // Reset error setelah 5 detik
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="container mx-auto w-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sistem Pendukung Keputusan</h1>
      <div className="mb-4">
        {/* Button untuk memilih metode */}
        <button
          className={`bg-blue-500 text-white px-4 py-2 mr-2 rounded ${
            method === "saw" ? "bg-blue-700" : ""
          }`}
          onClick={() => setMethod("saw")}
        >
          Simple Additive Weighting (SAW)
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            method === "wp" ? "bg-blue-700" : ""
          }`}
          onClick={() => setMethod("wp")}
        >
          Weighted Product (WP)
        </button>
      </div>

      {/* Instruksi berdasarkan metode yang dipilih */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        {method === "saw" && (
          <div>
            <h3 className="text-lg font-bold">Instruksi penggunaan SAW</h3>
            <p>
              Untuk SAW, bobot kriteria harus bernilai 100%. Contoh: C1 = 0.25,
              C2 = 0.3, dst.
            </p>
          </div>
        )}
        {method === "wp" && (
          <div>
            <h3 className="text-lg font-bold">Instruksi penggunaan WP</h3>
            <p>
              Gunakan skala 1-5 pada bobot kriteria. Contoh: 1 (rendah), 3
              (cukup), 5 (tinggi).
            </p>
          </div>
        )}
      </div>

      <DecisionMatrixForm
        criteria={criteria}
        onMatrixChange={setMatrix}
        onSubmit={(newCriteria, newMatrix) => {
          setCriteria(newCriteria);
          setMatrix(newMatrix);
        }}
      />

      {error && (
        <div className="bg-red-200 text-red-700 p-4 rounded mb-4 whitespace-pre-wrap">
          <strong>Error:</strong> {error}
        </div>
      )}
      {scores && !error && <Results scores={scores} />}

      {/* Tombol untuk menghitung */}
      <button
        onClick={handleCalculation}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Calculate
      </button>
    </div>
  );
};

export default MethodSelector;
