import React, { useState } from "react";

type Matrix = number[][];
type Wp = {
  criteria_weights: number[];
  decision_matrix: Matrix;
  criteria_types: string[];
  alternative_names: string[];
};

type Props = {
  onSubmit: (data: Wp) => void;
};

const DynamicMatrix: React.FC<Props> = ({ onSubmit }) => {
  const [criteriaWeights, setCriteriaWeights] = useState<number[]>([0.0]);
  const [decisionMatrix, setDecisionMatrix] = useState<Matrix>([[0]]);

  const [criteriaTypes, setCriteriaTypes] = useState<string[]>(["benefit"]);

  const [criteriaNames, setCriteriaNames] = useState<string[]>(["Criteria 1"]);
  const [alternativeNames, setAlternativeNames] = useState<string[]>([
    "Kandidat 1",
  ]);

  const handleAddCriteria = () => {
    setCriteriaWeights([...criteriaWeights, 0.0]);
    setCriteriaTypes([...criteriaTypes, "benefit"]);
    setCriteriaNames([
      ...criteriaNames,
      `Criteria ${criteriaNames.length + 1}`,
    ]);
    const newMatrix = decisionMatrix.map((row) => [...row, 0]);
    setDecisionMatrix(newMatrix);
  };

  const handleRemoveCriteria = (index: number) => {
    const updatedWeights = criteriaWeights.filter((_, i) => i !== index);
    const updatedTypes = criteriaTypes.filter((_, i) => i !== index);
    const updatedNames = criteriaNames.filter((_, i) => i !== index);
    const newMatrix = decisionMatrix.map((row) =>
      row.filter((_, i) => i !== index)
    );
    setCriteriaWeights(updatedWeights);
    setCriteriaTypes(updatedTypes);
    setCriteriaNames(updatedNames);
    setDecisionMatrix(newMatrix);
  };

  const handleAddAlternative = () => {
    const newRow = new Array(criteriaWeights.length).fill(0);
    setDecisionMatrix([...decisionMatrix, newRow]);
    setAlternativeNames([
      ...alternativeNames,
      `Kandidat ${alternativeNames.length + 1}`,
    ]);
  };

  const handleRemoveAlternative = (index: number) => {
    const newMatrix = decisionMatrix.filter((_, i) => i !== index);
    const updatedAlternativeNames = alternativeNames.filter(
      (_, i) => i !== index
    );
    setDecisionMatrix(newMatrix);
    setAlternativeNames(updatedAlternativeNames);
  };

  const handleWeightChange = (index: number, value: string) => {
    const updatedWeights = [...criteriaWeights];
    updatedWeights[index] = parseFloat(value) || 0;
    setCriteriaWeights(updatedWeights);
    console.log("Updated Criteria Weights:", updatedWeights);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedTypes = [...criteriaTypes];
    updatedTypes[index] = value;
    setCriteriaTypes(updatedTypes);
  };

  const handleMatrixChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newMatrix = [...decisionMatrix];
    newMatrix[rowIndex][colIndex] = parseFloat(value) || 0;
    setDecisionMatrix(newMatrix);
    console.log("Updated Decision Matrix:", newMatrix);
  };

  const handleCriteriaNameChange = (index: number, name: string) => {
    const updatedNames = [...criteriaNames];
    updatedNames[index] = name;
    setCriteriaNames(updatedNames);
  };

  const handleAlternativeNameChange = (index: number, name: string) => {
    const updatedNames = [...alternativeNames];
    updatedNames[index] = name;
    setAlternativeNames(updatedNames);
  };

  const handleSubmit = () => {
    const data: Wp = {
      criteria_weights: criteriaWeights,
      decision_matrix: decisionMatrix,
      criteria_types: criteriaTypes,
      alternative_names: alternativeNames,
    };
    onSubmit(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-bold mb-4">
        Criteria and Alternatives Input
      </h2>

      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600"
          onClick={handleAddCriteria}
        >
          Add Criteria
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAddAlternative}
        >
          Add Alternative
        </button>
      </div>

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-black-200">
            <th className="border px-4 py-2">Kandidat / Kriteria </th>
            {criteriaNames.map((name, idx) => (
              <th key={idx} className="border px-4 py-2">
                <input
                  className="border rounded px-2 py-1"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    handleCriteriaNameChange(idx, e.target.value)
                  }
                />
                <button
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveCriteria(idx)}
                >
                  Remove
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {decisionMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border px-4 py-2">
                <input
                  className="border rounded px-2 py-1"
                  type="text"
                  value={alternativeNames[rowIndex]}
                  onChange={(e) =>
                    handleAlternativeNameChange(rowIndex, e.target.value)
                  }
                />
              </td>
              {row.map((value, colIndex) => (
                <td key={colIndex} className="border px-4 py-2">
                  <input
                    className="border rounded px-2 py-1"
                    type="number"
                    value={isNaN(value) ? "" : value}
                    onChange={(e) =>
                      handleMatrixChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
              <td className="border px-4 py-2">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveAlternative(rowIndex)}
                >
                  Remove Alternative
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h3 className="font-bold text-4xl mb-10">
          Sub-Parameter kriteria benefit atau cost
        </h3>
        {criteriaWeights.map((weight, index) => (
          <div key={index} className="mb-2 flex items-center">
            <label className="mr-2">Weight for {criteriaNames[index]}:</label>
            <input
              className="border rounded px-2 py-1 mr-2"
              type="number"
              value={isNaN(weight) ? "" : weight}
              onChange={(e) => handleWeightChange(index, e.target.value)}
            />

            <select
              className="border rounded px-2 py-1"
              value={criteriaTypes[index]}
              onChange={(e) => handleTypeChange(index, e.target.value)}
            >
              <option value="benefit">Benefit</option>
              <option value="cost">Cost</option>
            </select>
          </div>
        ))}
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
        onClick={handleSubmit}
      >
        Calculate
      </button>
    </div>
  );
};

export default DynamicMatrix;
