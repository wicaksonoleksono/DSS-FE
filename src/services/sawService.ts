import axios from "axios";
import { base_url } from "./config";

type Matrix = number[][];
type Wp = {
  criteria_weights: number[];
  decision_matrix: Matrix;
  criteria_types: string[];
};

const endpoint = {
  calculate: "/saw/calculate",
  get: "/saw/results",
  calculatev2: "/saw/v2/calculate",
};

// Second version

// Definisikan tipe untuk input
type DecisionMatrix = {
  alternative: string;
  criteria_scores: { [key: string]: number };
}[];

type Criteria = {
  name: string;
  weight: number;
  type: string;
  subcriteria?: { name: string; weight: number; type: string }[];
}[];

type SawInput = {
  criteria: Criteria;
  decision_matrix: DecisionMatrix;
};

// Implementasi calculateSawV2
const calculateSawV2 = async ({ criteria, decision_matrix }: SawInput) => {
  try {
    console.log(criteria, decision_matrix);
    const response = await axios.post(`${base_url}${endpoint.calculatev2}`, {
      criteria,
      decision_matrix,
    });
    return response.data; // Kembalikan hasil kalkulasi
  } catch (err: any) {
    // Tangani error menggunakan `window.alert`
    window.alert(
      `Error calculating SAW: ${err.response?.data?.message || err.message}`
    );
    return null;
  }
};
//second version

const calculateSaw = async ({
  criteria_weights,
  decision_matrix,
  criteria_types,
}: Wp) => {
  try {
    const response = await axios.post(`${base_url}${endpoint.calculate}`, {
      criteria_weights,
      decision_matrix,
      criteria_types,
    });
    console.log("Calculation result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calculating SAW:", error);
  }
};

const getSaw = async () => {
  try {
    const response = await axios.get(`${base_url}${endpoint.get}`);
    console.log("Get SAW result:", response.data);
    return response.data;
  } catch (err) {
    console.error(`Error fetching SAW result: ${err}`);
  }
};

export { calculateSaw, getSaw, calculateSawV2 };
