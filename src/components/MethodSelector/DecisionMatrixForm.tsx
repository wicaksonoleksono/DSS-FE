import React, { useState, useEffect } from "react";

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

type Props = {
  criteria: Criteria[];
  onMatrixChange: (matrix: DecisionMatrix) => void;
  onSubmit: (criteria: Criteria[], matrix: DecisionMatrix) => void;
};

const DecisionMatrixForm: React.FC<Props> = ({
  criteria,
  onMatrixChange,
  onSubmit,
}) => {
  const [matrix, setMatrix] = useState<DecisionMatrix>([
    { alternative: "A1", criteria_scores: {} },
    { alternative: "A2", criteria_scores: {} },
    { alternative: "A3", criteria_scores: {} },
  ]);

  useEffect(() => {
    const updatedMatrix = matrix.map((alternative) => {
      const updatedScores = { ...alternative.criteria_scores };
      criteria.forEach((criterion) => {
        // Tambahkan kolom untuk kriteria utama dan sub-kriteria
        if (criterion.subcriteria && criterion.subcriteria.length > 0) {
          criterion.subcriteria.forEach((sub) => {
            if (!(sub.name in updatedScores)) {
              updatedScores[sub.name] = 0;
            }
          });
        } else {
          if (!(criterion.name in updatedScores)) {
            updatedScores[criterion.name] = 0;
          }
        }
      });
      return { ...alternative, criteria_scores: updatedScores };
    });
    setMatrix(updatedMatrix);
  }, [criteria]);

  useEffect(() => {
    const result = {
      criteria,
      decision_matrix: matrix,
    };
    console.log(JSON.stringify(result, null, 2));
  }, [criteria, matrix]);

  const handleInputChange = (
    alternativeIndex: number,
    criterionKey: string,
    value: string
  ) => {
    const updatedMatrix = [...matrix];
    updatedMatrix[alternativeIndex].criteria_scores[criterionKey] =
      parseFloat(value) || 0;
    setMatrix(updatedMatrix);
    onMatrixChange(updatedMatrix);
  };

  const addAlternative = () => {
    setMatrix([
      ...matrix,
      { alternative: `A${matrix.length + 1}`, criteria_scores: {} },
    ]);
  };

  const removeAlternative = (index: number) => {
    const updatedMatrix = matrix.filter((_, i) => i !== index);
    setMatrix(updatedMatrix);
    onMatrixChange(updatedMatrix);
  };

  const addCriteria = () => {
    onSubmit(
      [
        ...criteria,
        { name: `C${criteria.length + 1}`, weight: 1, type: "benefit" },
      ],
      matrix
    );
  };

  const addSubCriteria = (index: number) => {
    const updatedCriteria = [...criteria];
    if (!updatedCriteria[index].subcriteria) {
      updatedCriteria[index].subcriteria = [];
    }
    updatedCriteria[index].subcriteria!.push({
      name: `${updatedCriteria[index].name}.SC${
        updatedCriteria[index].subcriteria!.length + 1
      }`,
      weight: 1,
      type: "benefit",
    });
    onSubmit(updatedCriteria, matrix);
  };

  const removeCriteria = (index: number) => {
    const updatedCriteria = criteria.filter((_, i) => i !== index);
    onSubmit(updatedCriteria, matrix);
  };

  const handleCriteriaNameChange = (
    index: number,
    newName: string,
    subIndex?: number
  ) => {
    const updatedCriteria = [...criteria];
    if (subIndex !== undefined) {
      updatedCriteria[index].subcriteria![subIndex].name = newName;
    } else {
      updatedCriteria[index].name = newName;
    }
    onSubmit(updatedCriteria, matrix);
  };

  const handleWeightChange = (
    index: number,
    value: string,
    subIndex?: number
  ) => {
    const updatedCriteria = [...criteria];
    if (subIndex !== undefined) {
      updatedCriteria[index].subcriteria![subIndex].weight =
        parseFloat(value) || 0;
    } else {
      updatedCriteria[index].weight = parseFloat(value) || 0;
    }
    onSubmit(updatedCriteria, matrix);
  };

  const createTableHeaders = () => {
    const headers: string[] = [];
    criteria.forEach((criterion) => {
      if (criterion.subcriteria && criterion.subcriteria.length > 0) {
        criterion.subcriteria.forEach((sub) => headers.push(sub.name));
      } else {
        headers.push(criterion.name);
      }
    });
    return headers;
  };

  const handleSubmit = () => {
    const sanitizedCriteria = criteria.map((criterion) => ({
      ...criterion,
      subcriteria: criterion.subcriteria || [],
    }));

    const result = {
      criteria: sanitizedCriteria,
      decision_matrix: matrix,
    };
    console.log(JSON.stringify(result, null, 2));
    onSubmit(sanitizedCriteria, matrix);
  };

  return (
    <div>
      <h3>Decision Matrix Input</h3>
      <div className="mb-4">
        <button
          onClick={addCriteria}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
        >
          Add Criteria
        </button>
        <button
          onClick={addAlternative}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Alternative
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Submit
        </button>
      </div>

      {/* Form untuk mengubah bobot kriteria dan nama sub-kriteria */}
      {criteria.map((criterion, index) => (
        <div key={index} className="mb-2">
          <input
            type="text"
            value={criterion.name}
            onChange={(e) => handleCriteriaNameChange(index, e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <input
            type="number"
            value={criterion.weight}
            onChange={(e) => handleWeightChange(index, e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <select
            value={criterion.type}
            onChange={(e) => {
              const updatedCriteria = [...criteria];
              updatedCriteria[index].type = e.target.value;
              onSubmit(updatedCriteria, matrix);
            }}
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="benefit">Benefit</option>
            <option value="cost">Cost</option>
          </select>
          <button
            onClick={() => addSubCriteria(index)}
            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
          >
            Add Sub-Criteria
          </button>
          <button
            onClick={() => removeCriteria(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove Criteria
          </button>

          {/* Sub-Criteria Form */}
          {criterion.subcriteria && criterion.subcriteria.length > 0 && (
            <div className="ml-4">
              {criterion.subcriteria.map((sub, subIndex) => (
                <div key={subIndex} className="mb-1">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) =>
                      handleCriteriaNameChange(index, e.target.value, subIndex)
                    }
                    className="border rounded px-2 py-1 mr-2"
                  />
                  <input
                    type="number"
                    value={sub.weight}
                    onChange={(e) =>
                      handleWeightChange(index, e.target.value, subIndex)
                    }
                    className="border rounded px-2 py-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Pembungkus tabel dengan overflow */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Alternatif</th>
              {createTableHeaders().map((header, index) => (
                <th key={index} className="border px-4 py-2">
                  {header}
                </th>
              ))}
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={row.alternative}
                    onChange={(e) => {
                      const updatedMatrix = [...matrix];
                      updatedMatrix[rowIndex].alternative = e.target.value;
                      setMatrix(updatedMatrix);
                      onMatrixChange(updatedMatrix);
                    }}
                    className="border rounded px-2 py-1"
                  />
                </td>
                {createTableHeaders().map((header) => (
                  <td key={header} className="border px-4 py-2">
                    <input
                      type="number"
                      value={row.criteria_scores[header] || 0}
                      onChange={(e) =>
                        handleInputChange(rowIndex, header, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    />
                  </td>
                ))}
                <td className="border px-4 py-2">
                  <button
                    onClick={() => removeAlternative(rowIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DecisionMatrixForm;
