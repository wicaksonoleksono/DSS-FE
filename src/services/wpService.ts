import axios from "axios";
import { base_url } from "./config";

type Matrix = number[][];
type Wp = {
  criteria_weights: number[];
  decision_matrix: Matrix;
  criteria_types: string[];
};

const endpoint = {
  calculate: "/wp/calculate",
  get: "/wp/results",
  calculatev2: "/wp/v2/calculate",
};
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

type WpInput = {
  criteria: Criteria;
  decision_matrix: DecisionMatrix;
};

// Implementasi `calculateWpV2`
const calculateWpV2 = async ({ criteria, decision_matrix }: WpInput) => {
  try {
    console.log(criteria, decision_matrix);
    const response = await axios.post(`${base_url}${endpoint.calculatev2}`, {
      criteria,
      decision_matrix,
    });
    console.log("Calculation result WP V2:", response.data);
    return response.data;
  } catch (err: any) {
    window.alert(
      `Error calculating WP: ${err.response?.data?.message || err.message}`
    );
    return null;
  }
};

//second version
const calculateWp = async ({
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
    console.error("Error calculating WP:", error);
  }
};

const getWp = async () => {
  try {
    const response = await axios.get(`${base_url}${endpoint.get}`);
    console.log("Get WP result:", response.data);
    return response.data;
  } catch (err) {
    console.error(`Error fetching WP result: ${err}`);
  }
};

export { calculateWp, getWp, calculateWpV2 };
