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
    get: "/wp/results"
};

const calculateWp = async ({ criteria_weights, decision_matrix, criteria_types }: Wp) => {
    try {
        const response = await axios.post(
            `${base_url}${endpoint.calculate}`,
            { criteria_weights, decision_matrix, criteria_types } 
        );
        console.log("Calculation result:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error calculating WP:", error);
    }
};

const getWp = async () => {
    try {
        const response = await axios.get(
            `${base_url}${endpoint.get}`
        );
        console.log("Get WP result:", response.data);
        return response.data; 
    } catch (err) {
        console.error(`Error fetching WP result: ${err}`);
    }
};

export { calculateWp, getWp };
