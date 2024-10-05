import React, { useState, useEffect } from "react";

// Types for criteria and sub-criteria
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
    { alternative: "Alternatif 1", criteria_scores: {} },
    { alternative: "Alternatif 2", criteria_scores: {} },
    { alternative: "Alternatif 3", criteria_scores: {} },
  ]);

  useEffect(() => {
    const updatedMatrix = matrix.map((alternative) => {
      const updatedScores = { ...alternative.criteria_scores };
      criteria.forEach((criterion) => {
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
      { alternative: `Alternatif ${matrix.length + 1}`, criteria_scores: {} },
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
        { name: `Kriteria ${criteria.length + 1}`, weight: 1, type: "benefit" },
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
      name: `${updatedCriteria[index].name}.Sub Kriteria ${
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

  const removeSubCriteria = (index: number, subIndex: number) => {
    const updatedCriteria = [...criteria];
    if (updatedCriteria[index].subcriteria) {
      updatedCriteria[index].subcriteria = updatedCriteria[
        index
      ].subcriteria!.filter((_, i) => i !== subIndex);
    }
    onSubmit(updatedCriteria, matrix);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Decision Matrix Input</h3>
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
      </div>

      {/* Form for editing criteria and sub-criteria */}
      {criteria.map((criterion, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={criterion.name}
              onChange={(e) => handleCriteriaNameChange(index, e.target.value)}
              className="border rounded px-2 py-1 mr-2 flex-1"
              placeholder="Criteria Name"
            />
            <input
              type="number"
              value={criterion.weight}
              onChange={(e) => handleWeightChange(index, e.target.value)}
              className="border rounded px-2 py-1 mr-2 w-24"
              placeholder="Weight"
            />
            <select
              value={criterion.type}
              onChange={(e) => {
                const updatedCriteria = [...criteria];
                updatedCriteria[index].type = e.target.value;
                onSubmit(updatedCriteria, matrix);
              }}
              className="border rounded px-2 py-1 mr-2 w-32"
            >
              <option value="benefit">Benefit</option>
              <option value="cost">Cost</option>
            </select>
            <button
              onClick={() => addSubCriteria(index)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
            >
              Add Sub-Criteria
            </button>
            <button
              onClick={() => removeCriteria(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          {/* Sub-Criteria Form */}
          {criterion.subcriteria && criterion.subcriteria.length > 0 && (
            <div className="ml-6 mt-2">
              {criterion.subcriteria.map((sub, subIndex) => (
                <div key={subIndex} className="flex items-center mb-1">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) =>
                      handleCriteriaNameChange(index, e.target.value, subIndex)
                    }
                    className="border rounded px-2 py-1 mr-2 flex-1"
                    placeholder="Sub-Criteria Name"
                  />
                  <input
                    type="number"
                    value={sub.weight}
                    onChange={(e) =>
                      handleWeightChange(index, e.target.value, subIndex)
                    }
                    className="border rounded px-2 py-1 mr-2 w-24"
                    placeholder="Weight"
                  />
                  <select
                    value={sub.type}
                    onChange={(e) => {
                      const updatedCriteria = [...criteria];
                      updatedCriteria[index].subcriteria![subIndex].type =
                        e.target.value;
                      onSubmit(updatedCriteria, matrix);
                    }}
                    className="border rounded px-2 py-1 mr-2 w-32"
                  >
                    <option value="benefit">Benefit</option>
                    <option value="cost">Cost</option>
                  </select>
                  <button
                    onClick={() => removeSubCriteria(index, subIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Table Wrapper with Overflow */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            {/* First Header Row */}
            <tr className="bg-gray-200">
              <th rowSpan={2} className="border px-4 py-2">
                Alternatif
              </th>
              {criteria.map((criterion, index) =>
                criterion.subcriteria && criterion.subcriteria.length > 0 ? (
                  <th
                    key={index}
                    colSpan={criterion.subcriteria.length}
                    className="border px-4 py-2"
                  >
                    {criterion.name}
                  </th>
                ) : (
                  <th key={index} rowSpan={2} className="border px-4 py-2">
                    {criterion.name}
                  </th>
                )
              )}
              <th rowSpan={2} className="border px-4 py-2">
                Action
              </th>
            </tr>
            {/* Second Header Row for Sub-Criteria */}
            <tr className="bg-gray-200">
              {criteria.map((criterion, index) =>
                criterion.subcriteria && criterion.subcriteria.length > 0
                  ? criterion.subcriteria.map((sub, subIndex) => (
                      <th
                        key={`${index}-${subIndex}`}
                        className="border px-4 py-2"
                      >
                        {sub.name}
                      </th>
                    ))
                  : null
              )}
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
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>

                {criteria.map((criterion, index) =>
                  criterion.subcriteria && criterion.subcriteria.length > 0 ? (
                    criterion.subcriteria.map((sub, subIndex) => (
                      <td
                        key={`${index}-${subIndex}`}
                        className="border px-4 py-2"
                      >
                        <input
                          type="number"
                          value={row.criteria_scores[sub.name] ?? "0"}
                          onChange={(e) =>
                            handleInputChange(
                              rowIndex,
                              sub.name,
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                    ))
                  ) : (
                    <td key={index} className="border px-4 py-2">
                      <input
                        type="number"
                        value={row.criteria_scores[criterion.name] || "0"}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            criterion.name,
                            e.target.value
                          )
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                  )
                )}

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
